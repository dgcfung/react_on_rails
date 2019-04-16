# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Teacher.create!(name: 'Professor Ari', photo: 'http://aribrenner.com/media/images/ari0.jpg')
Teacher.create!(name: 'Bell', photo: 'http://uploads.tapatalk-cdn.com/20161123/679e78cd8a276f76f1f962ba2a4c454e.jpg')
Teacher.create!(name: 'Dom', photo: 'http://i.imgur.com/JRkmvOv.png')
Teacher.create(name: 'Drew', photo: 'https://lh5.googleusercontent.com/-Po8zRYag1ns/TgvVNrnnRGI/AAAAAAAAFuQ/UBoR0jidi1s/w506-h750/241140_10150199352146566_646356565_7341938_4425157_o.jpg')
Teacher.create!(name: 'J', photo: 'https://avatars0.githubusercontent.com/u/12768542?v=4&s=400')
Teacher.create!(name: 'Ramsey', photo: 'https://docs.npmjs.com/images/npm.svg')

puts "#{Teacher.count} teachers created!"