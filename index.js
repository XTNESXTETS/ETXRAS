const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const firebaseDbUrl = process.env.FIREBASE_DB_URL;
const firebaseDbSecret = process.env.FIREBASE_DB_SECRET;

app.use(bodyParser.json());

// Save User Data
app.post('/FirebaseProxy/saveUserData', async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.UserId) {
      return res.status(400).send({ error: 'Missing UserId' });
    }

    const url = `${firebaseDbUrl}users/${userData.UserId}.json?auth=${firebaseDbSecret}`;
    const response = await axios.put(url, userData);
    res.send({ success: true, data: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to save user data' });
  }
});

// Get User Data
app.get('/FirebaseProxy/getUserData/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
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
