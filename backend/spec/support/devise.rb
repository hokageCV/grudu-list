RSpec.configure do |config|
  # adding this because directly using sign_in_user method wasn't working
  config.include Warden::Test::Helpers
  config.after(type: :request) { Warden.test_reset! }
end
