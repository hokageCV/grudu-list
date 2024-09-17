class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :group

  enum role: { viewer: 'viewer', editor: 'editor', manager: 'manager', owner: 'owner' }

  validates :user_id, presence: true
  validates :group_id, presence: true
  validates :role, presence: true
end
