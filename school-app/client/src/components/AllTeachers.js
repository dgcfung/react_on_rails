import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from "axios";


class AllTeachers extends Component {


  componentDidMount() {
    if(!this.props.teachersLoaded){
        this.props.getAllTeachers()
    }
  }


  render() {
    return this.props.teachers.map(teacher => (
        <div key={teacher.id}>
          <Link to={`/teachers/${teacher.id}`} onClick={() => this.props.setTeacher(teacher)}> show </Link>
          <img alt={teacher.name} src={teacher.photo} />
          <hr />
        </div>
      ))
    }
}

export default AllTeachers;