import fetch from 'node-fetch';

const testData = {
  username: "testuser",
  email: "test@example.com", 
  password: "password123",
  profile: {
    fullName: "Test User",
    phone: "1234567890",
    bio: "Test bio",
    gender: "male"
  }
};

fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});
