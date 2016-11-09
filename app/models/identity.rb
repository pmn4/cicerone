class Identity < ActiveRecord::Base
  belongs_to :user

  class << self
    def find_with_omniauth(auth)
      find_by(uid: auth['uid'], provider: auth['provider'])
    end

    def create_with_omniauth(auth)
      create(uid: auth['uid'], provider: auth['provider'])
    end

    # pass a user to add an identity to an existing user
    # (important when the email addresses do not match)
    def find_or_create_by_oauth(auth, user = nil)
      # find the identity
      identity = find_with_omniauth(auth)

      # find the user based on auth email, if not provided
      user ||= find_or_create_user_by_oauth(auth)

      # no identity, ok, create one and add it to this user
      if identity.nil?
        identity = from_auth_hash(auth)

        user.identities << identity
      # identity belongs to someone else? update it? not really sure
      elsif identity.user_id != user.id
        identity.update_attribute(:user_id, user.id)
      end

      identity
    end

    protected

    def from_auth_hash(auth)
      new({
        provider: auth.provider,
        uid: auth.uid,
        user_name: auth.extra.canonicalUrl.split('/').last
      })
    end

    def find_or_create_user_by_oauth(auth)
      user = User.where(email: auth.info.email).first

      return user unless user.nil?

      User.create!(
        first_name: auth.info.first_name || auth.info.name,
        last_name: auth.info.last_name,
        email: auth.info.email,
        password: Devise.friendly_token[0,20]
      )
    end
  end
end

class FoursquareIdentity < Identity
  class << self
    def from_auth_hash(auth)
      profile_photo_url =
        auth.info.image.prefix.sub(%r{/$}, '') + auth.info.image.suffix

      user_name = auth.extra.raw_info.canonicalUrl.split('/').last

      new({
        profile_email: auth.info.email,
        profile_photo_url: profile_photo_url,
        profile_url: auth.extra.raw_info.canonicalUrl,
        provider: auth.provider,
        uid: auth.uid,
        user_name: user_name
      })
    end
  end
end

class UntappdIdentity < Identity
  class << self
    def from_auth_hash(auth)
      new({
        profile_email: auth.info.email,
        profile_photo_url: auth.extra.raw_info.user_avatar_hd,
        profile_url: auth.extra.raw_info.untappd_url,
        provider: auth.provider,
        uid: auth.uid,
        user_name: auth.extra.raw_info.user_name
      })
    end
  end
end
