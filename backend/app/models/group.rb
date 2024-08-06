class Group < ApplicationRecord
  belongs_to :owner, class_name: 'User'

  has_many :memberships, dependent: :destroy
  has_many :members, through: :memberships, source: :user

  validates :name, presence: true
  validates :owner_id, presence: true

  scope :viewable_by, ->(user) { where(owner_id: user.id) }

  def authorized?(user) = owner_id == user.id
end
