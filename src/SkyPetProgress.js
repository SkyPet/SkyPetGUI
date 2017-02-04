import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
export const MyProgressBar=({value, centerComponent, info=""})=>{
  const infoBox=<span>{info}</span>
  return value>0?<div style={centerComponent}><CircularProgress  key="firstCircle" size={80} thickness={5} mode="determinate"  value={value}/><br/>{infoBox}</div>:<div style={centerComponent}><CircularProgress  key="secondCircle" size={80} thickness={5} /><br/>{infoBox}</div>
}
export const SyncWrap=({isSyncing, children, progress, centerComponent, info=""})=>{
  return isSyncing?<MyProgressBar centerComponent={centerComponent} value={progress} info={info}/>:children
} 
MyProgressBar.propTypes = {
  value:React.PropTypes.number.isRequired,
  centerComponent:React.PropTypes.object,
  info:React.PropTypes.string
};
SyncWrap.propTypes = {
  isSyncing:React.PropTypes.bool.isRequired,
  progress:React.PropTypes.number.isRequired,
  centerComponent:React.PropTypes.object,
  children:React.PropTypes.node.isRequired,
  info:React.PropTypes.string
};