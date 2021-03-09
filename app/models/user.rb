class User < ApplicationRecord
  belongs_to :photo
  has_many :discoveries
  has_many :characters, through: :discoveries
  validates :name, presence: true
end
