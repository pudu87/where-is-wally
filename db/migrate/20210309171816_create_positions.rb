class CreatePositions < ActiveRecord::Migration[6.1]
  def change
    create_table :positions do |t|
      t.integer :left
      t.integer :top
      t.integer :right
      t.integer :bottom

      t.belongs_to :photo
      t.belongs_to :character

      t.timestamps
    end
  end
end
