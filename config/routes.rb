app_root = File.dirname(File.absolute_path(__FILE__))
Dir.glob("#{app_root}/../app/controllers/**/*_controller.rb", &method(:require))

RESOURCE_ROUTES = %i(index create show update destroy).freeze

Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users, controllers: {
    omniauth_callbacks: 'omniauth_callbacks',
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  resources :newsletters do
    resources :blocks, controller: 'newsletter_blocks'

    # resources :emails, only: %i(index create show), controller: 'newsletter_emails'

    resources :beer_blocks, only: :create, controller: 'beer_newsletter_blocks'

    resources :content_blocks, only: :create, controller: 'content_newsletter_blocks'
  end

  resources :beers, controller: :brewery_db_beers

  resources :upcs, only: :index, controller: :brewery_db_upcs

  resources :venues, only: :none do
    resources :categories, controller: 'venue_categories'
  end

  root to: 'pages#index'
end
