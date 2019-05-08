const express = require( "express" )
let app = express()
const fs = require( "fs" )
const path = require( "path" )
const ejs = require( "ejs" )
app.use( "/public", express.static( __dirname + "/public" ) )
app.set( "view engine", "ejs" )
app.set( 'views', './views' )
const port = process.env.PORT || 3000


// the product list page
app.get( "/", async ( req, res ) => {
   const feed = await productsDB.find( {} )
   res.render( "index", { feed } )
} )

// fetching product data dynamically
app.get( "/product/:id", async ( req, res ) => {
   const id = req.params.id
   const feed = await productsDB.find( { _id: id } )
   res.render( "product", { feed: feed[ 0 ] } )
} )

//handling adding items to shopping cart
app.get( "/add/:id", async ( req, res ) => {
   const id = req.params.id // no id at use for the moment ... to simplify the test
   users.findOneAndUpdate( {  }, { $push: { cart: id } } ).then( update => res.json( { "result": update } ) )
} )

// shopping cart page
app.get( "/checkout", ( req, res ) => {
   getCartItems().then( result => {
      res.render( "checkout", result )
   } )
} )

//getting live quantity of total items inside the cart
app.get( "/basket", ( req, res ) => {
   getCartItems().then( result => res.json( result.totalCount ) )
} )

//helper function for fetching data from database
async function getCartItems() {
   let feed = {}

   await users.find( {} ).then( result => {
      const list = result[ 0 ].cart
      list.forEach( item => {
         feed[ item ] = ++feed[ item ] || 1
      } )
   } )

   let arr = []

   for ( const item in feed ) {
      const result = await productsDB.find( { _id: item } )
      const quantity = feed[ item ]
      const total = Object.assign( {}, result[ 0 ], { quantity } )
      arr.push( total )
   }

   const totalCount = Object.values( feed ).length > 0 ?
      Object.values( feed ).reduce( ( a, b ) => a + b ) : 0

   return {
      arr,
      totalCount
   }
}



//handling wrong requests at the end
app.use( function( req, res ) {
   res.status( 404 );
   res.send( "<h1 style='width:50%; margin: 20px 20px;'>No page found for your request! </h1>" )
} )

app.listen( port, console.log( `app is listening on ${port}` ) )




// database access
const db = require( 'monk' )( 'localhost:27017/omedia' )
const productsDB = db.get( "products" )
const users = db.get( "users" )







/*
const data = [{ 
   name: "Understanding ECMAScript 6: The Definitive Guide for JavaScript Developers",
   writer: "Nicholas C. Zakas",
   desc: "ECMAScript 6 represents the biggest update to the core of JavaScript in the history of the language. In Understanding ECMAScript 6, expert developer Nicholas C. Zakas provides a complete guide to the object types, syntax, and other exciting changes that ECMAScript 6 brings to JavaScript. Every chapter is packed with example code that works in any JavaScript environment so you’ll be able to see new features in action." ,
   price: 20 ,
   "img": "es6"

},
    {
      "name" : "JavaScript: The Good Parts: The Good Parts",
    "writer" : "Douglas Crockford",
    "desc" : "Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined. This authoritative book scrapes away these bad features to reveal a subset of JavaScript that's more reliable, readable, and maintainable than the language as a whole—a subset you can use to create truly extensible and efficient code.<br/>Considered the JavaScript expert by many people in the development community, author Douglas Crockford identifies the abundance of good ideas that make JavaScript an outstanding object-oriented programming language-ideas such as functions, loose typing, dynamic objects, and an expressive object literal notation. Unfortunately, these good ideas are mixed in with bad and downright awful ideas, like a programming model based on global variables.",
    "price" : 11,
    "img": "goodparts"
},
{
    "name" : "Simplifying JavaScript: Writing Modern JavaScript with ES5, ES6, and Beyond",
    "writer" : "Joe Morgan",
    "desc" : "The best modern JavaScript is simple, readable, and predictable. Learn to write modern JavaScript not by memorizing a list of new syntax, but with practical examples of how syntax changes can make code more expressive. Starting from variable declarations that communicate intention clearly, see how modern principles can improve all parts of code. Incorporate ideas with curried functions, array methods, classes, and more to create code that does more with less while yielding fewer bugs.<br/>It's time to write JavaScript code that's clean and expressive. Modern JavaScript is simpler and more predictable and readable than ever. Discover how to write better code with clear examples using principles that show how updated syntax can make code better with fewer bugs.",
    "price" : 33,
    "img": "simple"
}
]


data.forEach(item=> productsDB.insert(item) )



const person = { 
   name: "Davit",
   cart: []
}

users.insert(person) 


*/