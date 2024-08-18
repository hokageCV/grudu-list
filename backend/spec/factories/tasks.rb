FactoryBot.define do
  factory :task do
    name { 'Default Task' }
    completed { false }
    association :task_list
    association :owner, factory: :user
  end
end
