class UsersController < ApplicationController

  def index
    @users = User.all
  end

  def create
    @user = User.create(name: 'new user', time: 0)
  end

  def update
    @user = User.find(params[:id])
    @user.update(user_params)
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
  end

end
