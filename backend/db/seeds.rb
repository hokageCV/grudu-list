# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# 🚧 Seed Users
user1 = User.find_or_create_by(email: 'kakashi@konoha.nin') do |user|
  user.name = 'Kakashi Hatake'
  user.password = 'Test@123'
end

user2 = User.find_or_create_by(email: 'naruto@konoha.nin') do |user|
  user.name = 'Naruto Uzumaki'
  user.password = 'Rasengan@123'
end

# 🚧 Seed Groups
group1 = Group.find_or_create_by(name: 'Team 7', owner_id: user1.id)

# 🚧 Seed Memberships
Membership.find_or_create_by(user_id: user1.id, group_id: group1.id)

Membership.find_or_create_by(user_id: user2.id, group_id: group1.id)

# 🚧 Seed TaskLists
task_list1 = TaskList.find_or_create_by(name: 'Missions', group_id: group1.id)

# 🚧 Seed Tasks
Task.find_or_create_by(name: 'Complete the Chunin Exam', task_list_id: task_list1.id, owner_id: user2.id) do |task|
  task.completed = false
end

Task.find_or_create_by(name: 'Rescue Sasuke', task_list_id: task_list1.id, owner_id: user1.id) do |task|
  task.completed = false
end
