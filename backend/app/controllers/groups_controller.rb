class GroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_group, only: %i[ show update destroy ]
  before_action :authorize_user!, only: %i[show update destroy]

  def index
    @groups = Group.all

    render json: @groups
  end

  def show
    render json: @group
  end

  def create
    @group = Group.new(group_params.merge(owner_id: current_user.id))

    if @group.save
      render json: @group, status: :created, location: @group
    else
      render json: @group.errors, status: :unprocessable_entity
    end
  end

  def update
    if @group.update(group_params)
      render json: @group
    else
      render json: @group.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @group.destroy
      render json: { message: 'group successfully deleted' }, status: :ok
    else
      render json: { error: 'Failed to delete group' }, status: :unprocessable_entity
    end
  end

  private

  def set_group
    @group = Group.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Group not found" }, status: :not_found
  end

  def group_params
    params.require(:group).permit(:name, :completed)
  end

  def authorize_user!
    render json: { error: 'unauthorized' }, status: :forbidden unless @group.authorized?(current_user)
  end
end
