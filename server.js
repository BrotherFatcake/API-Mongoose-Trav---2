//Use strict
"use strict";

//Create a constant to import(require) express
const express = require('express');

//Create a constant to import(require) mongoose
const mongoose = require('mongoose');

//Create a constant to import/require morgan for logging
const morgan = require('morgan');

//mongoose Promise to use global ES6 Promises
mongoose.Promise = global.Promise;

//Create const of PORT, DATABASE_URL to import(require) config.js
const {PORT, DATABASE_URL} = require('./config');

//create const of Primary {modelName}  OR {modelName1, modelName2} to require models file
const {authorModel, blogModel} = require('./models');

//Create const of Secondary {modelName} to import(require) models.js
//const {blogModel} = require('./models');

//Create constant that creates a new app instance by calling top level express function
const app = express();

//tell app to use express.json
app.use(express.json());

//tell app to use morgan for common logging
app.use(morgan('common'));


//**If using Express Routing by putting CRUD code in separate JS file**

//Create const for new `constNameRoute` (can name it anything) to import(require) routeFile.js (can name it anything) *duplicate for multiple route files
const blogRoute = require('./blogRoute');

const authorRoute = require('./authorRoute');

//tell app to use args of '/endPointName' and const specified for 'constNameRoute' *duplicate for multiple route files
app.use('/blogs', blogRoute);

app.use('/authors', authorRoute);

//**End Express Routing specific**


/*	Catch-all and Server Start/Stop		*/

//catch-all endpoint
//tell app to use args `"*"` and `function with req/res` args
app.use('*', function(req,res) {
    
    //response status 404 and json message 
    res.status(404).json("an error");
});




//Server Start
//declare empty `server` variable - this is needed for stopServer
let server;

//function named startServer takes args `databaseUrl` and `port = PORT`
function startServer(databaseUrl, port=PORT)    {
    //return a new promise with args `resolve` and `reject =>`
    return new Promise((resolve, reject) =>   {

        //tell mongoose to connect with args `databaseUrl` and `err =>`
        mongoose.connect(databaseUrl, err => {
            //if err return reject err
            if(err){
                return reject(err);
            }
            
                //assign `server` = app listen with args port and () =>
                server = app.listen(port, () => {
                    //log to console the app is listening to port ${port}
                    console.log(`server is using port ${port}`);
                    //resolve for outstanding promise
                resolve();  
                })

            //chain on args `error` and err =>
            .on('error', err => {
                //mongoose disconnect
                mongoose.disconnect();
                //reject with arg err for outstanding promise
                reject(err);
            });    
        });
    });
            
};

//Server Stop

//function named stopServer has no args
function stopServer()   {

    //return mongoose disconnect with no args then with no args `=>`
    return mongoose.disconnect().then(() => {

        //return a new promise with args `resolve` and `reject =>`
        return new Promise((resolve, reject) => {
            //log to console the server is being stopped
            console.log('server being stopped');

            //tell `server` to close with arg `err =>`
            server.close(err => {
                //if err return reject with err for outstanding promise
                if(err) {
                   return reject(err);
                }

                //resolve for outstanding promise
                resolve();
            });
        });
    });
};


//Code to allow server to be called directly or via tests
//if require main is strictly equal to module

if (require.main === module) {
    //runServer with arg DATABASE_URL, catch with arg err => error to console with arg err to console not a message 
    startServer(DATABASE_URL).catch(err => {console.error(err)
    })

};



//module exports equal object containing app, runServer and closeServer
module.exports = {app, startServer, stopServer};