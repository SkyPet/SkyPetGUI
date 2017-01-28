import React,  {  Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
export class AboutComponent extends Component {
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
    return(
      <div>
        <RaisedButton label="Learn More" primary={true} onClick={this.onAbout}/>
        <AboutModal blockChainView={this.props.blockChainView} contractAddress={this.props.contractAddress} onClick={this.onAboutClose} hideModal={this.state.closed}/>
      </div>
    )
  }
  
}
export const AboutModal=({hideModal, onClick, contractAddress, blockChainView})=>
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

