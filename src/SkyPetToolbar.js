import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {AboutComponent} from './SkyPetAbout';
export const CustomToolBar=({account, moneyInAccount, contractAddress, blockChainView})=>
 <Toolbar>
  <ToolbarGroup firstChild={true}>
   <ToolbarTitle text="SkyPet" />
    {`Account: ${account}`}
  <ToolbarSeparator/>
  {account?moneyInAccount===0?"Ether required!  Send the account some Ether to continue.":`Balance: ${moneyInAccount}`:""}
  </ToolbarGroup>
  <ToolbarGroup>
    <AboutComponent blockChainView={blockChainView} contractAddress={contractAddress}/>
  </ToolbarGroup>
</Toolbar>

CustomToolBar.propTypes = {
  account:React.PropTypes.string.isRequired,
  moneyInAccount:React.PropTypes.number.isRequired,
  contractAddress:React.PropTypes.string.isRequired,
  blockChainView:React.PropTypes.string.isRequired
};