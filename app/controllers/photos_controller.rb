class PhotosController < ApplicationController

  def check
    @photo = Photo.find_by first_name: params
    respond_to do |format|
      format.json { render }
    end
  end

  private

  def photo_params
    params.require(:photo).permit()
  end

end
