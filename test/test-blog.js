//use strict
'use strict';

//create const to require chai
const chai = require('chai');

//create const to require chai-http
const chaiHttp = require('chai-http');

//create const to require faker
const faker = require('faker');

//create const to require mongoose
const mongoose = require('mongoose');

//create const expect to assert chai expect
const expect = chai.expect;

//Create const of {model} to require models.js.  {model} = model name defined in models.js
const {blogModel} = require('../models');

//create const of object app, runServer, closeServer to require server.js
const {app, startServer, stopServer} = require('../server');

//Create const of TEST_DATABASE_URL to require config.js

const TEST_DATABASE_URL = 'mongodb://localhost/test-blog-app';

//const TEST_DATABASE_URL = require('../config');

//tell chai to use chaiHttp

chai.use(chaiHttp);


//SEED TEST DATA

//create seed data function with no args

function seedTestData() {

    //log info with message to console that data is seeding
    console.info('seed data being created');
    //create const of empty array for seed data
    const seedData = [];
    //loop through x number of times and push seed data with arg of generate data function with no args
    for(let i=1; i<10; i++) {
        seedData.push(generateData());
        //return modelName and insertMany with arg of seed data
        return blogModel.insertMany(seedData);

    }
    
};
    
    //create generate data function with no args
    function generateData() {
        // return {object}
            //{object} contains fields needed to create DB test data
            // {key1: faker.dataSet.dataType(), key2: generateDataFunction2(), key3: {key3a: faker.dataSet.dataType(), key3b: generateDataFunction3()}, key4: [array of faker or function calls]}
        return {
            title:  faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            author: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        }
    };



//**ADDITIONAL OPTIONAL FUNCTIONS USED TO CREATE DATA FAKER ISN'T ABLE TO PRODUCE - ADD AS NEEDED**

//create generate data function2 with no args

//create const of <DB fieldName> array ['data1','data2','data3']

//return <DB fieldName> as array position of 'x'
	//'x' = Math floor of Math random * <DB fieldName> array length
	//can also return object containing value of above and generated faker data
	// {key5: faker.dataSet.dataType(), key6: <DB fieldName> array const

//**END OPTIONAL AS NEEDED FUNCTIONS



//DB TEAR DOWN and BEFORE/AFTER FUNCTIONS

//create tear down function with no args
function tearDownDB()   {
    //warn to console that DB is being deleted
    console.warn('DB will be deleted');
    //return mongoose connection dropDatabase with no args
    return mongoose.connection.dropDatabase();
};


