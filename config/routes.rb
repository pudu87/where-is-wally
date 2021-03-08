Rails.application.routes.draw do
  root 'static#index'
  get '*path', to: 'static#index'
end
