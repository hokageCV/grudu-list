class User < ApplicationRecord
  devise :database_authenticatable, :registerable
  include DeviseTokenAuth::Concerns::User

  has_many :tasks, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner
  has_many :groups, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner

  has_many :memberships, dependent: :destroy
  has_many :joined_groups, through: :memberships, source: :group
end
