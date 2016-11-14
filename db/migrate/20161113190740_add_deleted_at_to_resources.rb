class AddDeletedAtToResources < ActiveRecord::Migration
  def change
    add_column :categories, :deleted_at, :datetime
    add_index :categories, :deleted_at

    add_column :newsletter_blocks, :deleted_at, :datetime
    add_index :newsletter_blocks, :deleted_at

    add_column :venues, :deleted_at, :datetime
    add_index :venues, :deleted_at
  end
end
