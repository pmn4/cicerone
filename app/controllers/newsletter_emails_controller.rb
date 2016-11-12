require_relative '../models/email'

class NewsletterEmailsController < ApplicationController
  self.model_class = NewsletterEmail
  self.resource_param = :newsletter_email

  def show
    respond_with newsletter.emails.find(params[:id])
  end

  def create
    resource = create_email(resource_params)

    newsletter.newsletter_emails << resource

    # @todo: figure this out
    # respond_with resource.as_json(as_json_options)
    render(json: resource.as_json(as_json_options))
  end

  protected

  def newsletter
    @newsletter ||= Newsletter.find(params[:newsletter_id])
  end

  def create_email(resource_params)
    self.class.model_class.new(resource_params)
  end
end
