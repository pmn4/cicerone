require_relative '../models/newsletter'

class NewslettersController < ApplicationController
  self.resource_param = :newsletter
  self.model_class = Newsletter

  skip_before_action :doorkeeper_authorize!

  protected

  def enforce_readable!(_resource)
    # if published
    return unless request.format.json?

    super
  end

  def list_resources(params)
    self.class.model_class.accessible_to(current_user)
      .includes(:newsletter_blocks)
  end

  def as_json_options
    { include: :blocks }
  end
end
