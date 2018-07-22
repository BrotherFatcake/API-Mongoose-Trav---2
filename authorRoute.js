//Use strict
"use strict";

//**Only needed if using Express Routing**
//Create a constant to import(require) express
const express = require('express');

//Create a constant of router equal express Router with no args
const router = express.Router();


//create const of Primary {modelName}  OR {modelName1, modelName2} to require models file
const {authorModel, blogModel} = require('./models');


//At bottom of file
//module exports the const router

//**End Express Routing specific**



//**Needed for all CRUD**
//**If part of server.js use 'app.' instead of 'router.' and '/endPointName' and '/endPointName/:id' instead of '/' and '/:id'**


//GET - ALL

//call router or app get from '/' with args request response =>
router.get('/', (req,res) => {
    //modelName find with no args
    authorModel.find()
    //then with arg <DB collectionName> =>
    .then(authors    =>    {
        //respond with json object key/val pair, key is <DB collectionName> and val is <DB collectionName> map
        res.json({authors: authors.map(
            
            //New map (arrayName) => (arrayName) through cleanUp method with no args 
            (author) => author.cleanUp()
            )}
        )
    })
    //ERROR CATCHER
    //catch err =>
    .catch(err => {
        //log error err to console
        console.error(err)
        //respond status 500 and json object message stating error ocurred
        res.status(500).json({"error message": 'Something is broken'});
    });
});




//GET by ID

//call router or app get from '/:id' with args request response =>
router.get('/:id', (req, res) => {
    //modelName findById with args request params id
    authorModel.findById(req.params.id)
    
    //then dataName => respond json non-object with arg of dataName cleanUp method
    //where data name (ex. student or post or data) is the object being returned

    .then(author => {
        res.json(author.cleanUp())
    })

    //ERROR CATCHER
    //catch err =>
    .catch(err => {
        //log error err to console
        console.error(err)
        //respond status 500 with json message stating error ocurred
        res.status(500).json({"error message": 'unable to find id'})
    });
});



//POST

//call router or app post from '/' with args request response =>
router.post('/', (req,res) => {
    //create const array that specifies required fields
        //If required field has sub-fields they do not need to be specified here it would be specified 
        //in the POST request sent from postman
    const requiredFields = ['firstName', 'lastName', 'userName'];

    //loop through requiredFields
    for (let i=0; i<requiredFields; i++) {
    
        //create const field and assign requiredField position i during loop
        const field = requiredInputs[i];

        //IF field is not in the request body
        if(!(field in req.body)) {
            //create const for error message naming missing field from body
            const errMessage = `${field} is missing from request`
            //log the error to console with arg errMessage
            console.error(errMessage);
            //return response status 400 and send errMessage
            res.status(400).send(errMessage);

        }
    }
    //DETERMINE IF KEY VAL ALREADY EXISTS IN DB - this is needed when there is a UNIQUE value that must be created
    //modelName and find one {object pair}
        //Within object is {key: val} or {key: req.body.val}
    authorModel.findOne({userName: req.body.userName})

    //then dataName => 
    .then(author => {

        //IF dataName exists
        if(author) {

            //create const for error message naming missing field from body
            const errMessage = `${req.body.userName} is unavailable`
            //log the error to console with arg errMessage
            console.error(errMessage);
            //return response status 400 and send errMessage
            return res.status(400).send(errMessage);
        }
        
        //ELSE when dataName does not already exist continue with creation
        else {
            //CREATE NEW DB OBJECT
            //modelName create {object} that contains the key req body pair values
            authorModel.create({
                //Within object {key1: req.body.val1, ley2: req.body.val2}
                //If key/val has sub-key/val they do not need to be specified here it would be specified 
                //in the POST request sent from postman
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName
            })
            
            //then dataName => respond status 201 and json dataName send through cleanUp
            //where data name (ex. student or post or data) is the object being returned
            .then(author => {
                res.status(201).json(author.cleanUp())
            })
        
            }
        })

        //END flow for unique check
            
        //ERROR CATCHER
        //catch err =>
        .catch(err => {
            //log error err to console
            console.error(err)
            //respond status 500 with json message stating error ocurred
            res.status(500).json({"error message": 'unable to post data'})

        })
        
    
});

