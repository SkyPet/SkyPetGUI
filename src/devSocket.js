export default (port)=>{
    if(!process.env.REACT_APP_ELECTRON&&window.WebSocket){
        let mySocket=new WebSocket(`ws://localhost:${port}`, "protocolOne"); 
        let isOpen=false;
        let holdMessages=[];
        mySocket.onopen=(event)=>{
            isOpen=true;
            holdMessages.map(val=>{
                return mySocket.send(val)
            })
            holdMessages=null
        }
        window.socket={
            definedKeys:{},
            send:(key, value)=>{
                const obj={[key]:value}
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
}
