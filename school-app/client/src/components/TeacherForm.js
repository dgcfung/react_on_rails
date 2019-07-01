import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from "axios";


class TeacherForm extends Component {

  state = {
    name: '',
    photo: ''
  }

  handleFormChange = (e)=> {
    const { name, value } = e.target;
    this.setState({
        [name]: value
      })
    }

    onSubmit = async (evt) =>{
        evt.preventDefault()
        // post request submitting the form data
        const res = await axios.post('http://localhost:3000/teachers/', this.state)
        // ...which gives us back the new teacher object
        
        const teacher = res.data.teacher
        // ...which we will then set to app state
        this.props.setTeacher(teacher)
        // redirect to the new teacher 
        this.props.history.push('/teachers/' + teacher.id )
    }


  render() {
    //   controlled component form that statefully updates name and photo
    // 
    return (
        <div className="create-form" >
          <h2>Create a new teacher</h2>
          <form onSubmit={this.onSubmit}>
            <label>Photo url:</label>
            <input
              type="text"
              name="photo"
              value={this.state.photo}
              onChange={this.handleFormChange} />
              <br/>
              <label>Teacher's name:</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleFormChange} />
              <br/>
            <button>Submit</button>
          </form>
        </div >
    )
  }   
}

export default TeacherForm;