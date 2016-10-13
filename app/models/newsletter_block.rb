class NewsletterBlock < ActiveRecord::Base
  belongs_to :newsletter
end

class BeerNewsletterBlock < NewsletterBlock
  belongs_to :beer
end

class ContentNewsletterBlock < NewsletterBlock
end
