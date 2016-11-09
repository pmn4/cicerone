class Users::SessionsController < Devise::SessionsController
  skip_before_filter :doorkeeper_authorize!
end
