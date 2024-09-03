const express = require('express');
const routes = express.Router();
const adminControllers = require('../controllers/adminControllers');


routes.post('/register',adminControllers.postRegister);
routes.post('/login', adminControllers.postLogin);

module.exports = routes;