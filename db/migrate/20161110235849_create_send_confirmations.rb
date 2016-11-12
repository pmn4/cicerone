class CreateSendConfirmations < ActiveRecord::Migration
  def change
    create_table :send_confirmations do |t|
      t.string :type
      t.references :email, index: true, foreign_key: true
      t.string :external_id
      t.string :subject
      t.string :category
      t.string :status
      t.text :headers
      t.text :body

      t.timestamps null: false
    end
  end
end
