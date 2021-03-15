class User < ApplicationRecord
  belongs_to :photo
  has_many :discoveries
  has_many :characters, through: :discoveries
  validates :name, presence: true

  def self.top_10
    where('score > 0').order(score: :asc).limit(10)
  end
end
