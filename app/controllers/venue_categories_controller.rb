require_relative '../models/category'
require_relative '../models/venue'

class VenueCategoriesController < ApplicationController
  self.model_class = Category
  self.resource_param = :category

  before_action :find_venue

  def list_resources(params)
    @venue.categories
  end

  def create_resource!(resource, _params)
    @venue.categories << resource # maybe?
  end

  def find_resource(resource_id)
    @venue.categories.find(resource_id)
  end

  protected

  def find_venue
    @venue ||= Venue.find(params[:venue_id])

    enforce_updateable!(@venue)
  end
end
