const http = require('http');
const url = require('url');
const query = require('querystring');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const getJSON = require('get-json');

const main = require('./main.js');
const index = fs.readFileSync(`${__dirname}/../client/homepage.html`);
const research = fs.readFileSync(`${__dirname}/../client/research.html`);
const settings = fs.readFileSync(`${__dirname}/../client/settings.html`);
const login = fs.readFileSync(`${__dirname}/../client/login.html`);
const js = fs.readFileSync(`${__dirname}/../client/client.js`);
const css = fs.readFileSync(`${__dirname}/../client/styles.css`);
const facultyLogo = fs.readFileSync(`${__dirname}/../client/facultylogo.png`);
const userLogo = fs.readFileSync(`${__dirname}/../client/userlogo.png`);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
});

app.get('/homepage.html', (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
});

app.get('/research.html', (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(research);
  response.end();
});

app.get('/settings.html', (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(settings);
  response.end();
});

app.get('/login.html', (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(login);
  response.end();
});

app.get('/client.js', (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(js);
  response.end();
});

app.get('/styles.css', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
});

app.get('/facultylogo.png', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(facultyLogo);
  response.end();
});

app.get('/userlogo.png', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(userLogo);
  response.end();
});

// app.post('/login', (request, response) => {
//   const req = request;
//   const res = response;
//   console.log(req.body);
  
//   const postData = query.stringify({
//     username: `${req.body.username}`,
//     password: `${req.body.pass}`
//   });

//   console.log(postData);

//   const postOptions = {
//     host: 'backend',
//     port: '80',
//     path: '/login',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(postData)
//     }
//   };

//   /**
//    * For get, append 
//    */

//   request.on('error', (err) => {
//     console.dir(err);
//     res.statusCode = 400;
//     res.end();
//   });

//   response.on('data', (chunk) => {
//     console.log('Response: ', chunk);
//   });

//   request.write(postData);
//   request.end();
// });

app.get('/getAllStudents', (request, response) => {
  const url = 'http://serenity.ist.rit.edu/~ra7918/330/research_database/api/user/getAllStudents.php';

  return response.json({
    results: [{"name":"Rix A.", "userId":"1","username":"rix","role":"student","searching":"1","interests":"[\"Math\",\"Science\",\"General\"]","rating":"4","bio":"This is my bio!","gradDate":"05\/24\/2020"},{"name": "Ben T.","userId":"2","username":"ben","role":"student","searching":"0","interests":"[\"Math\"]","rating":"5","bio":"Not my bio","gradDate":"05\/24\/2019"}]
  });
});

app.get('/getStudentInfo', (request, response) => {
  let url = 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/user/getStudent.php?';
  let options = '';
  options += 'studentId=' + 2;

  url += options;
  console.log(url);

  getJSON(url, (error, res) => {
    if (!error) {
      console.log(res);
      return response.json(res);
    } else {
      console.log(error);
      return error;
    }
  });
});

app.get('/getAllResearch', (request, response) => {
  let url = 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/research/getAll.php';

  const apiReq = http.get(url, (res) => {
    res.on('err', (err) => {
      console.log(err);
    });

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
        return response.json(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  });
});

app.get('/loadUser', (request, response) => {
  const url = 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/user/get.php?userId=1';

  getJSON(url, (error, res) => {
    if (!error) {
      console.log(res);
      return response.json(res);
    } else {
      console.log(error);
      return error;
    }
  });
});

app.post('/updateStudent', (request, response) => {
  const url = 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/user/updateStudent.php';
  const postData = query.stringify({
    studentId: request.body.studentId,
    searching: request.body.searching,
    interests: request.body['interests[]'],
    bio: request.body.bio
  });

  console.log(postData);
  
  const options = {
    hostname: 'http://ist-serenity.main.ad.rit.edu/~iste330t23/research_database/api/user',
    port: 80,
    path: '/updateStudent.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
});

app.listen(port, (err) => {
  if(err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});