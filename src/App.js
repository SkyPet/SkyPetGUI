import React,  {  Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import update from 'immutability-helper';
import {TblRow, TableColumns} from './SkyPetTable';
import {EntryForm} from './SkyPetPasswords';
import {GethLogin} from './SkyPetCreateAccount';
import {SyncWrap} from './SkyPetProgress';
import {CustomToolBar} from './SkyPetToolbar';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import CryptoJS from "crypto-js";
import { keccak_256 } from 'js-sha3';
import devSocket from './devSocket'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
const devPort=4000
devSocket(devPort)//fakes a window.socket for dev purposes

const blockChainView='https://testnet.etherscan.io/address/';
const selection=[
    "Temperament",
    "Name",
    "Owner", //this can be encrypted
    "Address" //this can be encrypted
];
const centerComponent={display: 'flex', alignItems: 'center', flexDirection:'column'};
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
  return {[attributeType]:attributeValue}
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



const getNextAttribute=(attributeType)=>(
  [
    {
      timestamp:new Date().toISOString(), 
      attributeText:"Your data will show soon", 
      attributeType:attributeType, isEncrypted:false
    }
  ]
)
const events=[
  'account',
  'info',
  'sync',
  'cost',
  'contractAddress',
  'passwordError',
  'attributeAdded',
  'moneyInAccount',
  'error',
  'retrievedData'
]

const handleWindow=(eventHandler)=>{
  if(!window.socket){
    return
  }
  events.map(event=>window.socket.on(event, (e, arg)=>eventHandler[event](arg, window.socket)))
}

const decryptToString=(encryptedValue, password)=>CryptoJS.AES.decrypt(encryptedValue, password).toString(CryptoJS.enc.Utf8)

const encryptToString=(decryptedValue, password)=>CryptoJS.AES.encrypt(decryptedValue, password).toString()

const hasPasswordOrPasswordNotRequired=(password, requiresEncryption)=>password||!requiresEncryption 

class App extends Component {
  state={
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
    hashId:"",
    info:"",
    password:"",//for entereing data
    attributeValue:"", //for entering data
    attributeType:0 //for entering ata
  };
  eventHandler={
    account:(account) => {
      this.setState({account})
    },
    info:(info) => {
      this.setState({info});
    },
    sync:(sync) => {
      console.log(sync);
      this.setState(sync);
    },
    cost:(cost, socket) => {
      /**temprorary! */
      const myIds=getIds();
      socket.send('id', myIds.hashId)
      /**End temporary */
      this.setState({
        cost,
        /**temporary */
        hashId:myIds.hashId,
        unHashedId:myIds.unHashedId
        /**end temprorary */
      })
    },
    contractAddress:(contractAddress) => {
      this.setState({contractAddress})
    },
    passwordError:(passwordError) => {
      console.log(passwordError);
      this.setState({
        passwordError,
        hasSubmitted:false
      }, ()=>{
        setTimeout(()=>{
          this.setState({
            passwordError:""
          })}, msToWait
        )
      })
    },
    attributeAdded:(arg) => {
      this.setState({
        passwordError:"",
        password:"",
        hasSubmitted:false,
        showEntry:false
      }, ()=>{
        this.retrievedData(this.state.historicalData.concat(getNextAttribute(this.state.attributeType)))
      })
    },
    moneyInAccount:(moneyInAccount) => {
      this.setState({moneyInAccount});
    },
    error:(showError) => {
      this.setState({showError})
    },
    retrievedData:(arg) => {
      const {unHashedId}=this.state
      this.retrievedData(arg.map(val=>{
        return Object.assign(parseResults(decryptToString(val.value, unHashedId)), {timestamp:val.timestamp})
      }))
    }
  }
  retrievedData=(historicalData)=>{
    this.setState((prevState, props)=>(
      {
        successSearch:historicalData[0]?true:false,
        historicalData
      }
    ))
  }
  onAttributeValue=(event, attributeValue)=>{
    this.setState({attributeValue})
  }
  onAttributeType=(event, label, attributeType)=>{
    this.setState({attributeType})
  }
  toggleAdditionalEncryption=()=>{
    this.setState({
      addedEncryption:!this.state.addedEncryption
    })
  }
  setPassword=(event, password)=>{
    this.setState({password})
  }
  onPassword=()=>{
    const {attributeType, attributeValue, password}=this.state
    const attVal=Object.assign(formatAttribute(attributeType,encryptToString(attributeValue, password)), {addedEncryption:true})
    this.submitAttribute(attVal, attVal[attributeType])
  }
  onSubmit=()=>{
    const {addedEncryption, attributeType, attributeValue}=this.state
    addedEncryption?this.onPassword():this.submitAttribute(formatAttribute(attributeType,attributeValue), attributeValue)
  }
  submitAttribute=(formattedAttribute, attVal)=>{
    const {moneyInAccount, unHashedId, password, hashId, cost}=this.state
    if(moneyInAccount>cost){
      window.socket.send('addAttribute', {
        message:encryptToString(JSON.stringify(formattedAttribute), unHashedId), 
        hashId, 
        password
      })
      this.setState({
        hasSubmitted:true
      })
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
    this.setState({account})
  }
  entryValidation=()=>{
    const{unHashedId, password, addedEncryption, attributeValue}=this.state
    const hasUnhashedAndPasswordAndValue=unHashedId&&hasPasswordOrPasswordNotRequired(password, addedEncryption)&&attributeValue
    return !hasUnhashedAndPasswordAndValue;
  }
  componentWillMount(){
    handleWindow(this.eventHandler)
  }
  render(){
    const mainStyle = {
      margin: 20,
    };
    const {account, moneyInAccount, contractAddress, showEntry, attributeType, cost, passwordError, hasSubmitted, addedEncryption, hashId, historicalData, successSearch, isSyncing,currentProgress, info}=this.state
      return(
<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
  <div>
    <CustomToolBar 
      account={account} 
      moneyInAccount={moneyInAccount}
      contractAddress={contractAddress}
      blockChainView={blockChainView}/>
    <Dialog
      open={showEntry}
      onRequestClose={this.hideEntryModal}
    >
      <EntryForm 
        selection={selection}
        selectValue={attributeType}
        onSelect={this.onAttributeType}
        onCheck={this.toggleAdditionalEncryption}
        cost={cost}
        onText={this.onAttributeValue}
        shouldDisable={!hashId}
        onSubmit={this.onSubmit}
        onPassword={this.setPassword}
        passwordError={passwordError}
        hasSubmitted={hasSubmitted}
        isChecked={addedEncryption}
        formValidation={this.entryValidation}
      />
    </Dialog>
    <div style={mainStyle}>
    {account?
      <div>
        <RaisedButton primary={true} label="Add Entry" onClick={this.showEntryModal}/>
        <TableColumns success={successSearch}>
        {historicalData.map((val, index)=>(
          <TblRow msToWait={msToWait} key={index} timestamp={val.timestamp.toString()} attributeText={val.attributeText}  label={selection[val.attributeType]||"Unknown"} isEncrypted={val.isEncrypted}/>
        ))}
        </TableColumns>              
      </div>:<SyncWrap 
        centerComponent={centerComponent} 
        isSyncing={isSyncing} 
        progress={currentProgress} 
        info={info}
      >
        <GethLogin 
          centerComponent={centerComponent} 
          msToWait={msToWait} 
          text="Enter a password to generate your account.  Don't forget this password!" 
          onSuccessLogin={this.onGethLogin}
        />
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