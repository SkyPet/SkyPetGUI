import React,  {  Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
//import {Container, Row, Col} from 'react-pure-grid';
import {Container, Grid, Breakpoint, Span} from 'react-responsive-grid'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import CryptoJS from "crypto-js";
//console.log(process.env);
var tryRequire = require('try-require');
var socket = tryRequire('electron');
if(!socket){
//else if(process.env.NODE_ENV === 'development'){
  var mySocket=new WebSocket("ws://localhost:4000", "protocolOne"); 
  var isOpen=false;
  var holdMessages=[];
  mySocket.onopen=(event)=>{
    isOpen=true;
    console.log(holdMessages);
    holdMessages.map((val, index)=>{
      mySocket.send(val);
    })
    holdMessages="";
  }
  socket={
    definedKeys:{},
    send:(key, value)=>{
      var obj={};
      obj[key]=value;
      if(!isOpen){
        holdMessages.push(JSON.stringify(obj));
       // mySocket.send(JSON.stringify(obj));
      }
      else{
        mySocket.send(JSON.stringify(obj));
      }
      
    },
    on:(key, cb)=>{
      socket.definedKeys[key]=cb;
    }

  }
  mySocket.onmessage=(event)=>{
    const data=JSON.parse(event.data);
    const key=Object.keys(data)[0];
    if(socket.definedKeys[key]){
      console.log("got here");
      socket.definedKeys[key](null, data[key]);
    }
  }
}
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
const blockChainView='https://testnet.etherscan.io/address/';
const selection=[
    "Temperament",
    "Name",
    "Owner", //this can be encrypted
    "Address" //this can be encrypted
];

const formatAttribute=(attributeType, attributeValue)=>{
  var obj={};
  obj[attributeType]=attributeValue;
  return obj;
}
const decrypt=(password, text)=>{ //attributeText
    var decrypted="";
    try{
      decrypted=CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8);
    }
    catch(e){
      console.log(e);
    }
    return decrypted;
}
class TblRow extends Component {/*=({attributeText, isEncrypted, onDecrypt, timestamp, label, wrongPassword})=>{*/
  constructor(props){
    super(props);
    this.state={
      isEncrypted:this.props.isEncrypted,
      attributeText:this.props.attributeText,
      wrongPassword:false,
      password:"",
      showPasswordModal:false
    }
  }
  onDecrypt=()=>{
    this.setState({
      showPasswordModal:true
    })
  }
  onPasswordSubmit=()=>{
    const decryptedValue=decrypt(this.state.password, this.state.attributeText);
    this.setState({
      password:"",
      wrongPassword:decryptedValue?false:true,
      attributeText:decryptedValue,
      isEncrypted:decryptedValue?false:true,
      showPasswordModal:false
    }, ()=>{
      setTimeout(()=>{this.setState({wrongPassword:false})}, 3000)
    })
  }
  setPassword=(value)=>{
    this.setState({
      password:value
    })
  }
  hideModal=()=>{
    this.setState({
      showPasswordModal:false
    })
  }
  render(){
    return(
      <TableRow>   
        <PasswordModal onPassword={this.onPasswordSubmit} setPassword={this.setPassword} hidePasswordModal={this.hideModal} askForPassword={this.state.showPasswordModal}/>          
        <TableRowColumn>{this.props.timestamp}</TableRowColumn>
        <TableRowColumn>{this.props.label}</TableRowColumn>
        <TableRowColumn>{this.state.isEncrypted?this.state.wrongPassword?<FlatButton label="Wrong Password" onClick={this.onDecrypt}/>:
            <FlatButton disabled={!this.state.isEncrypted} label="Decrypt" onClick={this.onDecrypt}/>:
          this.state.attributeText}
        </TableRowColumn>
    </TableRow>
    );
  }
}

