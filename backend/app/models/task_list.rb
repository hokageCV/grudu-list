class TaskList < ApplicationRecord
  belongs_to :group

  validates :name, presence: true
  validates :group_id, presence: true

  def authorized?(user)
    group_owner?(user) || group_member?(user)
  end

  private

  def group_owner?(user)
    group.owner_id == user.id
  end

  def group_member?(user)
    group.members.exists?(user.id)
  end
end
