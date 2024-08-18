FactoryBot.define do
  factory :task_list do
    name { 'Default Task List' }
    association :group
  end
end
