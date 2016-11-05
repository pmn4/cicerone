class Newsletter < ActiveRecord::Base
  extend Base

  has_many :newsletter_blocks
  has_many :newsletter_emails

  alias_method :blocks, :newsletter_blocks
  alias_method :emails, :newsletter_emails

  def serialiazable_hash(options = {})
    options = options.try(:clone) || {}

    options[:except] = Array(options[:except])
    options[:except] << :newsletter_blocks << :newsletter_emails

    if options[:include].is_a?(Hash)
      options[:include][:blocks] = {}
    else
      options[:include] = Array(options[:include])
      options[:include] << :blocks
    end

    super(options)
  end
end
