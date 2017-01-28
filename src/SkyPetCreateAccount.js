import React,  {  Component } from 'react';
import {SubmitPassword} from './SkyPetPasswords'
export class GethLogin extends Component{
  constructor(props){
    super(props);
    this.state = {
      error:"",
      waitingResults:false,
      password:""
    };
    window.socket.on('passwordError', (event, arg)=>{
      this.setState({error:arg, waitingResults:false}, 
        ()=>{
          setTimeout(()=>{
          this.setState({
            error:""
        })}, this.props.msToWait)}  )});
    window.socket.on('successLogin', (event, arg)=>{
      this.setState({
        waitingResults:false
      })
      this.props.onSuccessLogin?this.props.onSuccessLogin(arg):"";
    });
  }
  handleSubmitPassword=()=>{
    this.setState({
      waitingResults:true
    })
    window.socket.send('password', this.state.password);

  }
  handleTypePassword=(event, value)=>{
    this.setState({
      password:value
    }, ()=>{
      this.props.onHandleGeth?this.props.onHandleGeth(value):"";
    });
  }

  render() {
    return (
      <div style={this.props.centerComponent}>
        <div>
          <span>{this.props.text}</span>
          <SubmitPassword onType={this.handleTypePassword} onCreate={this.handleSubmitPassword} hasSubmitted={this.state.waitingResults} error={this.state.error} />
        </div>
      </div>
    );
  }
}