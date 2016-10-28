class ApiError < StandardError
  attr_accessor :code

  def initialize(code, message)
    super(message)

    self.code = code
  end

  def as_response
    { text: message, status: code, content_type: 'text/plain' }
  end

  class << self
    def from_response(response)
      body = response_body(response.body)

      new(response.code, body[:errorMessage])
    end

    def response_body(body)
      JSON.parse(body).symbolize_keys
    rescue
      {}
    end
  end
end

class OfflineError < ApiError
  def initialize(*)
    super(0, 'Server is Offline')
  end
end

class BreweryDb < ActiveRecord::Base
  extend Base

  cattr_accessor :token
  attr_accessor :response

  after_initialize :parse_response_json

  def serializable_hash(options = {})
    options = options.try(:clone) || {}

    options[:methods] = Array(options[:methods])
    options[:methods] << :response

    options[:except] = Array(options[:except])
    options[:except] << :response_json

    super(options)
  end

  private

  def parse_response_json
    self.response = JSON.parse(response_json)
  rescue
    nil
  end

  class << self
    attr_accessor :singular_resource_path, :plural_resource_path

    def create_by_key(key)
      source_find(key, default_find_params).tap(&:save!)
    end

    def find_or_create_by_key(key)
      where(key: key).limit(1).first || create_by_key(key)
    end

    def from_response(response, attributes = {})
      data = JSON.parse(response.body)['data']

      if data.is_a?(Array)
        data.map { |d| from_datum(d, attributes) }
      elsif data.present?
        from_datum(data, attributes)
      end
    end

    def from_datum(datum, attributes = {})
      new({
        response: datum,
        response_json: datum.to_json
      }.reverse_merge(attributes || {}))
    end

    def source_list(params = {})
      url = api_url(plural_resource_path)

      response = get(url, params)

      from_response(response)
    end

    def source_find(id, params)
      url = api_url(singular_resource_path, id)

      response = get(url, params)

      from_response(response, { key: id, uri: url })
    end

    protected

    def default_find_params
      nil # override
    end

    def ensure_success(response)
      raise OfflineError if response.code.zero?
      raise ApiError.from_response(response) unless response.code.between?(200, 299)
      # raise ApiError, response.body if response.code == 400
      # raise ApiNotAuthorizedError, response.body if response.code == 401
      # raise PaymentRequiredError, response.body if response.code == 402
      # raise ApiNotFoundError, response.body if response.code == 404
      # raise ImplementationError, response.body if response.code == 405
      # raise ApiServerError, response.body if response.code == 500
    end

    def get(url, params = {})
      Typhoeus.get(url, {
        verbose: true,
        params: auth_token.merge(params)
      }).tap do |response|
        puts response.body
        # puts TyphoeusToCurl.new(response.request).to_curl

        ensure_success(response)
      end
    end

    def auth_token
      return {} if token.nil?

      { key: token }
    end

    private

    def api_url(path, resource_id = nil)
      url = "http://api.brewerydb.com/v2/#{ path }"

      return url if resource_id.nil?

      "#{ url }/#{ resource_id }"
    end
  end
end
