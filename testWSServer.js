var WebSocketServer = require('uws').Server;
const Web3 = require('web3');
var web3=new Web3();
var wss = new WebSocketServer({ port: 4000 });
const testPassword="mypassword";
const getIds=()=>{
    return {
        unHashedId:"MyId4",
        hashId:web3.sha3("MyId4")
    }
}
const makeObj=(key, val)=>{
    var obj={};
    obj[key]=val;
    return JSON.stringify(obj);
}
wss.on('connection', function(ws) {
    ws.on('message', (msg)=>{
        const val=JSON.parse(msg);
        if(val.startEthereum){
            //console.log(msg)
            var progress=0;
            var doProgress=setInterval(()=>{
                progress+=10;
                if(progress>100){
                    clearInterval(doProgress);
                    
                    ws.send(makeObj('account', "MyTestAccount"));
                    ws.send(makeObj('moneyInAccount', 100));
                    ws.send(makeObj('cost',1));
                    ws.send(makeObj('sync', {currentProgress:100, isSyncing:false}));
                    
                }
                ws.send(makeObj('sync', {currentProgress:progress, isSyncing:true}));
                
            }, 100);
        }
        else if(val.id){
            ws.send(makeObj('retrievedData', [{timestamp:new Date().toISOString(), value:"Hello World", isEncrypted:false, attributeType:"0"}]))
        }
        else if(val.addAttribute){
            if(val.addAttribute.password===testPassword){
                ws.send(makeObj('attributeAdded', true));
            }
            else{
                ws.send(makeObj('passwordError', "Incorrect Password")); 
            }
        }
        else if(val.getAttributes){
            ws.send(makeObj('retrievedData', [{timestamp:new Date(), attributeText:"Hello World", isEncrypted:false, attributeType:"0"}]))
        }
        
    })
});