class UsersController < ApplicationController
  before_action :set_user, only: [:show, :groups]

  def groups
    @groups = @user.groups
    render json: GroupSerializer.new(@groups).serializable_hash[:data].map { |group| group[:attributes] }, status: :ok
  end

  def show
    render json: UserSerializer.new(@user).serializable_hash[:data][:attributes], status: :ok
  end

  private

  def set_user
    @user = User.find(params[:id] || params[:user_id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: 'User not found.' }, status: :not_found
  end
end
