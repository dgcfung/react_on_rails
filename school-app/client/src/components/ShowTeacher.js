import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from "axios";


class ShowTeacher extends Component {

  constructor(props){
    super(props)
  }
  async componentDidMount(){
    const idParams = this.props.match.params.id
    if (this.props.currentTeacher.id !== idParams){
      const teacherData = await axios.get("http://localhost:3000/teachers/" + idParams)
      this.props.setTeacher(teacherData.data.teacher)
    } 
  }

   handleDelete = async ()=>{
    await axios.delete('http://localhost:3000/teachers/' +  this.props.currentTeacher.id)
    this.props.handleDeleteTeacher(this.props.currentTeacher)
    this.props.history.push('/')
  }

  render() {
    const teacher = this.props.currentTeacher
    return (
      <div>
        <h1>{teacher.name}</h1>
        <img alt={teacher.name} src={teacher.photo} />
        <button onClick={this.handleDelete}> delete!!!</button>
      </div>
    )
    }
}

export default ShowTeacher;