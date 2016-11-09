require_relative '../models/identity'

class OmniauthCallbacksController < ApplicationController
  skip_before_filter :doorkeeper_authorize!

  def foursquare
    auth = env['omniauth.auth']

    identity = FoursquareIdentity.find_or_create_by_oauth(auth, current_user)

    if identity.user.persisted?
      sign_in_and_redirect identity.user, event: :authentication
    else
      session['devise.foursquare_uid'] = auth

      redirect_to new_user_registration_url
    end
  end

  def untappd
    auth = env['omniauth.auth']

    identity = UntappdIdentity.find_or_create_by_oauth(auth, current_user)

    if identity.user.persisted?
      sign_in_and_redirect identity.user, event: :authentication
    else
      session['devise.untappd_uid'] = auth

      redirect_to new_user_registration_url
    end
  end

  def failure
    raise NotImplementedError, 'hi Pat'
  end
end
