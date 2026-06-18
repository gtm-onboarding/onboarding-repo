const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const accountsRouter = require('./routes/accounts');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/accounts', accountsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'accounts-service', timestamp: new Date().toISOString() });
});

// Database connection and server start
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Accounts service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = app;
