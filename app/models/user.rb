class User < ApplicationRecord
  belongs_to :photo
  has_many :discoveries
  has_many :characters, through: :discoveries
  validates :name, presence: true, length: { maximum: 10}

  scope :of_photo, ->(id) { where('photo_id = ?', id) }

  def self.top_10
    where('score > 0 and name != ?', 'new_user').order(score: :asc).limit(10)
  end
end
