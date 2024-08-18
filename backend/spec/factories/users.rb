FactoryBot.define do
  factory :user do
    email { 'test@example.com' }
    password { 'Test@123' }
    name { 'test user'}
  end
end
