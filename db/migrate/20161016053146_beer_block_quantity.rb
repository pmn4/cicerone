class BeerBlockQuantity < ActiveRecord::Migration
  def change
    add_reference :newsletter_blocks, :quantity, index: true
  end
end
