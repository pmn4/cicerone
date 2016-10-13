class AddDeletedAtToClients < ActiveRecord::Migration
  def change
    add_column :brewery_dbs, :deleted_at, :datetime
    add_index :brewery_dbs, :deleted_at

    add_column :newsletters, :deleted_at, :datetime
    add_index :newsletters, :deleted_at

    add_column :users, :deleted_at, :datetime
    add_index :users, :deleted_at
  end
end
