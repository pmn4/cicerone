class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :omniauthable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauth_providers => %i(foursquare untappd)

  has_many :identities
  has_many :newsletters, foreign_key: :created_by_id
  has_many :newsletter_blocks, foreign_key: :created_by_id
  has_many :venues, foreign_key: :created_by_id
end