class AboutComponent extends Component {
  state={
    closed:true
  }
  onAbout=()=>{
    this.setState({
      closed:false
    })
  }
  onAboutClose=()=>{
    this.setState({
      closed:true
    })
  }
  render(){
    //console.log(this.props.contractAddress)
    return(
      <div>
        <RaisedButton label="Learn More" primary={true} onClick={this.onAbout}/>
        <AboutModal contractAddress={this.props.contractAddress} onClick={this.onAboutClose} hideModal={this.state.closed}/>
      </div>
    )
  }
  
}
const AboutModal=({hideModal, onClick, contractAddress})=>
<Dialog
  title="About"
  actions={<FlatButton
        label="Ok"
        primary={true}
        onClick={onClick}
      />}
  modal={false}
  open={!hideModal}
  onRequestClose={onClick}
>
  <h4>How it works</h4>
      <p>Every pet should have a microchip which uniquely identifies itself.  A scanner can read the microchip and an ID is read.  For example, the ID may be 123.  This ID is then hashed and placed on the Ethereum blockchain.  The unhashed ID serves as a key to encrypt the name and address of the owner: hence the pet itself is needed in order to know who the owner and the address are (they are not public without knowing the ID of the pet).  This is not secure in the same sense that a human medical or banking record is secure; but as addresses are essentially public this is not a major issue.  If the medical records for the pet are not desired to be "public" then they can be encrypted using a key not associated with the microchip (eg, a password provided by the owners). 
      
      The contract that governs this is available at {contractAddress} on the blockchain.  See it <a href={blockChainView+contractAddress} target="_blank">here.</a> </p>
</Dialog>


const ErrorModal=({showError, hideError})=>
      <Dialog
        title="Error!"
        actions={<FlatButton
              label="Ok"
              primary={true}
              onClick={hideError}
            />}
        modal={false}
        open={showError?true:false}
        onRequestClose={hideError}
      >
      {showError}
      </Dialog>
const PasswordModal=({onPassword, setPassword, hidePasswordModal, askForPassword})=>
<Dialog
  title="Enter Password"
  modal={true}
  open={askForPassword}
  onRequestClose={hidePasswordModal}
>
  <SubmitPassword onCreate={onPassword} onType={setPassword}/>
  <RaisedButton label="Cancel" onClick={hidePasswordModal}/>
</Dialog>

const CustomToolBar=({account, moneyInAccount, contractAddress})=>
 <Toolbar>
  <ToolbarGroup firstChild={true}>
   <ToolbarTitle text="SkyPet" />
  </ToolbarGroup>
  <ToolbarGroup>
    <ToolbarTitle text="Account:" />
     {account}
     <ToolbarSeparator />
      {moneyInAccount==0?<span>Ether required!  Send the account some Ether to continue</span>:<span>Balance: {moneyInAccount}</span>}
  </ToolbarGroup>
  <AboutComponent contractAddress={contractAddress}/>
</Toolbar>

const TableColumns=({success, children})=>
<Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>TimeStamp</TableHeaderColumn>
        <TableHeaderColumn>Attribute</TableHeaderColumn>
        <TableHeaderColumn>Value</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    {success?
    <TableBody>
    {children}
    </TableBody>
    :null}
</Table>

const SubmitPassword=({onCreate, onType, hasSubmitted=false})=>
<form onSubmit={(e)=>{e.preventDefault();onCreate();}}>
    <TextField floatingLabelText="Password" type="password" onChange={(e)=>{onType(e.target.value);}}/>
    {hasSubmitted?<CircularProgress size={40}/>:
    <FlatButton label="Submit" primary={true} />}
</form>
class GethLogin extends Component{
  constructor(props){
    super(props);
    this.state = {
      error:"",
      waitingResults:false,
      password:""
    };
    socket.on('passwordError', (event, arg)=>{
      this.setState({error:arg, waitingResults:false});
    });
    socket.on('successLogin', (event, arg)=>{
      this.setState({
        waitingResults:false
      })
      this.props.onSuccessLogin();
    });
  }
  
