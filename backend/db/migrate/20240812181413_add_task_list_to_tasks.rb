class AddTaskListToTasks < ActiveRecord::Migration[7.1]
  def change
    add_reference :tasks, :task_list, foreign_key: true, null: false
  end
end
