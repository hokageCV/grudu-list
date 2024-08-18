require 'rails_helper'

RSpec.describe 'Healths', type: :request do
  describe 'GET /up' do
    it 'returns http success' do
      get '/up'
      expect(response).to have_http_status(:success)
      expect(response.body).to eq('{"status":"online"}')
    end
  end

end
