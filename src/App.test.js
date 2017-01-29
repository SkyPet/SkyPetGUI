import React from 'react';
import ReactDOM from 'react-dom';
import App, {parseResults} from './App';

/*const WebSocket=function(){ //necessary since running in node

}*/
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('works with parse results', () => {
  var testString=JSON.stringify({someAttribute:'someResult'});
  expect(parseResults(testString)).toEqual({attributeType:'someAttribute', attributeText:'someResult', isEncrypted:false})
  //expect(2 + 2).toBe(4);
});
it('works with parse results', () => {
  var testString=JSON.stringify({someAttribute:'someResult', addedEncryption:true});
  expect(parseResults(testString)).toEqual({attributeType:'someAttribute', attributeText:'someResult', isEncrypted:true})
  //expect(2 + 2).toBe(4);
});
