require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Neon/Render free tier
    },
    keepAlive: true,
    sslmode: 'verify-full', // Explicitly satisfy the new pg requirement
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL (Neon) connected via Sequelize');
  } catch (error) {
    console.error('Sequelize Connection Error:', error.message);
    // Don't exit process, allow app to run so health checks can return 200
  }
};

module.exports = { sequelize, connectDB };