//describe with args of 'description' and function with no args 
describe('API Test Resource', function()   {


    //BEFORE - RUNS ONCE TO START SERVER
    //before with arg of function with no args
    before(function()   {
        //return runServer with arg of test DB url
        return startServer(TEST_DATABASE_URL);

    });    
    
    //BEFOREEACH - RUNS WITH EACH TEST TO SEED DATA
    //beforeEach with arg of function with no args
    beforeEach(function()   {
        //return seed data function with no args
        return seedTestData();
    });    
    
    //AFTEREACH - RUNS AT THE END OF EACH TEST TO CLEAR THE DB
    //afterEach with arg of function with no args
    afterEach(function()    {
        //return tear down function with no args
        return tearDownDB();
    });
    
    //AFTER - RUNS ONCE TO STOP SERVER WHEN TESTING IS COMPLETE
    //after with arg of function with no args
    after(function()    {
        //return closeServer with no args
        return stopServer();
    });
    
    
    //**TESTS**
    
    
    
    //GET TESTS

//describe with args of 'description of test block' and function with no args
describe('GET test block', function()   {

    
    
    //Test 1
    // strategy:
    //    1. get back all objects returned by by GET request to `/endpoint`
    //    2. prove res has right status, data type
    //    3. prove the number of objects we got back is equal to number
    //       in db.
    
    
    //it with args 'description of test' and function with no args
   it('get DB objects validate response and count', function()  {

       //create 1stEmpty variable to save future response value
       let res;

       //return chai request with arg app
       return chai.request(app)

       //.get with arg of '/endpoint'
       .get('/blogs')

       //then with arg of function with arg of _res
       .then(function(_res){

        //set 1stEmpty variable to _res
            res = _res;

           //expect arg res to have a status 200
            expect(res).to.have.status(200);    
          
           //expect arg response body collectionName to have a lengthof at least 1
           expect(res.body.blogposts).to.have.lengthOf.at.least(1);
           
           //return modelName count with no args
           return blogModel.count();
        })
           
        //then with arg of function with arg of count
        .then(function(count)    {
            //expect arg response body collectionName to have length of arg count
            expect(res.body.blogposts).to.have.lengthOf(count);

        });
         
    });
        
       //Test 2
        // Strategy: 
        // Get back all objects, and ensure they have expected keys

//it with args 'description of test' and function with no args
    it('get all objects and ensure expected keys', function()   {

        //create 2ndEmpty variable (do not reuse 1st) to save future response value
        let respBlog;
        
        //return chai request with arg app
        return chai.request(app)

        //.get with arg of '/endpoint'
        .get('/blogs')

        //then with arg of function with arg of res
        .then(function(res)    {
            
            //expect arg response to have status 200
            expect(res).to.have.status(200);
            //expect arg response to be json
            expect(res).to.be.json;
            //expect arg response body collectionName to have lengthof at least 1
            expect(res.body.blogposts).to.have.lengthOf.at.least(1);

            //response body collectionName for each with arg function arg dataName
            res.body.blogposts.forEach(function(post)  {
                //expect arg dataName to be a arg 'object'
                expect(post).to.be.a('object');
                //expect arg dataName to include keys args 'key1', 'key2', etc
                expect(post).to.include.keys('title', 'content', 'author');
            })

                //set 2ndEmpty to response body collectionName position 0
                respBlog = res.body.blogposts[0];

                //return modelName findById arg id of 2ndEmpty
                return blogModel.findById(respBlog.id)
            })

                //then arg function with arg dataName
                .then(function(post)    {
                    
                    //expect 2ndEmpty id to equal dataName id
                    expect(respBlog.id).to.be.equal(post.id);
                    //expect 2ndEmpty key1 to equal dataName key1
                    expect(respBlog.title).to.be.equal(post.title);

                    //expect 2ndEmpty key2 to equal dataName key2
                    expect(respBlog.content).to.be.equal(post.content);

                    //expect 2ndEmpty key3 to contain dataName key3.key3a or key3.key3b
                    expect(respBlog.author).to.contain(post.author.firstName);
                    expect(respBlog.author).to.contain(post.author.lastName);


                })
    })
        
});
    
//POST TESTS
        // strategy: 
        // make a POST request with data,
        // then prove that the object we get back has
        // right keys, and that `id` is there (which means
        // the data was inserted into db)

//describe with args of 'description of test block' and function with no args
describe('POST test', function()    {
    
    //it with args 'description of test' and function with no args
    it('post request w/ data then prove object return has correct keys', function() {
        //create const 1stConst that equals generate data function with no args
        const genData = generateData();
        //create 1stOptional variable that is empty --Create only if needed to perform validation of specific items
        //return chai request with arg app
        return chai.request(app)

        //.post with arg of '/endpoint'
        .post('/blogs')

        //.send with arg of new 1stConst
        .send(genData)
        
        //then with arg of function with arg of res
        .then(function(res) {
            
            //expect arg response to have status 201
            expect(res).to.have.status(201);
            //expect arg response to be json
            expect(res).to.be.json;
            //expect arg response body to be a arg 'object'
            expect(res.body).to.be.a('object');
            //expect arg response body to include specific keys args 'key1', 'key2', etc
            expect(res.body).to.include.keys('title', 'content', 'author');
            //expect arg response body key1 to equal 1stConst key1
            expect(res.body.title).to.equal(genData.title);
            
            //expect response body id to not be null
            expect(res.body.id).to.not.be.null;
            //expect response body key2 to be equal to 1stConst key2
            expect(res.body.content).to.equal(genData.content);
            //expect response body key3 to be equal to 1stConst key3
            expect(res.body.author).to.contain(genData.author.firstName);
            expect(res.body.author).to.contain(genData.author.lastName);
            
            //**FOR USE WITH OPTIONAL VARIABLE
            //set 1stOptional equal to 1stConst key4 to sort with arg (a, b) => b.valB - a.valA)[0].someDataName;
            
            //expect response body someDataName to equal 1stOptional
            
            //**END OPTIONAL VARIABLE BLOCK
            
            //return modelName findById response body id
            return blogModel.findById(res.body.id);            
        })
        
        //then arg function with arg dataName
        .then(function(post)    {
            
            //expect dataName key1 to equal 1stConst key1
            expect(post.title).to.equal(genData.title);
            //expect dataName key2 to equal 1stConst key2
            
            expect(post.content).to.equal(genData.content);
            
            //expect dataName key3.key3a to equal 1stConst key3.key3a
            expect(post.author.firstName).to.equal(genData.author.firstName);
            
            //expect dataName key3.key3b to equal 1stConst key3.key3b
            expect(post.author.lastName).to.equal(genData.author.lastName);
        })
            
    })
            
            
});
            
            //PUT TESTS
            // strategy:
        //  1. Get an existing object from db
        //  2. Make a PUT request to update that object
        //  3. Prove object returned by request contains data we sent
        //  4. Prove object in db is correctly updated

//describe with args of 'description of test block' and function with no args
describe('PUT test', function() {
    //it with args 'description of test' and function with no args
    it('get existing object from DB and modify', function() {
        //create const 2ndConst {object}
            //object is test data {key1: newKey1Val, key2: newKey2Val}
        const newData = {
            title: 'Wubba dubba lub dub',
            author: {
                    firstName: 'Rick',
                    lastName: 'Sanchez'
            }
        }
        
        //return modelName and findOne with no args
        return blogModel.findOne()
        
        //then with arg of function with arg dataName 
        .then(function(post)    {
            //2ndConst id equal dataName id
            newData.id = post.id;
            //return chai request with arg app
            return chai.request(app)
            //.put with arg of '/endpoint/${dataName id}'
        .put(`/blogs/${post.id}`)
            //.send with arg of new 2ndConst
        .send(newData)
          /*
            .then(function(res) {
                expect(res).to.have.status(204);
            })
            */
        })
        
    
        //then with arg of function with arg of res
        .then(function(res) {
            
            //expect arg response to have status 204
            expect(res).to.have.status(204);
            
            //return modelName findByID with arg 2ndConst id
            return blogModel.findById(newData.id);
        })
        
        //then with arg function arg dataName
        .then(function(post)    {
            
            //expect dataName key1 to equal 2ndConst key1
            expect(post.title).to.equal(newData.title);
            //expect dataName key2 to equal 2ndConst key2
            expect(post.author.firstName).to.equal(newData.author.firstName);
            expect(post.author.lastName).to.equal(newData.author.lastName);

        })
        
    })
});



//DELETE TESTS

        // strategy:
        //  1. get a DB object
        //  2. make a DELETE request for that object id
        //  3. assert that response has right status code
        //  4. prove that object with the id doesn't exist in db anymore


//describe with args of 'description of test block' and function with no args
describe('DELETE test', function()  {

    //it with args 'description of test' and function with no args
    it('get DB object and delete it', function()    {

        //create empty variable 1stVar
        let delVar; 

        //return modelName and findOne with no args
        return blogModel.findOne()
        
        //then arg function with arg _1stVar
        .then(function(_delVar) {

            //set 1stVar equal to _1stVar
            delVar = _delVar;
            //return chai request with arg app chain delete with arg /endpoint/${1stVar id}
            return chai.request(app).delete(`/blogs/${delVar.id}`)
            //then arg function arg response
            .then(function(res) {

                //expect arg response to have status 204
                expect(res).to.have.status(204);                
                //return modelName findById arg 1stVar id
                return blogModel.findById(delVar.id)
                //then arg function arg _1stVar
                .then(function(_delVar) {
                    //expect _1stVar to be null
                    expect(_delVar).to.be.null;
                })
            })
        })
    })    
})

});