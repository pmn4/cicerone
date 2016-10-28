class NewsletterBlock < ActiveRecord::Base
  belongs_to :newsletter

  def block_type
    self.class.classname.sub(%r(#{NewsletterBlock.classname}$), '')
  end

  def serializable_hash(options = {})
    options = options.try(:clone) || {}

    options[:methods] = Array(options[:methods])
    options[:methods] << :block_type

    super(options)
  end

  class << self
    def classname
      name.split('::').last
    end
  end
end

class BeerNewsletterBlock < NewsletterBlock
  belongs_to :beer, foreign_key: :brewery_db_id

  validates :brewery_db_id, presence: true

  def serializable_hash(options = {})
    options = options.try(:clone) || {}

    if options[:include].is_a?(Hash)
      options[:include][:beer] = {}
    else
      options[:include] = Array(options[:include])
      options[:include] << :beer
    end

    super(options)
  end
end

class ContentNewsletterBlock < NewsletterBlock
end
