# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)  SOFTWARE ENGINEERING IMMERSIVE

## Getting started

1. Fork
1. Create a feature branch
1. Clone

# Rails as an API!

### Learning Objectives

- Create a REST-ful API in Rails
- Give our API Read All and Read One functionality with ActiveRecord
- Connect our Rails backend with a React frontend
- Display all of the data in our API's database

# Part One: Making a Rails API 

Today we create our new rails app, we'll be using: `--api`.

This does a couple of things:

- Configure your application to start with a more limited set of middleware than normal. Specifically, it will not include any middleware primarily useful for browser applications (like cookies support) by default.
- Make ApplicationController inherit from [ActionController::API](http://api.rubyonrails.org/classes/ActionController/API.html) instead of [ActionController::Base](http://api.rubyonrails.org/classes/ActionController/Base.html). As with middleware, this will leave out any Action Controller modules that provide functionalities primarily used by browser applications.
- Configure the generators to skip generating views, helpers and assets when you generate a new resource.

[(From the docs)](http://edgeguides.rubyonrails.org/api_app.html)

The end goal is a fully functioning Rails app with a React front end. With that in mind, let's get started.

### Generating the Rails app, creating the database, seeding the files

First we need to generate the app and create the database.

```bash
$ rails new school-app --api -G --database=postgresql
$ rails db:create
```

And, as always, it's a good idea to make sure that everything works before we go any farther.

Then, we need to generate the model. For this example, I'm doing a super simple database with just one table. (For your projects, you should have at least two!)

```bash
$ rails g model teacher name:string photo:string
$ rails db:migrate
```

**Remember**: in Rails, models are singlular. Controllers and routes are plural.

Let's make sure our database works by opening up the rails console and adding a teacher.

Lastly, we need to seed the database.

You can either move the provided `seed.rb` into your `/db/` directory or copy and paste this code into your existing seed file:

<details>
<summary>seed.rb</summary>

```
Teacher.create!(name: 'Professor Ari', photo: 'http://aribrenner.com/media/images/ari0.jpg')
Teacher.create!(name: 'Bell', photo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffriday87central.files.wordpress.com%2F2011%2F05%2Fpower-person-solo1.jpg&f=1&nofb=1')
Teacher.create!(name: 'Dom', photo: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages.wisegeek.com%2Felderly-woman-looking-up-at-sky.jpg&f=1&nofb=1')
Teacher.create(name: 'Drew', photo: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fen%2F5%2F50%2FRoyall_Allah_In_Person_UNOI.png&f=1&nofb=1')
Teacher.create!(name: 'J', photo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.q4CMw87G0nupV1I8OL-ZtwHaHa%26pid%3DApi&f=1')
Teacher.create!(name: 'Ramsey', photo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.barrett.com.au%2Fblogs%2FSalesBlog%2Fwp-content%2Fuploads%2F2011%2F09%2Fbold-narcissist-with-brush-mirror.jpg&f=1&nofb=1')

puts "#{Teacher.count} teachers created!"
```

</details>


Now we can we can this seed data with this command in terminal:

```bash
$ rails db:seed
```

Let's check it out in the Rails console again. Cool? Cool.

### Creating the `index` and `show` methods in the controller

We have to do a couple of things before we can actually get around to sending back JSON data.

First, let's set up our routes. For today, we are only worried about Read All and Read One, so let's do this in our `config/routes.rb` file.

```rb
# we could restrict this to only Read methods by adding
#`, only [:index, :show]` at the end of `resources :teachers`
resources :teachers
```


Then, of course, we need to make a controller.

```
rails g controller teachers
```

Now let's work on the `index` and `show` methods -- since we haven't made a frontend, we'll just be visiting URLs and getting JSON.

<details>
<summary>Here's a controller with some error handling.</summary>

```rb
class TeachersController < ApplicationController
  def index
    @teachers = Teacher.all
    render json: { message: "ok", teachers: @teachers }
  end

  def show
    begin
      @teacher = Teacher.find(params[:id])
      render json: { message: "ok", teacher: @teacher }
    rescue ActiveRecord::RecordNotFound
      render json: { message: 'no teacher matches that ID' }, status: 404
    rescue StandardError => e
      render json: { message: e.to_s }, status: 500
    end
  end

end
```

</details>

### SIDEBAR: Error handling!

You may notice that the `show` method has some error handling built in. It's using a `begin`, `rescue`, (`ensure`), `end` block. Here's how that works:

```rb
begin
  # try to do this thing
rescue NameOfError
  # if there's an error that has this name, do this thing
rescue Exception
  # catch other errors. doing this actually isn't
  # super recommended -- it's better to see exactly what
  # errors you might get and handle them specifically.
ensure
  # anything after ensure will always be done, no matter how
  # many errors happen.
end
```

[Here's a blog post about it.](http://vaidehijoshi.github.io/blog/2015/08/25/unlocking-ruby-keywords-begin-end-ensure-rescue/)

Something similar exists in JavaScript: the `try`/`catch`/`finally` syntax.

```js
try {
  // tryCode - Block of code to try
} catch (err) {
  // catchCode - Block of code to handle errors
} finally {
  // finallyCode - Block of code to be executed
  // regardless of the try / catch result
}
```

[Here's a link to the MDN docs.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

# Part two: Hooking Rails up to React!

Since we aren't using views anymore, we need something else to handle the front end interface. What's better than using React? (Nothing. React is the **best**.)

Setting Rails up to work with React is a multi-step process -- similar to setting it up with Express, but there's a couple extra things we need to do, some extra tools, so on and so forth. Most of the tutorials out there have unnecessary steps, or outdated steps, or what have you, so let's walk through this together.

### Creating the React app!

Just like in Express, the React app in a React/Rails setup should be generated with `create-react-app`. (NOTE: There are a couple of gems like `react-rails` and `react-on-rails`. **DO NOT USE THEM. THEY ARE NOT WORTH IT.**)

In the root directory of the Rails app, type `create-react-app client`.

### Installing Cors in rails

Right now, if we were to make any api fetch calls from React to our api, we would be blocked by Cors.
To get around this, we need to configure Cors in our backend api.

In our `Gemfile`, we need to uncomment `gem 'rack-cors'`

Now we can install the package by running in terminal:
```
bundle install
```

Be sure to run this command in the root directory of our repo

### Configuring Cors

The Cors config file can be found in `/config/initializers/cors.rb`
In this file we need to uncomment a block of code that looks like this:

```rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'example.com'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

This currently allows `:any` header on all ('*') resources in our routes. It also allows the methods `:get, :post, :put, :patch, :delete, :options, :head`.
But also notice that it only allows these from the origin site of `example.com`.
THis is not what we want. We will be sending requests from localhost during developement and from our surge url after deployment. We correct this by changing `'example.com'` to `'*'`. This will allow any url to send requests to our api.

```rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

Now our api is all setup for Show All and Show One. We can go ahead and run:

```
rails s
```

### Back to the front...end

At this point, we should all be familiar with React and we can build out the fontend.
If we need some example code to get us going, we can use this provided `App.js` code:


<details>
<summary>A very simple <code>App.js</code></summary>

```jsx
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from "axios";

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
      currentTeacher: null
    };
    this.renderAllTeachers = this.renderAllTeachers.bind(this)
    this.singleTeacherRender = this.singleTeacherRender.bind(this)
  }

  componentDidMount() {
    axios.get('http://localhost:3000/teachers')
    .then((jsonRes) => {
      this.setState({
        teachers: jsonRes.data.teachers,
      });
    });
  }

  setTeacher(teacher) {
    this.setState({
      currentTeacher: teacher
    })
  }

  renderAllTeachers() {
    return this.state.teachers.map(teacher => (
      <div key={teacher.id}>
        <Link to={`/teachers/${teacher.id}`} onClick={() => this.setTeacher(teacher)}>{teacher.name}</Link>
        <img alt={teacher.name} src={teacher.photo} />
        <hr />
      </div>
    ))
  }

  singleTeacherRender() {

    const teacher = this.state.currentTeacher
    return (
      <div>
        <h1>{teacher.name}</h1>
        <img alt={teacher.name} src={teacher.photo} />
      </div>
    )
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Link exact="true" to='/'>School App</Link>
        <Switch>
          <Route
            exact path="/"
            render={this.renderAllTeachers}
          />
          <Route
            exact path="/teachers/:id"
            render={this.singleTeacherRender}
          />
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
```

</details>

Now cd into `client`, and try spinning up the react server with 

```
npm start
```

You should see this error:

```
Something is already running on port 3000
```

Our rails server is already using port 3000; we need to assign a different port for our react app; to do this, add `PORT=3001` to the beginning the "start" command in the package.json, like so:

```json
"start": "PORT=3001 react-scripts start", 
```

Let's install a few more dependencies as well:
```
npm install react-router axios
```



Tada! now we are done and we have a basic React + Rails web application

## Bonus 1: Refactor

1. Refactor the react methods for renderAllTeachers and renderSingleTeacher into their own seperate components.
1. Notice that when you refresh the page for /teachers/:id, it breaks. Why is this? How can that be fixed?



## 🚀 BONUS 2: Deployment!

Deploy backend Rails server to Heroku:

- `heroku create app_name`
- `git push heroku master`
- `heroku run rails db:migrate`
- `heroku run rails db:seed`
- `heroku open` to take us to the url link for our backend server.

Deploy frontend React to surge:

- replace `http://localhost:3000` on line 18 of our App.js with a link to our heroku backend server.
in terminal:
- `cd client`
- `npm run build`
- `cd build`
- `surge`
- follow the prompts to get the link to the deployed site.
