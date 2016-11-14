class AddVenueToNewsletter < ActiveRecord::Migration
  def change
    add_reference :newsletters, :venue, index: true, foreign_key: true
  end
end
