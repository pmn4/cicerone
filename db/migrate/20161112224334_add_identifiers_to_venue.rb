class AddIdentifiersToVenue < ActiveRecord::Migration
  def change
    add_column :venues, :key, :string
    add_column :venues, :uri, :string
  end
end
