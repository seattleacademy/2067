const http = require('http');
var WebSocketServer = require('ws').Server;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json({limit: '50mb' })
app.use(jsonParser);
bots = [];


function updateBot(bot){
    if(!bot.id) return bots;
    let id = bot.id;

    for(let i = 0; i < bots.length; i++){
        if(bots[i].id == bot.id){
            for(key in bot){
                bots[i][key]=bot[key];
            }
            return bots;
        }
    }
    const newBot = {};
    bots.push({});
    for(key in bot){
                bots[bots.length-1][key]=bot[key];
            }
    console.log(bots);
}

app.all('/bots', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    bot = req.query || req.body;
    console.log(bot)
    updateBot(bot);
    res.send(JSON.stringify(bots));
});


let server = http.createServer(app);

const serverPort = 1500;
server.listen(serverPort);
console.log('listening on port', serverPort)

var wss = new WebSocketServer({ server: server });

wss.on('connection', function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(bots), function() { /* ignore errors */ });
    }, 500);
   // console.log('connection to client',id);
    ws.on('close', function() {
        //console.log('closing client',id);
        clearInterval(id);
    });
});

function shutdown() {
    process.exit(0)
}

//For control-c
process.on('SIGINT', shutdown);