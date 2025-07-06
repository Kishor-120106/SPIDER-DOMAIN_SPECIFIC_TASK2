const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes');
const friendRoutes = require('./routes/friends');
const groupRoutes= require('./routes/group');

const cors = require('cors');

require('./auth/auth');

const app = express();
app.use(cors());

mongoose.connect("mongodb+srv://mkishorkumar2006cbse:kichaa12345@spider.niwwkju.mongodb.net/login-auth", {
  
});
const database = mongoose.connection;
database.on('error',(err)=>console.log(err));
database.on('connected',()=>console.log("database connected"));
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB error:', err);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.json());


// Public routes
app.use('/', routes);

// Protected routes
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoutes);
app.use('/friends', passport.authenticate('jwt', { session: false }), friendRoutes);

app.use('/groups', passport.authenticate('jwt',{session:false}),groupRoutes);

// Catch all unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(5500, () => {
  console.log('🚀 Server started on http://localhost:5500');
});
