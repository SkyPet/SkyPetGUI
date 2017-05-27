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
    if(window.socket){
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
    
  }
  handleSubmitPassword=()=>{
    this.setState({
      waitingResults:true
    })
    window.socket.send('password', this.state.password);

  }
  handleTypePassword=(event, password)=>{
    this.setState({
      password
    }, ()=>{
      this.props.onHandleGeth?this.props.onHandleGeth(password):"";
    });
  }

  render() {
    const {waitingResults, error}=this.state
    const {centerComponent, text}=this.props
    return (
      <div style={centerComponent}>
          <span>{text}</span>
          <SubmitPassword 
            onType={this.handleTypePassword} 
            onCreate={this.handleSubmitPassword} 
            hasSubmitted={waitingResults} 
            error={error} 
          />
      </div>
    );
  }
}

GethLogin.propTypes = {
  msToWait:React.PropTypes.number.isRequired,
  text:React.PropTypes.string.isRequired,
  centerComponent:React.PropTypes.object,
  onSuccessLogin:React.PropTypes.func,
  onHandleGeth:React.PropTypes.func
};