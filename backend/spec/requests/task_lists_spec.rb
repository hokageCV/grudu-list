require 'rails_helper'

RSpec.describe 'TaskLists', type: :request do
  let(:user) { create(:user) }
  let(:group) { create(:group, owner: user) }
  let(:task_list) { create(:task_list, name: 'Existing Task List', group: group) }

  before do
    sign_in_user(user)
  end

  describe 'GET /groups/:group_id/task_lists' do
    before do
      create_list(:task_list, 3, group: group)
      get "/groups/#{group.id}/task_lists", headers: @auth_headers
    end

    it 'returns a list of task lists for the group' do
      expect(response).to have_http_status(:ok)
      expect(json_response.size).to eq(3)
    end
  end

  describe 'GET /groups/:group_id/task_lists/:id' do
    it 'returns the details of a specific task list' do
      get "/groups/#{group.id}/task_lists/#{task_list.id}", headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(json_response['name']).to eq(task_list.name)
    end

    it 'returns not found for an invalid task list' do
      get "/groups/#{group.id}/task_lists/999999", headers: @auth_headers
      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq('task_list not found')
    end
  end

  describe 'POST /groups/:group_id/task_lists' do
    it 'creates a new task list in the group' do
      post "/groups/#{group.id}/task_lists", params: { task_list: { name: 'New Task List' } }, headers: @auth_headers
      expect(response).to have_http_status(:created)
      expect(TaskList.last.name).to eq('New Task List')
    end

    it 'does not create a task list with invalid parameters' do
      post "/groups/#{group.id}/task_lists", params: { task_list: { name: '' } }, headers: @auth_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['name']).to include("can't be blank")
    end
  end

  describe 'PATCH /groups/:group_id/task_lists/:id' do
    it 'updates an existing task list' do
      patch "/groups/#{group.id}/task_lists/#{task_list.id}", params: { task_list: { name: 'Updated Task List Name' } }, headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(task_list.reload.name).to eq('Updated Task List Name')
    end

    it 'does not update a task list with invalid parameters' do
      patch "/groups/#{group.id}/task_lists/#{task_list.id}", params: { task_list: { name: '' } }, headers: @auth_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['name']).to include("can't be blank")
    end
  end

  describe 'DELETE /groups/:group_id/task_lists/:id' do
    it 'deletes a task list' do
      delete "/groups/#{group.id}/task_lists/#{task_list.id}", headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(TaskList.exists?(task_list.id)).to be_falsey
    end

    it 'returns an error when deleting a non-existent task list' do
      delete "/groups/#{group.id}/task_lists/999999", headers: @auth_headers
      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq('task_list not found')
    end
  end
end
