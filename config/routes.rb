app_root = File.dirname(File.absolute_path(__FILE__))
Dir.glob("#{app_root}/../app/controllers/**/*_controller.rb", &method(:require))

RESOURCE_ROUTES = %i(index create show update destroy).freeze
READ_ONLY_RESOURCE_ROUTES = %i(index create show).freeze

Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users, controllers: {
    omniauth_callbacks: 'omniauth_callbacks',
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  resources :newsletters do
    resources :blocks, controller: 'newsletter_blocks'

    resources :emails, only: READ_ONLY_RESOURCE_ROUTES, controller: 'newsletter_emails'

    resources :beer_blocks, only: :create, controller: 'beer_newsletter_blocks'

    resources :content_blocks, only: :create, controller: 'content_newsletter_blocks'
  end

  resources :beers, controller: :brewery_db_beers

  resources :upcs, only: :index, controller: :brewery_db_upcs

  root to: 'pages#index'
end
