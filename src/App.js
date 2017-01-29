import React,  {  Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import update from 'immutability-helper';
import {TblRow, TableColumns} from './SkyPetTable';
import {EntryForm} from './SkyPetPasswords';
import {GethLogin} from './SkyPetCreateAccount';
import {SyncWrap} from './SkyPetProgress';
import {CustomToolBar} from './SkyPetToolbar';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import CryptoJS from "crypto-js";
import { keccak_256 } from 'js-sha3';
if(!process.env.REACT_APP_ELECTRON&&window.WebSocket){
  var mySocket=new WebSocket("ws://localhost:4000", "protocolOne"); 
  var isOpen=false;
  var holdMessages=[];
  mySocket.onopen=(event)=>{
    isOpen=true;
    holdMessages.map((val, index)=>{
      mySocket.send(val);
    })
    holdMessages="";
  }
  window.socket={
    definedKeys:{},
    send:(key, value)=>{
      var obj={};
      obj[key]=value;
      if(!isOpen){
        holdMessages.push(JSON.stringify(obj));
      }
      else{
        mySocket.send(JSON.stringify(obj));
      }
      
    },
    on:(key, cb)=>{
      window.socket.definedKeys[key]=cb;
    }

  }
  mySocket.onmessage=(event)=>{
    const data=JSON.parse(event.data);
    const key=Object.keys(data)[0];
    if(window.socket.definedKeys[key]){
      window.socket.definedKeys[key](null, data[key]);
    }
  }
}

import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

//const centerComponent={display: 'flex', justifyContent: 'center'};
const blockChainView='https://testnet.etherscan.io/address/';
const selection=[
    "Temperament",
    "Name",
    "Owner", //this can be encrypted
    "Address" //this can be encrypted
];
const centerComponent={display: 'flex', justifyContent: 'center'};
const msToWait=3000;
/**This is testing only! */
const getIds=()=>{
    return {
        unHashedId:"MyId4",
        hashId:"0x"+keccak_256("MyId4")
    }
}
/**end testing only! */
const formatAttribute=(attributeType, attributeValue)=>{
  var obj={};
  obj[attributeType]=attributeValue;
  return obj;
}
export const parseResults=(result)=>{ 
    //result is an object.  if data is encrypted, MUST have an "addedEncryption" key.
    try{ 
        const parsedResult=JSON.parse(result);
        return Object.keys(parsedResult).filter((val)=>{
            return val!=='addedEncryption';
        }).reduce((cumulator, key, index)=>{
            return {
                attributeText:index>0?cumulator.attributeText+', '+parsedResult[key]:parsedResult[key],
                attributeType:index>0?cumulator.attributeType+', '+key:key,
                isEncrypted:parsedResult.addedEncryption?true:false
            }  
        }, {attributeType:'', attributeText:'', isEncrypted:false})
    }catch(e){
        return {attributeType:"generic", attributeText:result, isEncrypted:false};
    }
}




class App extends Component {
  constructor(props){
    super(props); 
    this.state={
      contractAddress:"",
      account:"",
      isSyncing:true,
      successSearch:false,
      cost:0,
      showEntry:false,
      moneyInAccount:0,
      passwordError:"",
      addedEncryption:true,//for entering data
      historicalData:[],
      currentProgress:0,
      hasSubmitted:false,
      unHashedId:"",
      hashedId:"",
      password:"",//for entereing data
      attributeValue:"", //for entering data
      attributeType:0 //for entering ata
    };
    if(window.socket){
      window.socket.send('startEthereum', 'ping');
      window.socket.on('account', (event, arg) => {
        console.log(arg);
        this.setState({
          account:arg
        });
      })
      window.socket.on('sync', (event, arg) => {
        console.log(arg);
        this.setState(arg);
      })
      window.socket.on('cost', (event, arg) => {

        /**temprorary! */
        const myIds=getIds();
        window.socket?window.socket.send('id', myIds.hashId):"";
        
        /**End temporary */
        this.setState({
          cost:arg,
          /**temporary */
          hashId:myIds.hashId,
          unHashedId:myIds.unHashedId
          /**end temprorary */
        });
      })
      window.socket.on('contractAddress', (event, arg) => {
        this.setState({
          contractAddress:arg
        });
      })
      window.socket.on('passwordError', (event, arg) => {
        this.setState({
          passwordError:arg,
          hasSubmitted:false
        }, ()=>{
          setTimeout(()=>{
            this.setState({
              passwordError:""
          })}, msToWait
          )
        });
      })
      window.socket.on('attributeAdded', (event, arg) => {
        this.setState({
          //showEntry:false,
          passwordError:"",
          password:"",
          hasSubmitted:false,
          showEntry:false
        }, ()=>{
          this.retrievedData(this.state.historicalData.concat([{timestamp:new Date().toISOString(), attributeText:"Your data will show soon", attributeType:this.state.attributeType, isEncrypted:false}]))
        });
      })
      window.socket.on('moneyInAccount', (event, arg) => {
        this.setState({
          moneyInAccount:arg
        });
      })
      window.socket.on('error', (event, arg) => {
        this.setState({
          showError:arg
        });
      })
      window.socket.on('retrievedData', (event, arg) => {
        this.retrievedData(arg.map((val, index)=>{
          const parsedResult=CryptoJS.AES.decrypt(val.value, this.state.unHashedId).toString(CryptoJS.enc.Utf8);
          return Object.assign(parseResults(parsedResult), {timestamp:val.timestamp})
        }));

      })
    }
  }
  retrievedData=(arg)=>{
    this.setState(update(this.state, {successSearch:{$set:arg[0]?true:false}, historicalData:{$set:arg}}));
  }
  onAttributeValue=(event, value)=>{
      this.setState({
          attributeValue:value
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
  setPassword=(event, value)=>{
      this.setState({
          password:value
      });
  }
  onPassword=()=>{
    const attVal=Object.assign(formatAttribute(this.state.attributeType,CryptoJS.AES.encrypt(this.state.attributeValue, this.state.password).toString()), {addedEncryption:true});
    this.submitAttribute(attVal, attVal[this.state.attributeType]);
  }
  onSubmit=()=>{
    if(this.state.addedEncryption){
      this.onPassword();
    }
    else{
      this.submitAttribute(formatAttribute(this.state.attributeType,this.state.attributeValue), this.state.attributeValue);
    }
  }
  submitAttribute=(formattedAttribute, attVal)=>{
    if(this.state.moneyInAccount>this.state.cost){
      window.socket.send('addAttribute', {message:CryptoJS.AES.encrypt(JSON.stringify(formattedAttribute), this.state.unHashedId).toString(), hashId:this.state.hashId, password:this.state.password});
      this.setState({
        hasSubmitted:true
    });
    }
    else{
      alert("Not enough money");
    }
    
  }
  showEntryModal=()=>{
    this.setState({
      showEntry:true
    });
  }
  hideEntryModal=()=>{
    this.setState({
      showEntry:false
    });
  }
  hideError=()=>{
    this.setState({
      showError:""
    });
  }
  onGethLogin=(account)=>{
    this.setState({
      account:account
    })
  }
  entryValidation=()=>{
    return !(this.state.unHashedId&&(this.state.password||!this.state.addedEncryption)&&this.state.attributeValue);
  }
  render(){
    const mainStyle = {
      margin: 20,
    };
      return(
<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
  <div>
    <CustomToolBar 
      account={this.state.account} 
      moneyInAccount={this.state.moneyInAccount}
      contractAddress={this.state.contractAddress}
      blockChainView={blockChainView}/>
    <Dialog
      open={this.state.showEntry}
      onRequestClose={this.hideEntryModal}
    >
      <EntryForm 
        selection={selection}
        selectValue={this.state.attributeType}
        onSelect={this.onAttributeType}
        onCheck={this.toggleAdditionalEncryption}
        cost={this.state.cost}
        onText={this.onAttributeValue}
        shouldDisable={!this.state.hashId}
        onSubmit={this.onSubmit}
        onPassword={this.setPassword}
        passwordError={this.state.passwordError}
        hasSubmitted={this.state.hasSubmitted}
        isChecked={this.state.addedEncryption}
        formValidation={this.entryValidation}
      />
    </Dialog>
    <div style={mainStyle}>
    {this.state.account?
      <div>
        <RaisedButton primary={true} label="Add Entry" onClick={this.showEntryModal}/>
        <TableColumns success={this.state.successSearch}>
        {this.state.historicalData.map((val, index)=>{
          return(
              <TblRow msToWait={msToWait} key={index} timestamp={val.timestamp.toString()} attributeText={val.attributeText}  label={selection[val.attributeType]||"Unknown"} isEncrypted={val.isEncrypted}/>
          );
        })}
        </TableColumns>              
      </div>:<SyncWrap centerComponent={centerComponent} isSyncing={this.state.isSyncing} progress={this.state.currentProgress}>
        <GethLogin centerComponent={centerComponent} msToWait={msToWait} text="Enter a password to generate your account.  Don't forget this password!" onSuccessLogin={this.onGethLogin}/>
      </SyncWrap>
     
    }
    </div>
    
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