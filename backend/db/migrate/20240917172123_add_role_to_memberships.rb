class AddRoleToMemberships < ActiveRecord::Migration[7.1]
  def change
    add_column :memberships, :role, :string, null: false, default: 'editor'
  end
end
