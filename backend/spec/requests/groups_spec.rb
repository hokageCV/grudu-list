require 'rails_helper'

RSpec.describe 'Groups', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user, email: 'other@example.com') }
  let(:group) { create(:group, owner: user) }

  before do
    sign_in_user(user)
  end

  describe 'GET /groups' do
  before do
    create_list(:group, 3, owner: user)
    get '/groups', headers: @auth_headers
  end

  it 'returns a list of groups' do
    expect(response).to have_http_status(:ok)
    expect(json_response.size).to eq(3)
  end
  end

  describe 'GET /groups/:id' do
    it 'returns the details of a specific group' do
      get "/groups/#{group.id}", headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(json_response['name']).to eq(group.name)
    end

    it 'returns not found for an invalid group' do
      get '/groups/999999', headers: @auth_headers
      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq('Group not found')
    end
  end

  describe 'POST /groups' do
    it 'creates a new group' do
      post '/groups', params: { group: { name: 'New Group' } }, headers: @auth_headers
      expect(response).to have_http_status(:created)
      expect(Group.last.name).to eq('New Group')
      expect(Group.last.owner).to eq(user)
    end

    it 'does not create a group with invalid parameters' do
      post '/groups', params: { group: { name: '' } }, headers: @auth_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['name']).to include("can't be blank")
    end
  end

  describe 'PATCH /groups/:id' do
    it 'updates an existing group' do
      patch "/groups/#{group.id}", params: { group: { name: 'Updated Group Name' } }, headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(group.reload.name).to eq('Updated Group Name')
    end

    it 'does not update a group with invalid parameters' do
      patch "/groups/#{group.id}", params: { group: { name: '' } }, headers: @auth_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['name']).to include("can't be blank")
    end
  end

  describe 'DELETE /groups/:id' do
    it 'deletes a group' do
      delete "/groups/#{group.id}", headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(Group.exists?(group.id)).to be_falsey
    end

    it 'returns an error when deleting a non-existent group' do
      delete '/groups/999999', headers: @auth_headers
      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq('Group not found')
    end
  end

  describe 'GET /groups/:id/members' do
    it 'returns the members of a group' do
      membership = create(:membership, user: user, group: group)
      get "/groups/#{group.id}/members", headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(json_response.first['email']).to eq(user.email)
    end
  end
end
