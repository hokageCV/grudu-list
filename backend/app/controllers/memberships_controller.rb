class MembershipsController < ApplicationController
  before_action :set_group, only: [:index, :create, :destroy]

  def index
    @memberships = @group.memberships

    render json: @memberships
  end

  def create
    @membership = @group.memberships.new(user_id: params[:user_id], role: params[:role])

    if @membership.save
      render json: { message: 'User successfully added to group.' }, status: :created
    else
      render json: { errors: @membership.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @membership = @group.memberships.find_by(user_id: params[:id])

    if @membership&.destroy
      render json: { message: 'User successfully removed from group.' }, status: :ok
    else
      render json: { errors: 'Membership not found or could not be removed.' }, status: :unprocessable_entity
    end
  end

  private

  def set_group
    @group = Group.find(params[:group_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Group not found' }, status: :not_found
  end
end
