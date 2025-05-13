const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const apiRoutes = require('./routes/api');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection options:

// OPTION 1: Connexion à MongoDB local (assurez-vous que MongoDB est installé et lancé)
const MONGODB_URI = 'mongodb://127.0.0.1:27017/bank-hapoalim-student-db';

// OPTION 2: Connexion à MongoDB Atlas (remplacez par vos identifiants)
// const MONGODB_URI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/bank-hapoalim-student-db?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Use API routes
app.use('/api', apiRoutes);

// Serve the form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 