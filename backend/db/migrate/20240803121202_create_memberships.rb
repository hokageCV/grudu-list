# rails g migration CreateMemberships user:references group:references

class CreateMemberships < ActiveRecord::Migration[7.1]
  def change
    create_table :memberships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :group, null: false, foreign_key: true

      t.timestamps
    end

    add_index :memberships, [:user_id, :group_id], unique: true
  end
end
