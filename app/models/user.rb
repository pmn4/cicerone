class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :omniauthable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauth_providers => %i(foursquare)

  has_many :identities

  def self.create_with_omniauth(info)
    create(name: info['name'])
  end
end
