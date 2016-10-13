class ApplicationController < ActionController::Base
  class PermissionError < StandardError; end

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  class << self
    attr_accessor :model_class, :application_property, :resource_param
  end

  def index
    resources = list_resources(params)

    respond_with(resources)
  end

  def create
    resource = self.class.model_class.new(resource_params)
    resource.created_by = current_user

    unless resource.createable_by?(current_user, resource_params)
      raise PermissionError, :create
    end

    create_resource!(resource, resource_params)

    respond_with(resource)
  rescue PermissionError => e
    permission_error!(resource, e)
  rescue ActiveRecord::RecordInvalid => e
    validation_error!(resource, e)
  rescue ActiveRecord::RecordNotUnique => e
    duplicate_entry!(resource, e)
  end

  def show
    resource = find_resource(params[:id], includes)

    unless resource.readable_by?(current_user)
      raise PermissionError, :read
    end

    respond_with(resource)
  rescue PermissionError => e
    permission_error!(resource, e.message)
  rescue ActiveRecord::RecordNotFound => e
    not_found!(resource, e)
  end

  def update
    resource =
      application.send(application_property)
        .find(params[:id])

    update_resource!(resource, resource_params)

    respond_with(resource)
  rescue PermissionError => e
    permission_error!(resource, e)
  rescue ActiveRecord::RecordInvalid => e
    validation_error!(resource, e)
  rescue ActiveRecord::RecordNotFound => e
    not_found!(resource, e)
  rescue ActiveRecord::RecordNotUnique => e
    duplicate_entry!(resource, e)
  end

  def destroy
    resource = self.class.model_class.find(params[:id])

    unless resource.deletable_by?(current_user)
      raise PermissionError, :delete
    end

    destroy_resource!(resource)

    respond_to do |format|
      format.json { head :no_content }

      format.html do
        flash 'Deleted.'
        redirect '/' # <Resource>Controller#index
      end
    end
  rescue PermissionError => e
    permission_error!(resource, e)
  end

  protected

  def resource_params
    params
      .require(self.class.resource_param)
      .permit(self.class.model_class.column_names)
  end

  def list_resources(params)
    self.class.model_class.all
  end

  def create_resource!(resource, _params)
    resource.save!
  end

  def find_resource(resource_id, _params)
    self.class.model_class.find(resource_id)
  end

  def update_resource!(resource, _params)
    resource.save!
  end

  def destry_resource!(resource, _params)
    resource.destroy!
  end

  def not_found!(resource, error)
    fail!(resource, error.message, :not_found)
  end

  def permission_error!(resource, error)
    fail!(resource, error.message, :unauthorized)
  end

  def validation_error!(resource, error)
    fail!(resource, error.message, :unprocessable_entity)
  end

  def duplicate_entry(resource, error)
    fail!(resource, error.message,  :conflict)
  end

  private

  def fail!(resource, errors, status)
    errors = Array(errors)

    respond_with(resource) do |format|
      format.json { render(json: errors.to_json, status: status) }

      format.html do
        flash errors

        @resource = resource
        render(action: 'new')
      end
    end
  end
end
