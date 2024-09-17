class GroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_group, only: [:show, :update, :destroy, :members]
  before_action :authorize_user!, only: [:show, :update, :destroy]

  def index
    @groups = Group.all

    render json: GroupSerializer.new(@groups).serializable_hash[:data].map { |group| group[:attributes] }, status: :ok
  end

  def show
    render json: GroupSerializer.new(@group).serializable_hash[:data][:attributes], status: :ok
  end

  def create
    @group = Group.new(group_params.merge(owner_id: current_user.id))

    if @group.save
      Membership.create!(user: current_user, group: @group, role: :owner)
      render json: GroupSerializer.new(@group).serializable_hash[:data][:attributes], status: :created, location: @group
    else
      render json: @group.errors, status: :unprocessable_entity
    end
  end

  def update
    if @group.update(group_params)
      render json: GroupSerializer.new(@group).serializable_hash[:data][:attributes], status: :ok
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

  def members
    @members = @group.members + [@group.owner]

    serialized_members = MemberSerializer.new(@members, { params: { group: @group } })
      .serializable_hash[:data]
      .map { |member| member[:attributes] }

    render json: serialized_members, status: :ok
  end

  private

  def set_group
    @group = Group.find(params[:id] || params[:group_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Group not found' }, status: :not_found
  end

  def group_params
    params.require(:group).permit(:name, :completed)
  end

  def authorize_user!
    render json: { error: 'unauthorized' }, status: :forbidden unless @group.authorized?(current_user)
  end
end
