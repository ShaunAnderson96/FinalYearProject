//bringing in all dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');//when submitting a form it will grab the data
const cors = require('cors'); 
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

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
app.use(express.static(path.join(__dirname, 'front-end')));

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
//     res.sendFile(path.join(__dirname, 'front-end/index.html'));
// }));


// starts the server
app.listen(port, () => {
    console.log('Server on port '+port);
});