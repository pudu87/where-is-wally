class Position < ApplicationRecord
  belongs_to :photo
  belongs_to :character

  scope :of_photo,     ->(id) { where('photo_id = ?', id) }
  scope :of_character, ->(id) { where('character_id = ?', id) }
end
