class AddProfilePhotoUrlToIdentities < ActiveRecord::Migration
  def change
    add_column :identities, :profile_photo_url, :string
  end
end
