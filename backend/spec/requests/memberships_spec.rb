require 'rails_helper'

RSpec.describe MembershipsController, type: :request do
  let(:user) { create(:user, email: 'shoyo@gmail.com') }
  let(:user2) { create(:user, email: 'user2@example.com') }
  let(:group) { create(:group, owner: user) }
  let(:membership) { create(:membership, user:, group:) }

  before do
    sign_in_user(user)
  end

  describe 'POST /groups/:group_id/memberships' do
    context 'when the group exists and user ID is valid' do
      it 'creates a new membership and returns a success message' do
        post "/groups/#{group.id}/memberships", params: { user_id: user2.id }

        expect(response).to have_http_status(:created)
        expect(json_response['message']).to eq('User successfully added to group.')
      end
    end

    context 'when the group does not exist' do
      it 'returns an error message' do
        post "/groups/999/memberships", params: { user_id: user.id }

        expect(response).to have_http_status(:not_found)
        expect(json_response['error']).to eq('Group not found')
      end
    end
  end

  describe 'DELETE /groups/:group_id/memberships' do
    before do
      create(:membership, user: user2, group:)
    end

    context 'when the membership exists' do
      it 'removes the membership and returns a success message' do
        delete "/groups/#{group.id}/memberships/#{user2.id}"

        expect(response).to have_http_status(:ok)
        expect(json_response['message']).to eq('User successfully removed from group.')
      end
    end
  end
end
