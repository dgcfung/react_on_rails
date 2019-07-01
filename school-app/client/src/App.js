import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import axios from "axios";
import AllTeachers from "./components/AllTeachers";
import ShowTeacher from "./components/ShowTeacher";
import TeacherForm from "./components/TeacherForm"

import "./App.css";

class App extends Component {
  constructor(props){
    super()
    this.state = {
      teachers: [],
      currentTeacher: {},
      teachersLoaded: false
    };
  }
 

  getAllTeachers = () => {
    axios.get("http://localhost:3000/teachers").then(jsonRes => {
      this.setState({
        teachers: jsonRes.data.teachers,
        teachersLoaded: true
      });
    });
  };

  handleDeleteTeacher = (removedTeacher)=> {
      this.setState({
        teachers: this.state.teachers.filter(teacher => teacher.id !== removedTeacher.id)
      })
  }

  setTeacher = (teacher) => {
    this.setState({
      currentTeacher: teacher
    });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Link exact="true" to="/">
            School App
          </Link>
          <Switch>
            <Route 
              exact 
              path="/teachers/new"
              render={(props)=> <TeacherForm
                {...props}
                setTeacher={this.setTeacher}
              />
              }
            />
            <Route
              exact
              path="/teachers/:id/edit"
              render={(props)=> <TeacherForm
                {...props}
                setTeacher={this.setTeacher}
                currentTeacher={this.state.currentTeacher}
                isUpdateForm={true}
              />} 
            />
            <Route
              exact
              path="/teachers/:id"
              render={(props) => <ShowTeacher 
                currentTeacher={this.state.currentTeacher}
                setTeacher={this.setTeacher}
                handleDeleteTeacher={this.handleDeleteTeacher}
                {...props}
                />}
            />
            <Route
              exact
              path="/"
              render={() => (
                <AllTeachers
                  getAllTeachers={this.getAllTeachers}
                  teachers={this.state.teachers}
                  teachersLoaded={this.state.teachersLoaded}
                  setTeacher={this.setTeacher}
                />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
