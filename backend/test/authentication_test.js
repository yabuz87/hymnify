// a testing peridicates for authentication functionalities.
// These tests cover user signup, login, token generation, and token validation.
// this json file is used to test in postman or other api testing tools.
const signupTestData = {
  "churchName": "Emanuel Church",
  "choirName": "Heavenly Voices",
  "location": {
    "region": "Addis Ababa",
    "city": "Addis Ketema",
    "kebele": "12"
  },
  "email": "heavenlyvoices@gmail.com",
  "password": "strongPass123",
  "accessingPassword": "access123",
  "profileImage": "https://res.cloudinary.com/example/image/upload/v1234/profile.jpg"
}

const loginTestData = {

      adminlogin:{
"email":"heavenlyvoices@gmail.com",
"password":"strongPass123"},

clientLogin:{
  "churchName": "Emanuel Church",
  "choirName": "Heavenly Voices",
  "location": {
    "region": "Addis Ababa",
    "city": "Addis Ketema",
    "kebele": "12"
  },
  "accessingPassword": "access123"
}
}