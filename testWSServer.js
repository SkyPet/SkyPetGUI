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
                    return  ws.send(makeObj('sync', {currentProgress:100, isSyncing:false}));
                }
                ws.send(makeObj('sync', {currentProgress:progress, isSyncing:true}));
            }, 1000);
        }
        else if(val.password){
            if(val.password!==testPassword){
                return ws.send(makeObj('passwordError', "Wrong password"));
            }
            const Ids=getIds();
            ws.send(makeObj('successLogin', 'p'))
            ws.send(makeObj('petId', Ids.hashId));
            ws.send(makeObj('accounts', "MyTestAccount"));
            ws.send(makeObj('constractAddress', "MyTestContractAddress"));    
            ws.send(makeObj('retrievedData', [{timestamp:new Date(), attributeText:"Hello World", isEncrypted:false, attributeType:"0"}]))
            ws.send(makeObj('moneyInAccount',1000));
            ws.send(makeObj('cost',1));
        }
        
    })
});