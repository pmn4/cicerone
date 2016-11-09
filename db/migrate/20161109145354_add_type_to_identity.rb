class AddTypeToIdentity < ActiveRecord::Migration
  def change
    add_column :identities, :type, :string
  end
end
