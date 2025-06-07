
# FirebaseProxy Backend

## Usage

### POST /FirebaseProxy/saveUserData

Body:
```json
{
    "Username": "exampleUser",
    "AvatarId": "avatar123",
    "UserId": "user123",
    "HwIdHash": "hash123",
    "LastUpdated": 1717700100
}
```

### GET /FirebaseProxy/getUserData/:userId

Example:
```
GET /FirebaseProxy/getUserData/user123
```

## Deployment

Deploy to [https://render.com](https://render.com) or any Node.js hosting.

- Set environment variables:
    - `FIREBASE_DB_URL`
    - `FIREBASE_DB_SECRET`
