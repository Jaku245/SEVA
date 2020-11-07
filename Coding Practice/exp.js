// const http = require('http');

// const routes = {
//     '/' : (req,res) => {
//         res.writeHead(200);
//         res.end('hello world');
//     },
//     '/foo' : (req,res) => {
//         res.writeHead(200);
//         res.end('your are viewing foo');
//     }
// };

// http.createServer((req,res) => {

//     if(req.url in routes){
//         return routes[req.url](req,res);
//     }

//     res.writeHead(404);
//     res.end(http.STATUS_CODES[404]);
// }).listen(1337);


// 

const express = require('express');
var cookieParser = require('cookie-parser');
const middle = require('./middleware');

const  app = express();
app.use(cookie);

class GreetingService{
    constructor(greeting = 'hello'){
        this.greeting = greeting;
    }

    createGreeting(name){
        return `${this.greeting}, ${name}`
    }
}


app.use('/api/v1',middle({
    service : new GreetingService('Hello')
})).use('/api/v2',middle({
    service : new GreetingService('Hi')
}));

app.get('/setCookie',(req,res) => {
    res.cookie('name','John',{ maxAge : 90000, httpOnly : true });
    return res.send('Cookie has been set');
});

app.get('/getCookie',(req,res) => {
    const name = req.cookies['name'];
    if(name){
        return res.send(name);
    }
    return res.send('Cookie not found');
});

app.listen(3000);
