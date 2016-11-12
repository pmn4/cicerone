class Newsletter < ActiveRecord::Base
  extend Base

  has_many :newsletter_blocks
  has_many :newsletter_emails

  belongs_to :user, foreign_key: :created_by_id

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

  class << self
    def accessible_to(user)
      user.newsletters
    end
  end
end
