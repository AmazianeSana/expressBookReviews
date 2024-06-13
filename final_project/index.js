const express = require('express');
const jwt = require('jsonwebtoken');


const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const SECRET_KEY = 'jwtSecret'; 

app.use(express.json());

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token is missing');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.user = decoded
    next();
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
