Rails.application.routes.draw do
  root 'static#index'

  resource :photos do
    collection do
      get 'search', 'init'
    end
  end

  get '*path', to: 'static#index'
end
