class BreweryDbController < ApplicationController
  def index
    resources = find_resources

    respond_with(resources)
  rescue ApiError => e
    render e.as_response
  end

  # id should be the breweryDb id
  def show
    resource = find_resource(params[:id])

    respond_with(resource)
  rescue ApiError => e
    render e.as_response
  end

  def create; raise NotImplementedError; end
  def update; raise NotImplementedError; end
  def destroy; raise NotImplementedError; end

  protected

  def find_resources
    request_params = {}
    if params[:name].present?
      request_params[:name] = "*#{ params[:name].gsub(' ', '*') }*"
    end

    self.class.model_class.source_list(request_params)
  end

  def find_resource(id)
    return self.class.model_class.create_by_key(id) if params[:force] == 'true'

    self.class.model_class.find_or_create_by_key(id)
  end
end
