class CreateEmails < ActiveRecord::Migration
  def change
    create_table :emails do |t|
      t.string :type
      t.text :response_json

      t.timestamps null: false
    end
  end
end
