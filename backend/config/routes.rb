Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

  resources :users, only: [] do
    get 'groups', to: 'users#groups'
  end

  resources :tasks

  resources :groups do
    get 'members', to: 'groups#members'

    resources :memberships, only: [:create, :destroy]
    resources :task_lists, only: [:index, :create, :show, :update, :destroy]
  end

  get 'me', to: 'current_user#index'
  get "up" => "rails/health#show", as: :rails_health_check
end
