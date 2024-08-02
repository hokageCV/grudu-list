class Task < ApplicationRecord
  belongs_to :owner, class_name: 'User'

  validates :name, presence: true
  validates :completed, inclusion: { in: [true, false] }
  validates :owner, presence: true

  scope :viewable_by, ->(user) { where(owner_id: user.id) }
end
