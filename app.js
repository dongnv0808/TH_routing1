let http = require('http');
let url = require('url');
let stringDecoder = require('string_decoder').StringDecoder;

let handlers = {};

handlers.sample = (data, callback) => {
    callback(406, {'name': 'sample handle'});
};

handlers.notFound = (data, callback) => {
    callback(404);
}

handlers.home = (data, callback) => {
    callback(200, 'Home page');
}

let router = {
    'sample': handlers.sample,
    'home': handlers.home
}

let server = http.createServer((req, res) => {    
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    console.log(trimPath);
    req.on('data', data => {

    })
    req.on('end', end => {
        let chosenHandler;
        if(typeof (router[trimPath]) === 'undefined'){
            chosenHandler = handlers.notFound;
        }else{
            chosenHandler = router[trimPath];
        }
        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) == "number" ? statusCode: 200;
            payload = typeof(payload) == "object" ? payload: {};
            let payLoadString = JSON.stringify(payload);
            res.writeHead(statusCode);
            res.end(payLoadString);
        })
        res.end();
    })
    let data = {
        "trimPath" : trimPath,
    }
    })

server.listen(8080, () => {
    console.log('Running at localhost:8080');
})
