class Group < ApplicationRecord
  belongs_to :owner, class_name: 'User', inverse_of: :groups

  has_many :memberships, dependent: :destroy
  has_many :members, through: :memberships, source: :user
  has_many :task_lists, dependent: :destroy

  validates :name, presence: true
  validates :owner_id, presence: true

  scope :viewable_by, ->(user) { where(owner_id: user.id) }

  def authorized?(user) = owner_id == user.id
end
