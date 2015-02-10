require 'json'

module IntegrationHelpers

  def oauth_get(page, uri, args={})
    JSON.parse(page.driver.get(uri, args).body)
  end

  def oauth_post(page, uri, args={})
    JSON.parse(page.driver.post(uri, args).body)
  end

  def oauth_put(page, uri, args={})
    JSON.parse(page.driver.put(uri, args).body)
  end

  def oauth_del(page, uri, args={})
    JSON.parse(page.driver.delete(uri, args).body)
  end

  def login_user user, controller, serializer
    login_as(user, scope: :user, run_callbacks: false)
    allow(controller).to receive(:current_user) { user }
    allow_any_instance_of(serializer).to receive(:scope) {controller}
  end
end
