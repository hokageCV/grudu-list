class Task < ApplicationRecord
  belongs_to :owner, class_name: 'User'

  validates :name, presence: true
  validates :completed, inclusion: { in: [true, false] }
  validates :owner, presence: true
end
