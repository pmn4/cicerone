class Beer < BreweryDb
  extend Base

  DEFAULT_PARAMS = {
    withBreweries: 'Y'
  }.freeze

  self.singular_resource_path = :beer
  self.plural_resource_path = :beers

  has_many :beer_newsletter_blocks

  # Similar to... for discovering new beers
  # has_many :similar_beers, class_name: 'Beer'

  class << self
    protected

    def default_find_params
      DEFAULT_PARAMS
    end
  end
end
