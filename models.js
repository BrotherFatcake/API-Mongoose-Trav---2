//Use strict
"use strict";

//Create a constant to import(require) mongoose
const mongoose = require('mongoose');

//Create const for "Primary/Identifier" SCHEMA (this could be a collection of users that the secondary schema can reference ONE-to-MANY)
//schemaName equals mongoose Schema ({schemaObject})
const authorSchema = mongoose.Schema({
    
    //Within schemaObject specify fieldName: {type: <type>, required: true/false/'do not include'}
    //Example: fieldName: {type: String, required: true}, fieldName2: {type: String}, fieldName3: {type: Array}, 
    //fieldName4: {type: String, unique: true} include nested fields
    
    firstName: 'string',
    lastName:  'string',
    userName: {type: 'string', unique: true}
});



//Create const for "Other" SCHEMA (this could be used for appending data ("blog comments") associated with the Primary and Secondary schemas)
//schemaName equals mongoose Schema ({schemaObject})
//Within schemaObject specify fieldName: {type: <type>, required: true/false/'do not include'}
//Example: fieldName: {type: String}, fieldName2: {type: String, required: true}, fieldName3: {type: Array}, include nested field

const commentSchema = mongoose.Schema({content: {type: String}});

//Create const for the "Secondary" SCHEMA (This could be a collection of user data that can be referenced against the primary schema ONE-to-MANY)
//schemaName equals mongoose Schema ({schemaObject})
const blogSchem = mongoose.Schema({
    
    //Within schemaObject specify fieldName: {type: <type>, required: true/false/'do not include'}
    //Example: fieldName: {type: String, required: true}, fieldName2: {type: String}, fieldName3: {type: Array}, key: [otherSchemaName] include nested fields
    title: {type: String, require: true},
    content: {type: String, required: true},
    
    //within the object reference data from Primary schema
    //key: {type: mongoose Scheema Types ObjectId, reference: <DB CollectionName>} 
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'authors'},

    //within the object reference data from Other schema
    //key: [otherSchemaName]
    comments: [commentSchema]    
});



//Create Pre-Hook that can ben used by Virtuals when data is being retrieved from a different collection using a findOne()
//SecondarySchemaName pre with args of findOne and function with arg next
blogSchem.pre('findOne', function(next) {
    
    //this populate with arg 'keyName' that needs to be populated
    this.populate('author');

    //next with no args
    next();
});

//Create Pre-Hook that can ben used by Virtuals when data is being retrieved from a different collection using find()
//SecondarySchemaName pre with args of find and function with arg next
blogSchem.pre('find', function(next) {
    
    //this populate with arg 'keyName' that needs to be populated
    this.populate('author');

    //next with no args
    next();
});

//Create **VIRTUAL** to return more human readable sub-values
    //Example personName may have sub-values of first and last
    //schemaName virtual with arg 'virtualName' get function with no args
blogSchem.virtual('authorName').get(function() {
    //return template literal placeholders this.personName.first and this.personName.last, trim with no args
    return `${this.author.firstName} ${this.author.lastName}`.trim();
})

//Create cleanUp function for primary schema/collection to specify what should be returned via the API
//schemaName methods methodName equal function with no args

authorSchema.methods.cleanUp = function() {

    //return {object}
    //Within object {key1: this.val1, key2: this.val2, key3: this.virtualName}
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.userName
    };
    
};

    //Create cleanUp function for secondary schema/collection to specify what should be returned via the API
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



//Create const modelName is mongoose model with args '<DB collectionName>' and Primary schemaName
const authorModel = mongoose.model('authors', authorSchema);

//Create const modelName2 is mongoose model with args '<DB collectionName>' and Secondary schemaName
const blogModel = mongoose.model('blogposts', blogSchem);

//export module equal {modelName} OR {modelName1, modelName2}
module.exports = {authorModel, blogModel};

