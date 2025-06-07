// index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const firebaseDbUrl = process.env.FIREBASE_DB_URL;
const firebaseDbSecret = process.env.FIREBASE_DB_SECRET;
const jwtSecret = process.env.JWT_SECRET;

app.use(bodyParser.json());

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).send({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'No token provided' });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(403).send({ error: 'Invalid token' });
    req.user = decoded; // { userId: 'someUserId', ... }
    next();
  });
};

// Login endpoint (for demo - customize with real auth)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // TODO: Replace with your real authentication logic
  if (username === 'testuser' && password === 'testpassword') {
    // Simulated user ID - in real use your DB user ID
    const userId = 'testuser123';

    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
    res.send({ token, userId });
  } else {
    res.status(401).send({ error: 'Invalid username or password' });
  }
});

// Save User Data (Protected)
app.post('/FirebaseProxy/saveUserData', authenticate, async (req, res) => {
  try {
    const userData = req.body;

    if (!userData.UserId) {
      return res.status(400).send({ error: 'Missing UserId' });
    }

    // Validate UserId matches JWT userId
    if (userData.UserId !== req.user.userId) {
      return res.status(403).send({ error: 'User ID mismatch' });
    }

    const url = `${firebaseDbUrl}users/${userData.UserId}.json?auth=${firebaseDbSecret}`;
    const response = await axios.put(url, userData);

    res.send({ success: true, data: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to save user data' });
  }
});

// Get User Data (Protected)
app.get('/FirebaseProxy/getUserData/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId param matches JWT userId
    if (userId !== req.user.userId) {
      return res.status(403).send({ error: 'User ID mismatch' });
    }

    const url = `${firebaseDbUrl}users/${userId}.json?auth=${firebaseDbSecret}`;
    const response = await axios.get(url);

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to get user data' });
  }
});

app.listen(port, () => {
  console.log(`FirebaseProxy backend running on port ${port}`);
});
