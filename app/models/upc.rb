class Upc < BreweryDb
  self.plural_resource_path = :'search/upc'

  class << self
    def create_by_key(*)
      raise NotImplementedError
    end

    def find_or_create_by_key(*)
      raise NotImplementedError
    end

    def source_find(*)
      raise NotImplementedError
    end
  end
end