  handleSubmitPassword=()=>{
    this.setState({
      waitingResults:true
    })
    socket.send('password', this.state.password);
  }
  handleTypePassword=(value)=>{
    this.setState({
      password:value
    });
  }
  render() {
   // const {finished, stepIndex} = this.state;
    //const contentStyle = {margin: '0 16px'};

    return (
      <div><p>{this.props.hasAccount?"Password to login to account":"Enter a password to generate your account.  Don't forget this password!"}</p>
        <SubmitPassword onType={this.handleTypePassword} onCreate={this.handleSubmitPassword} hasSubmitted={this.state.waitingResults}/></div>
    );
  }
}

const SelectAttribute=({value, onSelect})=>
<SelectField 
  floatingLabelText="Select Attribute"
  onChange={onSelect}
  value={value}
  defaultValue={0}
>
  {selection.map((val, index)=>{
      return(<MenuItem key={index} value={index} primaryText={val}/>);
  })}
</SelectField>

const MyProgressBar=({value})=>{
  return value>0?<CircularProgress  key="firstCircle" size={80} thickness={5} mode="determinate"  value={value*100}/>:<CircularProgress key="secondCircle" size={80} thickness={5} />
}
const SyncWrap=({isSyncing, children, progress})=>{
  return isSyncing?<MyProgressBar value={progress}/>:children
}
class App extends Component {
  constructor(props){
    super(props); 
    this.state={
      name:"",
      owner:"",
      contractAddress:"",
      showNew:false,
      account:"",
      isSyncing:true,
      accountCreated:false,
      gethPasswordEntered:false,
      successSearch:false,
      cost:0,
      moneyInAccount:0,
      //show:false,
      showError:"",
      addedEncryption:true,//for entering data
      historicalData:[],
      askForPassword:false,
      currentProgress:0,
      hasAccount:false,
      password:"",//for entereing data
      attributeValue:"", //for entering data
      attributeType:0 //for entering ata
    };
    socket.send('startEthereum', 'ping')
    socket.on('accounts', (event, arg) => {
      console.log(arg);
      this.setState({
        account:arg
      });
    })
    socket.on('hasAccount', (event, arg) => {
      console.log(arg);
      this.setState({
        hasAccount:true
      });
    })
    socket.on('sync', (event, arg) => {
      console.log(arg);
      this.setState(arg);
    })
    socket.on('cost', (event, arg) => {
      console.log(arg);
      this.setState({
        cost:arg
      });
    })
    socket.on('petId', (event, arg) => {
      console.log(arg);
      this.setState({
        petId:arg
      });
    })
    socket.on('contractAddress', (event, arg) => {
      this.setState({
        contractAddress:arg
      });
    })
    socket.on('moneyInAccount', (event, arg) => {
      console.log(arg);
      this.setState({
        moneyInAccount:arg
      });
    })
    socket.on('error', (event, arg) => {
      console.log(arg);
      this.setState({
        showError:arg
      });
    })
    socket.on('retrievedData', (event, arg) => {
      console.log(arg);
      this.retrievedData(arg);

    })
  }
  retrievedData=(arg)=>{
    const owner=arg.find((val)=>{
      console.log(val);
      return selection[val.attributeType]==='Owner'
    });
    const name=arg.find((val)=>{
      return selection[val.attributeType]==='Name'
    });
    this.setState({
      successSearch:arg[0]?true:false,
      showNew:arg[0]?false:true,
      historicalData:arg,
      name:name?name.attributeText:"",
      owner:owner?owner.attributeText:""
    });
  }
  onAttributeValue=(event)=>{
      this.setState({
          attributeValue:event.target.value
      });      
  }
  onAttributeType=(event, label, value)=>{
      this.setState({
          attributeType:value
      });      
  }
  toggleAdditionalEncryption=()=>{
      this.setState({
          addedEncryption:!this.state.addedEncryption
      });
  }
  setPassword=(value)=>{
      this.setState({
          password:value
      });
  }
  onPassword=()=>{
    const attVal=Object.assign(formatAttribute(this.state.attributeType,CryptoJS.AES.encrypt(this.state.attributeValue, this.state.password).toString()), {addedEncryption:true});
    console.log(attVal);
    console.log(this.state.attributeValue);
    this.submitAttribute(attVal, attVal.attributeType);
    this.setState({
      askForPassword:false,
      password:""
    });
  }
  onSubmit=()=>{
    var obj={};
    if(this.state.addedEncryption){
      this.setState({
        askForPassword:true
      })
    }
    else{
      this.submitAttribute(formatAttribute(this.state.attributeType,this.state.attributeValue), this.state.attributeValue);
    }
  }
  submitAttribute=(formattedAttribute, attVal)=>{
    console.log(this.state.moneyInAccount);
    console.log(this.state.cost);
    console.log(attVal);
    console.log(formattedAttribute);
    if(this.state.moneyInAccount>this.state.cost){
      socket.send('addAttribute', formattedAttribute)
      this.setState({
        historicalData:this.state.historicalData.concat([{timestamp:new Date(), attributeText:attVal, attributeType:this.state.attributeType, isEncrypted:this.state.addedEncryption}])
      },()=>{
        this.retrievedData(this.state.historicalData);
      });
      
    }
    else{
      alert("Not enough money");
    }
    
  }
  /*showModal=()=>{
    this.setState({
      show:true
    });
  }
  hideModal=()=>{
    this.setState({
      show:false
    });
  }*/

