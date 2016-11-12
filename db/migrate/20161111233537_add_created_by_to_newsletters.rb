class AddCreatedByToNewsletters < ActiveRecord::Migration
  def change
    add_reference :newsletters, :created_by, references: :users
    add_foreign_key :newsletters, :users, column: :created_by_id

    add_reference :newsletter_blocks, :created_by, references: :users
    add_foreign_key :newsletter_blocks, :users, column: :created_by_id

    add_reference :venues, :created_by, references: :users
    add_foreign_key :venues, :users, column: :created_by_id
  end
end
