ENV['RAILS_ENV'] ||= 'test'

require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'database_cleaner'
require 'capybara/rails'

Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }
# OmniAuth.config.test_mode = true
# include Warden::Test::Helpers
# Warden.test_mode!
RSpec.configure do |config|
  # rspec-expectations config goes here. You can use an alternate
  # assertion/expectation library such as wrong or the stdlib/minitest
  # assertions if you prefer.
  config.include Requests::JsonHelpers, type: :request
  # config.include Devise::TestHelpers, type: :controller
  config.include IntegrationHelpers
  config.include Capybara::DSL



  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.use_transactional_fixtures = false
  # rspec-mocks config goes here. You can use an alternate test double
  # library (such as bogus or mocha) by changing the `mock_with` option here.
  config.mock_with :rspec do |mocks|
    # Prevents you from mocking or stubbing a method that does not exist on
    # a real object. This is generally recommended, and will default to
    # `true` in RSpec 4.
    mocks.verify_partial_doubles = true
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.before(:suite) do
    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean_with(:truncation)
  end

  config.after(:each) do
    # Image.all.each{|i| i.destroy}
    DatabaseCleaner.clean_with(:truncation)
  end

  config.after(:each) do
    Rails.cache.clear
    Capybara.reset_sessions!
  end
end
