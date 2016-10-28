require_relative 'brewery_db_controller'
require_relative '../models/beer'

class BreweryDbBeersController < BreweryDbController
  self.model_class = Beer

  protected

  # withBreweries
  def find_resources
    params[:withBreweries] = 'Y'

    super
  end
end
