module RequestHelper
  def sign_in_user(user)
    post '/auth/sign_in', params: { email: user.email, password: user.password }
    @auth_headers = response.headers.slice('access-token', 'client', 'uid')
  end

  def json_response
    JSON.parse(response.body)
  end
end
