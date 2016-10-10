class CreateBreweryDbs < ActiveRecord::Migration
  def change
    create_table :brewery_dbs do |t|
      t.string :key
      t.string :uri
      t.text :response

      t.timestamps null: false
    end
  end
end
