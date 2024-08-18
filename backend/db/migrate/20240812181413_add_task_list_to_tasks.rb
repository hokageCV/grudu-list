class AddTaskListToTasks < ActiveRecord::Migration[7.1]
  def change
    # task_list = TaskList.create!(name: 'Heres a task list via migration') unless TaskList.exists?
    add_reference :tasks, :task_list, foreign_key: true, null: false, default: 1
  end
end
