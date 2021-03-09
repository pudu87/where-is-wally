class CreateDiscoveries < ActiveRecord::Migration[6.1]
  def change
    create_table :discoveries do |t|
      t.boolean :discovered

      t.belongs_to :character
      t.belongs_to :user

      t.timestamps
    end
  end
end
