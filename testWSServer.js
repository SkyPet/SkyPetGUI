var WebSocketServer = require('uws').Server;
var wss = new WebSocketServer({ port: 4000 });

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
                progress+=.1;
                if(progress>1){
                    clearInterval(doProgress);
                    return  ws.send(makeObj('sync', {currentProgress:1, isSyncing:false}));
                }
                ws.send(makeObj('sync', {currentProgress:progress, isSyncing:true}));
            }, 1000);
        }
        else if(val.password){
            const Ids=getIds();
            ws.send(makeObj('petId', Ids.hashId));
            ws.send(makeObj('accounts', "MyTestAccount"));
            ws.send(makeObj('constractAddress', "MyTestContractAddress"));    
            
            ws.send(makeObj('moneyInAccount','1000'));
            ws.send(makeObj('cost','1'));
        }
        
    })
});