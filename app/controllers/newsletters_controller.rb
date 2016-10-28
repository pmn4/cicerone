require_relative '../models/newsletter'

class NewslettersController < ApplicationController
  self.resource_param = :newsletter
  self.model_class = Newsletter

  protected

  def list_resources(params)
    self.class.model_class.includes(:newsletter_blocks).all
  end

  def as_json_options
    { include: :blocks }
  end
end
