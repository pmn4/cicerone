# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161109151400) do

  create_table "brewery_dbs", force: :cascade do |t|
    t.string   "key",           limit: 255
    t.string   "uri",           limit: 255
    t.text     "response_json", limit: 65535
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.datetime "deleted_at"
  end

  add_index "brewery_dbs", ["deleted_at"], name: "index_brewery_dbs_on_deleted_at", using: :btree

  create_table "identities", force: :cascade do |t|
    t.string  "uid",               limit: 255
    t.string  "provider",          limit: 255
    t.integer "user_id",           limit: 4
    t.string  "profile_url",       limit: 255
    t.string  "user_name",         limit: 255
    t.string  "profile_photo_url", limit: 255
    t.string  "type",              limit: 255
    t.string  "profile_email",     limit: 255
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "newsletter_blocks", force: :cascade do |t|
    t.string   "type",          limit: 255
    t.string   "message",       limit: 255
    t.string   "note",          limit: 255
    t.integer  "newsletter_id", limit: 4
    t.integer  "brewery_db_id", limit: 4
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.integer  "quantity_id",   limit: 4
  end

  add_index "newsletter_blocks", ["brewery_db_id"], name: "index_newsletter_blocks_on_brewery_db_id", using: :btree
  add_index "newsletter_blocks", ["newsletter_id"], name: "index_newsletter_blocks_on_newsletter_id", using: :btree
  add_index "newsletter_blocks", ["quantity_id"], name: "index_newsletter_blocks_on_quantity_id", using: :btree

  create_table "newsletters", force: :cascade do |t|
    t.string   "subject",    limit: 255
    t.text     "body",       limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.datetime "deleted_at"
  end

  add_index "newsletters", ["deleted_at"], name: "index_newsletters_on_deleted_at", using: :btree

  create_table "oauth_access_grants", force: :cascade do |t|
    t.integer  "resource_owner_id", limit: 4,     null: false
    t.integer  "application_id",    limit: 4,     null: false
    t.string   "token",             limit: 255,   null: false
    t.integer  "expires_in",        limit: 4,     null: false
    t.text     "redirect_uri",      limit: 65535, null: false
    t.datetime "created_at",                      null: false
    t.datetime "revoked_at"
    t.string   "scopes",            limit: 255
  end

  add_index "oauth_access_grants", ["application_id"], name: "fk_rails_b4b53e07b8", using: :btree
  add_index "oauth_access_grants", ["token"], name: "index_oauth_access_grants_on_token", unique: true, using: :btree

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.integer  "resource_owner_id",      limit: 4
    t.integer  "application_id",         limit: 4
    t.string   "token",                  limit: 255,              null: false
    t.string   "refresh_token",          limit: 255
    t.integer  "expires_in",             limit: 4
    t.datetime "revoked_at"
    t.datetime "created_at",                                      null: false
    t.string   "scopes",                 limit: 255
    t.string   "previous_refresh_token", limit: 255, default: "", null: false
  end

  add_index "oauth_access_tokens", ["application_id"], name: "fk_rails_732cb83ab7", using: :btree
  add_index "oauth_access_tokens", ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true, using: :btree
  add_index "oauth_access_tokens", ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id", using: :btree
  add_index "oauth_access_tokens", ["token"], name: "index_oauth_access_tokens_on_token", unique: true, using: :btree

  create_table "oauth_applications", force: :cascade do |t|
    t.string   "name",         limit: 255,                null: false
    t.string   "uid",          limit: 255,                null: false
    t.string   "secret",       limit: 255,                null: false
    t.text     "redirect_uri", limit: 65535,              null: false
    t.string   "scopes",       limit: 255,   default: "", null: false
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
  end

  add_index "oauth_applications", ["uid"], name: "index_oauth_applications_on_uid", unique: true, using: :btree

  create_table "quantities", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.integer  "quantity",   limit: 4
    t.string   "label",      limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.datetime "deleted_at"
    t.string   "first_name",             limit: 255
    t.string   "last_name",              limit: 255
  end

  add_index "users", ["deleted_at"], name: "index_users_on_deleted_at", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  add_foreign_key "newsletter_blocks", "brewery_dbs"
  add_foreign_key "newsletter_blocks", "newsletters"
  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
end
