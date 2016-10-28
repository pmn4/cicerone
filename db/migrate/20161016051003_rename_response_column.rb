class RenameResponseColumn < ActiveRecord::Migration
  def change
    rename_column :brewery_dbs, :response, :response_json
  end
end
