class AddAttributesToVenue < ActiveRecord::Migration
  def change
    add_column :venues, :type, :string
    add_column :venues, :color, :string
    add_column :venues, :response_json, :string
  end
end
