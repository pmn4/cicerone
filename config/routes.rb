app_root = File.dirname(File.absolute_path(__FILE__))
Dir.glob("#{app_root}/../app/controllers/**/*_controller.rb", &method(:require))

RESOURCE_ROUTES = %i(index create show update destroy).freeze

Rails.application.routes.draw do
  devise_for :users

  resources :newsletters do
    resources :blocks, controller: 'newsletter_blocks'

    resources :beer_blocks, only: :create, controller: 'beer_newsletter_blocks'

    resources :content_blocks, only: :create, controller: 'content_newsletter_blocks'
  end

  resources :beers, controller: :brewery_db_beers
end
