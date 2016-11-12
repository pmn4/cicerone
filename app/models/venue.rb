class Venue < ActiveRecord::Base
  belongs_to :user, foreign_key: :created_by_id
end
