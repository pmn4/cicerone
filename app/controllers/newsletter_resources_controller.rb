class NewsletterResourcesController < ApplicationController
  before_action :find_newsletter

  protected

  def find_newsletter
    @newsletter ||= Newsletter.find(params[:newsletter_id])

    enforce_updateable!(@newsletter)
  end
end
