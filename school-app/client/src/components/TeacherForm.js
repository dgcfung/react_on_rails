import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from "axios";


class TeacherForm extends Component {

  state = {
    name: '',
    photo: ''
  }

  async componentDidMount(){
    //   if it's a new teacher form, do nothing
    if (!this.props.isUpdateForm){
        return 
    }

    const idParams = this.props.match.params.id
    // if we don't have the current teacher in state...
    if (this.props.currentTeacher.id !== idParams){
        // go get it from the server
        const res = await axios.get("http://localhost:3000/teachers/" + idParams)
        const {name, photo} = res.data.teacher;
        // and then set it to the form state
        this.setState({
            name,
            photo
        })
    } else {
        const {name, photo} = this.props.currentTeacher
        this.setState({
            name,
            photo
        })
    }
    
}
    // oterwise, if it's an edit teacher form....
    // ... set the initial state of the current teacher via props



  handleFormChange = (e)=> {
    const { name, value } = e.target;
    this.setState({
        [name]: value
      })
    }

    onSubmit = async (evt) =>{
        evt.preventDefault()
        // post request submitting the form data
        // TODO put/post and also a different url
        const idParams = this.props.match.params.id
        const res = this.props.isUpdateForm ?  
        await axios.put('http://localhost:3000/teachers/' + idParams , this.state) :
        await axios.post('http://localhost:3000/teachers/', this.state)
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
          <h2> {this.props.isUpdateForm ? "Update Teacher" : "Create a Teacher"} </h2>
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