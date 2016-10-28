require_relative 'brewery_db_controller'
require_relative '../models/upc'

class BreweryDbUpcsController < BreweryDbController
  self.model_class = Upc

  protected

  # debug
  def find_resources
    Beer.source_list(name: '*peron*')
  end
end
