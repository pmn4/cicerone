class AddNameToUsers < ActiveRecord::Migration
  def change
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string

    add_column :identities, :profile_url, :string
    add_column :identities, :user_name, :string
  end
end
