RESOURCE_ROUTES = %i(index create show update destroy).freeze

Rails.application.routes.draw do
  devise_for :users

  resources :newsletters do
    resources :blocks, controller: 'newsletter_blocks'
  end
end
