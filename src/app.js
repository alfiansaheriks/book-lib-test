const express = require('express');
// const cors = require('cors');
const routes = require('./routes/index.routes');
const connectDB = require('./config/db');
require('./config/env');

const app = express();
// app.use(cors());
app.use(express.json());

connectDB();
app.use('/api', routes);

module.exports = app;