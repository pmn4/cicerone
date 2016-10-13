class Newsletter < ActiveRecord::Base
  extend Base

  has_many :newsletter_blocks

  alias_method :blocks, :newsletter_blocks
end
