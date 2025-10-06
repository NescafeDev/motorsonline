const jwt = require('jsonwebtoken');

// Test token verification with both secrets
const JWT_SECRET_1 = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_SECRET_2 = process.env.JWT_SECRET || 'your-secret-key';

console.log('JWT_SECRET_1 (used by other routes):', JWT_SECRET_1);
console.log('JWT_SECRET_2 (was used by contact routes):', JWT_SECRET_2);

// Test with a sample token (you can replace this with an actual token from your app)
const testToken = 'your-test-token-here';

if (testToken !== 'your-test-token-here') {
  try {
    const decoded1 = jwt.verify(testToken, JWT_SECRET_1);
    console.log('Token valid with JWT_SECRET_1:', decoded1);
  } catch (err) {
    console.log('Token invalid with JWT_SECRET_1:', err.message);
  }

  try {
    const decoded2 = jwt.verify(testToken, JWT_SECRET_2);
    console.log('Token valid with JWT_SECRET_2:', decoded2);
  } catch (err) {
    console.log('Token invalid with JWT_SECRET_2:', err.message);
  }
} else {
  console.log('Please replace testToken with an actual token from your app to test');
}
