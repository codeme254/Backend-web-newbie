// 'use strict';
const fs = require('fs');
const http = require('http');
const { json } = require('stream/consumers');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// 4.USING MODULES 1 CORE MODULES

// node is built around the concept of modules where all kinds of all addition functionalities are stored in modules, we require these modules in our code and store the result in a variable

///////////////////////////////////////////////
//FILES
// 5.READING AND WRITING FILES
//we use the fs module already imported above
// reading from files
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// //writing into new files
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written');

// 6.BLOCKING AND NON BLOCKING ASYNCHRONOUS NATURE OF NODE.JS
//all code above is in synchronous way which means each statement is processed one after another line by line
//each line waits for the result of the previous line.
//this can become troublesome eg when one line takes too long, synchronous code is also called blocking code
//the solution is to use asynchronous non blocking code where heavy tasks will be executed in the background

// nodejs is single threaded, a thread is a place where our code is executed in the machine processor.
//all users accessing our application are only using one thread. which means that if one user starts doing a heavy task, then all the other users will have to wait for him to finish

// 7.READING AND WRITING FILES ASYNCHRONOUSLY
fs.readFile('./txt/start.txt', 'utf-8', (error, data1) => {
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, 'utf-8', (error, data3) => {
      console.log(data3);
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
        console.log('Your file has been written😀😀');
      });
    });
  });
});
console.log('will read the file'); //will be printed before the data, readFile is not blocking and so while the file is being read, node will continue executing the file

///////////////////////////////////////////////
//FILES
// 8.CREATING A SIMPLE WEB SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const dataObj = JSON.parse(data); //converting the incoming data into an objects array

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // query will look like {id:'0'}
  // pathname will look like '/products'
  // const pathName = req.url;

  // simple routing
  // overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }

  // products page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // api
  else if (pathname === '/api') {
    // telling the browser that we are sending json
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  // not found
  else {
    res.writeHead(404, {
      //a header is a piece of information about the response that we are sending back
      'Content-type': 'text/html',
      //we can also specify our own made up headers
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found.</h1>');
  }
});
// listen(PORT, HOST)
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000...');
});

//BUILDING A VERY SIMPLE API
//AN API IS A SERVICE FROM WHICH WE CAN REQUEST SOME DATA

// TYPES OF PACKAGES AND INSTALLS IN NODEJS

// the two types of packages we can install in nodejs are simple dependencies and development dependencies

// simple or regular dependencies are code upon which we build our application, development dependencies are just tools for development eg webpack code bundler, debugger tools etc, we don't need them in production, we only need them in development

// there are two types of installs of these packages.
//global install will install dependency globally, this way, it will be used in all the projects
//local installs will install dependencies locally to the current project

// PACKAGE VERSIONING AND UPDATING
//"^1.18.11"===>SEMANTIC VERSION NOTATION
//1. IS THE MAJOR VERSION
//18 IS THE MINOR VERSION
//11 IS THE PATCH VERSION

// the patch version is only intended to fix bugs.
//the minor version introduces some new features but does not include breaking changes.
//the major version is a new major release that might have breaking changes

// UPDATING PACKAGES
// The prefixed symbols on package names specifies the package update we should accept, eg ^

// ^ specifies we should accept patch and minor releases
//to check outdated packages run:

// npm outdated

// npm install slugify@1.0.0   will install version 1.0.0 of slugify

// ~ will only accept patch releases
// * means all of the versions even the ones with breaking changes
//we can also delete packages
// npm uninstall packageName
//npm ininstall express

// we should never share the node_modules folder,
// package-lock.json shows all the versions of the packages we are using and the dependencies of our dependencies.

// read files
//write files
//require modules
//routing
//templating
//created our own server
//using the node package manager
