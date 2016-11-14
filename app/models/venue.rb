class Venue < ActiveRecord::Base
  extend Base

  belongs_to :created_by, class_name: 'User'
  has_many :newsletters
end
