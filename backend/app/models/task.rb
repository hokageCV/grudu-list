class Task < ApplicationRecord
  belongs_to :owner, class_name: 'User', inverse_of: :tasks
  belongs_to :task_list

  validates :name, presence: true
  validates :completed, inclusion: { in: [true, false] }
  validates :owner, presence: true
  validates :task_list, presence: true

  scope :from_task_list, ->(task_list_id) { where(task_list_id:) }

  def authorized?(user)
    task_list.group.memberships
      .where(user_id: user.id)
      .where(role: ['editor', 'owner'])
      .exists?
  end
end
