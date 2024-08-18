FactoryBot.define do
  factory :group do
    name { "Default Group" }
    association :owner, factory: :user
  end
end
