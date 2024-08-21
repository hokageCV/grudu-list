require 'rails_helper'

RSpec.describe 'Tasks', type: :request do
  let(:user) { create(:user, email: 'shoyo@gmail.com') }
  let(:user2) { create(:user, email: 'user2@example.com') }
  let(:task_list) { create(:task_list) }
  let(:task) { create(:task, owner: user, task_list:) }

  before do
    sign_in_user(user)
  end

  describe 'GET /tasks' do
    before do
      create_list(:task, 3, owner: user, task_list:)
      get '/tasks', headers: @auth_headers
    end

    it 'returns a list of tasks' do
      expect(response).to have_http_status(:ok)
      expect(json_response.size).to eq(3)
    end
  end

  describe 'GET /tasks/:id' do
    it 'returns the details of a specific task' do
      get "/tasks/#{task.id}", headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(json_response['name']).to eq(task.name)
    end

    it 'returns not found for an invalid task' do
      get '/tasks/999999', headers: @auth_headers
      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq('Task not found')
    end
  end

  describe 'POST /tasks' do
    it 'creates a new task' do
      post '/tasks', params: { task: { name: 'New Task', task_list_id: task_list.id, completed: false } }, headers: @auth_headers
      expect(response).to have_http_status(:created)
      expect(Task.last.name).to eq('New Task')
      expect(Task.last.owner).to eq(user)
    end

    it 'does not create a task with invalid parameters' do
      post '/tasks', params: { task: { name: '', task_list_id: task_list.id } }, headers: @auth_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['name']).to include("can't be blank")
    end
  end

  describe 'PATCH /tasks/:id' do
    it 'updates an existing task' do
      patch "/tasks/#{task.id}", params: { task: { name: 'Updated Task Name' } }, headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(task.reload.name).to eq('Updated Task Name')
    end

    it 'does not update a task with invalid parameters' do
      patch "/tasks/#{task.id}", params: { task: { name: '' } }, headers: @auth_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['name']).to include("can't be blank")
    end
  end

  describe 'DELETE /tasks/:id' do
    it 'deletes a task' do
      delete "/tasks/#{task.id}", headers: @auth_headers
      expect(response).to have_http_status(:ok)
      expect(Task).not_to exist(task.id)
    end

    it 'returns an error when deleting a non-existent task' do
      delete '/tasks/999999', headers: @auth_headers
      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq('Task not found')
    end
  end
end
