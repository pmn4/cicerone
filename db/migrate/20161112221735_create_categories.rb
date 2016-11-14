class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.references :venue, index: true, foreign_key: true
      t.string :name
      t.string :color
      t.string :note

      t.timestamps null: false
    end
  end
end
