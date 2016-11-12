class AddCreatedByToEmails < ActiveRecord::Migration
  def change
    add_reference :emails, :created_by, references: :users
    add_foreign_key :emails, :users, column: :created_by_id
  end
end
