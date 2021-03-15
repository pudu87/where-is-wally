Rails.application.routes.draw do
  root 'static#index'

  resources :users do
    collection do
      post 'check'
    end
  end

  resources :photos do
    collection do
      get 'search', 'init'
    end
  end

  get '*path', to: 'static#index'
end
