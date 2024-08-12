class Task < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  belongs_to :task_list

  validates :name, presence: true
  validates :completed, inclusion: { in: [true, false] }
  validates :owner, presence: true
  validates :task_list, presence: true

  scope :viewable_by, ->(user) { where(owner_id: user.id) }

  def authorized?(user) = owner_id == user.id
end
