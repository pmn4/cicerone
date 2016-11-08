class Identity < ActiveRecord::Base
  belongs_to :user

  def self.find_with_omniauth(auth)
    find_by(uid: auth['uid'], provider: auth['provider'])
  end

  def self.create_with_omniauth(auth)
    create(uid: auth['uid'], provider: auth['provider'])
  end

  class << self
    def find_or_create_by_foursquare_oauth(auth)
p 'A'*100, auth
      identity = where(provider: auth.provider, uid: auth.uid).first

      return identity.user unless identity.nil?

      user = User.where(email: auth.info.email).first

      user ||= User.create!(
        name: auth.info.name,
        email: auth.info.email,
        password: Devise.friendly_token[0,20]
      )

      user.tap do |user|
        create!(
          provider: auth.provider,
          uid: auth.uid,
          user_id: user.id
        )
      end
    end
  end
end
