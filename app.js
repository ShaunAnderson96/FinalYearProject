//bringing in all dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');//when submitting a form it will grab the data
const cors = require('cors'); 
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

//connect to database
mongoose.connect(config.database);

//on connection alert me
mongoose.connection.on('connected', () => {
    console.log('Connected to database' + config.database);
});

//on error alert me
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to database' + err);
});

//initialise app variable with express
const app = express();

//gets the users file in the routes folder
const users = require('./routes/users');

//port number into port variable
const port = 3000;

//allows to make request to API from different domain name
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//bodyParser 
app.use(bodyParser.json());

//passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//allows the use of users in the route folder
app.use('/users', users);

//route to homepage
app.get('/', (req, res) => {
    res.send('Invaild Endpoint');
});

// app.get('*', (req, res => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// }));

//********************************************************** */
//********************************************************** */
//                 SPOTIFY OAUTH CODE
//********************************************************** */
//********************************************************** */



// var client_id = 'clientid'; // Your client id
// var client_secret = 'secret'; // Your secret
// var redirect_uri = 'http://localhost:4200/callback'; // Your redirect uri

// // /**
// //  * Generates a random string containing numbers and letters
// //  * @param  {number} length The length of the string
// //  * @return {string} The generated string
// //  */
// // var generateRandomString = function(length) {
// //   var text = '';
// //   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// //   for (var i = 0; i < length; i++) {
// //     text += possible.charAt(Math.floor(Math.random() * possible.length));
// //   }
// //   return text;
// // };

// // var stateKey = 'spotify_auth_state';

//  var spotApp = express();

// // spotApp.use(express.static(__dirname + '/public'))
// //    .use(cookieParser());

// // spotApp.get('/login', function(req, res) {

// //   var state = generateRandomString(16);
// //   res.cookie(stateKey, state);

// //   // your application requests authorization
// //   var scope = 'user-read-private user-read-email';
// //   res.redirect('https://accounts.spotify.com/authorize?' +
// //     querystring.stringify({
// //       response_type: 'code',
// //       client_id: client_id,
// //       scope: scope,
// //       redirect_uri: redirect_uri,
// //       state: state
// //     }));
// // });

// spotApp.get('/callback', function(req, res) {

//   // your application requests refresh and access tokens
//   // after checking the state parameter

//   var code = req.query.code || null;
//   var state = req.query.state || null;
//   var storedState = req.cookies ? req.cookies[stateKey] : null;

//   if (state === null || state !== storedState) {
//     res.redirect('/#' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       }));
//   } else {
//     res.clearCookie(stateKey);
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {

//         var access_token = body.access_token,
//             refresh_token = body.refresh_token;

//         var options = {
//           url: 'https://api.spotify.com/v1/me',
//           headers: { 'Authorization': 'Bearer ' + access_token },
//           json: true
//         };

//         // use the access token to access the Spotify Web API
//         request.get(options, function(error, response, body) {
//           console.log(body);
//         });

//         // we can also pass the token to the browser to make requests from there
//         res.redirect('/#' +
//           querystring.stringify({
//             access_token: access_token,
//             refresh_token: refresh_token
//           }));
//       } else {
//         res.redirect('/#' +
//           querystring.stringify({
//             error: 'invalid_token'
//           }));
//       }
//     });
//   }
// });

// spotApp.get('/refresh_token', function(req, res) {

//   // requesting access token from refresh token
//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// });

// console.log('Listening on 3000');
// spotApp.listen(3000);
// starts the server
app.listen(port, () => {
    console.log('Server on port '+port);
});
