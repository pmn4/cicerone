class AddProfileEmailToIdentity < ActiveRecord::Migration
  def change
    add_column :identities, :profile_email, :string
  end
end
