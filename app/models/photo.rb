class Photo < ApplicationRecord
  has_many :users
  has_many :positions
  has_many :characters, through: :positions
end
