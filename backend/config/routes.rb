Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

  resources :users, only: [] do
    get 'groups', to: 'users#groups'
  end

  resources :tasks

  resources :groups do
    resources :memberships, only: [:create, :destroy]

    get 'members', to: 'groups#members'
  end

  get 'me', to: 'current_user#index'
  get "up" => "rails/health#show", as: :rails_health_check
end