  hidePasswordModal=()=>{
    this.setState({askForPassword: false});
  }
  hideError=()=>{
    this.setState({
      showError:""
    });
  }
  submitPassword=(event)=>{
    console.log(event);
    
  }
  createAccount=(event)=>{
    console.log(event);
  }
  onGethLogin=()=>{
    this.setState({
      hasAccount:true,
      gethPasswordEntered:true
    })
  }
  render(){
      return(
<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
  <div>
    <CustomToolBar 
      account={this.state.account} 
      moneyInAccount={this.state.moneyInAccount}
      contractAddress={this.state.contractAddress}/>
    <PasswordModal 
      onPassword={this.onPassword} 
      setPassword={this.setPassword}  
      hidePasswordModal={this.hidePasswordModal} 
      askForPassword={this.state.askForPassword}/>
    <ErrorModal 
      showError={this.state.showError} 
      hideError={this.hideError}/>
    
    {this.state.hasAccount&&this.state.gethPasswordEntered?
      <SyncWrap isSyncing={this.state.isSyncing} progress={this.state.currentProgress}>
        <Grid columns={12}>
          <Span columns={12}>
          <SelectAttribute value={this.state.attributeType} onSelect={this.onAttributeType}/>
          </Span>
          <Span columns={8}>
            <TextField
              floatingLabelText="Value"
              disabled={!this.state.petId}  onChange={this.onAttributeValue}
            />
          </Span>
          <Span columns={4} last>      
              <Checkbox disabled={!this.state.petId}  label="Add Encryption" defaultChecked={true} onCheck={this.toggleAdditionalEncryption}/>
          </Span>
          <Span columns={12}>
            <RaisedButton disabled={!this.state.petId} onClick={this.onSubmit} label={<span>Submit New Result (costs {this.state.cost} Ether)</span>}/>
          </Span>
          <TableColumns success={this.state.successSearch}>
          {this.state.historicalData.map((val, index)=>{
            return(
                <TblRow key={index} timestamp={val.timestamp.toString()} attributeText={val.attributeText}  label={selection[val.attributeType]||"Unknown"} isEncrypted={val.isEncrypted}/>
            );
          })}
          </TableColumns>              
        </Grid>
      </SyncWrap>:
      <GethLogin hasAccount={this.state.hasAccount} onSuccessLogin={this.onGethLogin}/>
    }
    
    <div className='whiteSpace'></div>
    <div className='whiteSpace'></div>
    <div className='whiteSpace'></div>
    <div className='whiteSpace'></div>
  </div>
</MuiThemeProvider>
      );
  }
}

export default App;