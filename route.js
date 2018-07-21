//Use strict
"use strict";

//**Only needed if using Express Routing**
//Create a constant to import(require) express
const express = require('express');

//Create a constant of router equal express Router with no args
const router = express.Router();

//Create const of {model} to import(require) models.js
const {blogModel} = require('./models');

//At bottom of file
//module exports the const router

//**End Express Routing specific**



//**Needed for all CRUD**
//**If part of server.js use 'app.' instead of 'router.' and '/endPointName' and '/endPointName/:id' instead of '/' and '/:id'**

//GET - ALL

//call router or app get from '/' with args request response =>
router.get('/', (req,res) => {
    //modelName find with no args
    blogModel.find()
    //then with arg <DB collectionName> =>
    .then(blogposts =>    {
        //respond with json object key/val pair, key is <DB collectionName> and val is <DB collectionName> map
        res.json({blogposts: blogposts.map(
            
            //New map (arrayName) => (arrayName) through cleanUp method with no args 
            (post) => post.cleanUp()
            )}
        )
    })
    //ERROR CATCHER
    //catch err =>
    .catch(err => {
        //log error err to console
        console.error(err)
        //respond status 500 and json object message stating error ocurred
        res.status(500).json({"error message": 'unable to find id'});
    });
});



//GET by ID

//call router or app get from '/:id' with args request response =>
router.get('/:id', (req, res) => {
    //modelName findById with args request params id
    blogModel.findById(req.params.id)
   
    //then dataName => respond json non-object with arg of dataName cleanUp method
        //where data name (ex. student or post or data) is the object being returned

    .then(post => {
        res.json(post.cleanUp())
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
    const requiredFields = ['title', 'content', 'author'];

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
    
    //CREATE NEW DB OBJECT
    //modelName create {object} that contains the key req body pair values
    blogModel.create({
        //Within object {key1: req.body.val1, ley2: req.body.val2}
        //If key/val has sub-key/val they do not need to be specified here it would be specified 
            //in the POST request sent from postman
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        })
        .then(post => {
            //then dataName => respond status 201 and json dataName send through cleanUp
                //where data name (ex. student or post or data) is the object being returned
            res.status(201).json(post.cleanUp())
        })
    
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
    const updateAllowed = ['title', 'content', 'author'];

    //for each canUpdate with arg dataArg =>
    updateAllowed.forEach(data => {

        //if dataArg is in request body
        if(data in req.body) {

            //assign the request body[dataArg] to toUpdate[dataArg] object
            toUpdate[data] = req.body[data];

        }
    
    });
        //modelName call findByAndUpdate with args request params id and object with $set/val pair where val is toUpdate
        blogModel.findByIdAndUpdate(req.params.id, {$set: toUpdate})
        
        //then dataName => respond with status 204, json message naming request body id has been updated, and end with no args
        //where data name (ex. student or post or data) is the object being returned
        
        .then(data => 
           res.status(204).json({"message": `${req.body.id} has been updated`}).end()
        )

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

    //modelName findByIdAndRemove with arg request params id
    blogModel.findByIdAndRemove(req.params.id)

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