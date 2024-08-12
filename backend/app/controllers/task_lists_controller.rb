class TaskListsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task_list, only: [:show, :update, :destroy]
  before_action :authorize_user!, only: [:show, :update, :destroy]

  def index
    @task_lists = TaskList.all

    render json: @task_lists
  end

  def show
    render json: @task_list
  end

  def create
    @task_list = TaskList.new(task_list_params)

    if @task_list.save
      render json: @task_list, status: :created
    else
      render json: @task_list.errors, status: :unprocessable_entity
    end
  end

  def update
    if @task_list.update(task_list_params)
      render json: @task_list
    else
      render json: @task_list.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @task_list.destroy
      render json: { message: 'task_list successfully deleted' }, status: :ok
    else
      render json: { error: 'failed to delete task_list' }, status: :unprocessable_entity
    end
  end

  private

  def set_task_list
    @task_list = TaskList.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'task_list not found' }, status: :not_found
  end

  def task_list_params
    params.require(:task_list)
      .permit(:name)
      .merge(group_id: params[:group_id]) # merging separately as this is part of URL, not user submitted data
  end

  def authorize_user!
    render json: { error: 'unauthorized' }, status: :forbidden unless @task_list.authorized?(current_user)
  end
end
