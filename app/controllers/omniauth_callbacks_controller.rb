class OmniauthCallbacksController < ApplicationController
  def foursquare
    auth = env['omniauth.auth']

    user = Identity.find_or_create_by_foursquare_oauth(auth)

    if user.persisted?
      sign_in_and_redirect user, event: :authentication
    else
      session['devise.foursquare_uid'] = auth

      redirect_to new_user_registration_url
    end
  end
end
