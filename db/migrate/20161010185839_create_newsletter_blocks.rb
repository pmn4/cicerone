class CreateNewsletterBlocks < ActiveRecord::Migration
  def change
    create_table :newsletter_blocks do |t|
      t.string :type
      t.string :message
      t.string :note
      t.references :newsletter, index: true, foreign_key: true
      t.references :brewery_db, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
