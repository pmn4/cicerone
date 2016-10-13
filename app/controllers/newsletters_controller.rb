class NewslettersController < ApplicationController
  respond_to :html, :json

  self.resource_param = :newsletter
  self.model_class = Newsletter
end