//PUT
            
//call router or app put from '/:id' with args request response =>
router.put('/:id', (req,res) => {
                
    //IF NOT request params id AND request body id AND request params id strict equal request body id 
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        
        //create const for error message stating request params id AND request body id must match
        const putErrMessage = `${req.params.id} and ${req.body.id} must match`
        
        //log the error to console with arg errMessage
        console.error(putErrMessage)
        
        //return response status 400 and send errMessage
        return res.status(400).send(putErrMessage);
    }
    
    //create const of empty object for fields to update
    const toUpdate = {};
    
    //create const array of fields that are allowed to be updated
    const updateAllowed = ['firstName', 'lastName', 'userName'];

    //for each canUpdate with arg dataArg =>
    updateAllowed.forEach(data => {

        //if dataArg is in request body
        if(data in req.body) {

            //assign the request body[dataArg] to toUpdate[dataArg] object
            toUpdate[data] = req.body[data];

        }
    
    });
    //DETERMINE IF KEY VAL ALREADY EXISTS IN DB - this is needed when there is a UNIQUE value that can be updated
    //call model and find one {object pair}
        //Within object is {key: val} or {key: req.body.val}
    authorModel.findOne({userName: req.body.userName})

    .then(author => {
        
        //IF dataName exists
        if(author) {
            
            //create const for error message naming missing field from body
            const errMessage = `${req.body.userName} is unavailable`
            //log the error to console with arg errMessage
            console.error(errMessage);
            //return response status 400 and send errMessage
            return res.status(400).send(errMessage);
        }
            
        //ELSE when dataName does not already exist continue with update
        else {
    
            //modelName call findByAndUpdate with args request params id and object with $set/val pair where val is toUpdate
            authorModel.findByIdAndUpdate(req.params.id, {$set: toUpdate})
            
            //then dataName => respond with status 204, json message naming request body id has been updated, and end with no args
            //where data name (ex. student or post or data) is the object being returned
            
            .then(data => 
                res.status(204).json({"message": `${req.body.id} has been updated`}).end()
            )
                
            }
        })

        //END flow for unique check



        //ERROR CATCHER
        //catch err =>
        .catch(err => {
    
            //log error err to console
            console.error(err);

            //respond status 500 with json message stating error ocurred
            res.status(500).json({"error message": 'error occurred while updating'});
        });
        
    
});
    
    //DELETE
    
//call router or app delete from '/:id' with args request response =>
router.delete('/:id', (req,res) => {

    //DELETE MULTIPLE SHARED VALUES IN DB FROM SECOND Collection - this is needed when there is a UNIQUE Primary Collection value being deleted in a one to many 
    //set the request ID to a parameter
    let author = req.params.id

    //Call secondary Model and deleteMany based on shared {key/val pair}
    blogModel.deleteMany({author: author})
    
    //then dataName => respond status 204
    .then(posts =>  {
        res.status(204)//.json({message: `${req.params.id} posts have been removed`})
    })

    //END flow for unique check

    //modelName findByIdAndRemove with arg request params id
    authorModel.findByIdAndRemove(req.params.id)
    //then dataName => respond with  status 204, json message naming request params id has been removed, and end with no args
    //where data name (ex. student or post or data) is the object being returned
    .then(data => {
        res.status(204).json({message: `${req.params.id} has been removed`}).end();
    })
    
    //ERROR CATCHER
    //catch err =>
    .catch(err => {

        //log error err to console
        console.error(err);

        //respond status 500 with json message stating error ocurred
        res.status(500).json({"error message": 'error occurred while deleting'})

    })

})

module.exports = router;