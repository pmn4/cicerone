class Email < ActiveRecord::Base
  has_many :send_confirmations
end

class NewsletterEmail < Email
  belongs_to :venue
  belongs_to :created_by, class_name: 'User'
end
