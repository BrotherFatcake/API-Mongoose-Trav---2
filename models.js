//Use strict
"use strict";

//Create a constant to import(require) mongoose
const mongoose = require('mongoose');

//Create const for the SCHEMA
    //schemaName equals mongoose Schema ({schemaObject})
const blogSchem = mongoose.Schema({

    //Within schemaObject specify fieldName: {type: <type>, required: true/false/'do not include'}
        //Example: fieldName: {type: String, required: true}, fieldName2: {type: String}, fieldName3: {type: Array}, include nested fields
    title: {type: String, require: true},
    content: {type: String, required: true},
    author: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    comments: {type: Array}

});


//Create **VIRTUAL** to return more human readable sub-values
    //Example personName may have sub-values of first and last
    //schemaName virtual with arg 'virtualName' get function with no args
blogSchem.virtual('authorName').get(function() {
    //return template literal placeholders this.personName.first and this.personName.last, trim with no args
    return `${this.author.firstName} ${this.author.lastName}`.trim();
})



//Create cleanUp function to specify what should be returned via the API
//schemaName methods methodName equal function with no args
blogSchem.methods.cleanUp = function() {

    //return {object}
    //Within object {key1: this.val1, key2: this.val2, key3: this.virtualName}
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorName,
        comments: this.comments
    };
};


//Create const modelName is mongoose model with args '<DB collectionName>' and schemaName
const blogModel = mongoose.model('blogposts', blogSchem);

//export module equal {modelName}
module.exports = {blogModel};