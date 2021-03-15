class UsersController < ApplicationController

  def index
    @users = User.of_photo(params[:photo_id]).top_10
    render json: @users
  end

  def create
    @user = User.create(
      name: 'new_user', 
      score: 0, 
      photo_id: params[:photo_id]
    )
    @photo = Photo.find(params[:photo_id])
    @photo.characters.each do |c|
      Discovery.create(
        discovered: false,
        character_id: c.id,
        user_id: @user.id
      )
    end
    render json: @user.id
  end

  def check
    @discoveries = Discovery.of_user(params[:user_id])
    @character = Character.find_by_name(params[:character])
    discovery = @discoveries.find_by_character_id(@character.id)
    discovery.update(discovered: true)
    if @discoveries.all? { |d| d.discovered }
      @user = User.find(params[:user_id])
      time = (Time.now - @user.created_at).round(2)
      @user.update(score: time)
      render json: time
    else
      render json: false
    end
  end

  def update
    @user = User.find(params[:id])
    @user.update(name: params[:name])
  end

  def destroy
    #todo
    @user = User.find(params[:user_id])
    @user.destroy
  end

end
