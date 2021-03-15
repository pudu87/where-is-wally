class User < ApplicationRecord
  belongs_to :photo
  has_many :discoveries
  has_many :characters, through: :discoveries
  validates :name, presence: true

  scope :of_photo, ->(id) { where('photo_id = ?', id) }

  def self.top_10
    where('score > 0').order(score: :asc).limit(10)
  end
end
