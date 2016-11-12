class AddVenueToEmail < ActiveRecord::Migration
  def change
    add_reference :emails, :venue, index: true, foreign_key: true
  end
end
