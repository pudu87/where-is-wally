class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :name
      t.float  :score

      t.belongs_to :photo

      t.timestamps
    end
  end
end
