class HealthController < ApplicationController
  def index
    render json: { status: 'online' }, status: :ok
  end
end
