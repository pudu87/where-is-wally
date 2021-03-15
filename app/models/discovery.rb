class Discovery < ApplicationRecord
  belongs_to :user
  belongs_to :character

  scope :of_user, ->(id) { where('user_id = ?', id) }
end
