class Character < ApplicationRecord
  has_many :positions
  has_many :photos, through: :positions
  has_many :discoveries
  has_many :users, through: :discoveries
end
