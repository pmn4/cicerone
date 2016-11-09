class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_filter :doorkeeper_authorize!
end
