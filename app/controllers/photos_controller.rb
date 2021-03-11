class PhotosController < ApplicationController

  def init
    @photo = Photo.find(params[:photo_id])
    characters = @photo.characters.map { |c| c.name }
    
    respond_to do |format|
      format.json { render :json => characters }
    end
  end

  def search
    @photo = Photo.find(params[:photo_id])
    @character = Character.find_by_name(params[:character])
    @position = Position.of_photo(@photo.id)
                        .of_character(@character.id)
                        .take
    horizontal = @position.left < params[:x].to_i && params[:x].to_i < @position.right
    vertical = @position.top < params[:y].to_i && params[:y].to_i < @position.bottom

    if horizontal && vertical
      respond_to do |format|
        format.json { render :json => [
          @position.left,
          @position.top,
          @position.right,
          @position.bottom
        ]}
      end
    else
      respond_to do |format|
        format.json { render :json => false }
      end
    end
  end

end
