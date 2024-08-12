class AddTaskListToTasks < ActiveRecord::Migration[7.1]
  def change
    add_reference :tasks, :task_list, foreign_key: true

    default_task_list = TaskList.create!(name: "Default Task List", group_id: Group.first.id)
    Task.where(task_list_id: nil).update_all(task_list_id: default_task_list.id)

    change_column_null :tasks, :task_list_id, false
  end
end
