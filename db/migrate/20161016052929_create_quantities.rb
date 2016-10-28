class CreateQuantities < ActiveRecord::Migration
  def change
    create_table :quantities do |t|
      t.string :name
      t.integer :quantity
      t.string :label

      t.timestamps null: false
    end
  end
end
