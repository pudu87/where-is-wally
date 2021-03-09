# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

photos_list = ['photo_1', 'photo_2']
characters_list = ['wally', 'odlaw', 'wizard']
positions_list = [
  [
    [1901, 54, 1950, 115],
    [1816, 710, 1865, 774],
    [557, 482, 629, 572]
  ],
  [
    [954, 197, 1016, 269],
    [481, 1428, 546, 1516],
    [1210, 1947, 1263, 2018]
  ]
]

photos_list.each do |ph|
  Photo.create(title: ph)
end

characters_list.each do |c|
  Character.create(name: c)
end

positions_list.each.with_index(1) do |value, ph|
  value.each.with_index(1) do |pos, c|
    Position.create(left: pos[0], top: pos[1], right: pos[2], bottom: pos[3], photo_id: ph, character_id: c)
  end
end
