import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
export const MyProgressBar=({value, centerComponent})=>{
  return value>0?<div style={centerComponent}><CircularProgress  key="firstCircle" size={80} thickness={5} mode="determinate"  value={value}/></div>:<div style={centerComponent}><CircularProgress  key="secondCircle" size={80} thickness={5} /></div>
}
export const SyncWrap=({isSyncing, children, progress, centerComponent})=>{
  return isSyncing?<MyProgressBar centerComponent={centerComponent} value={progress}/>:children
}