Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :main do
      end
    end
  end
  root 'home#index'
  get '*path' => "home#index"
end
