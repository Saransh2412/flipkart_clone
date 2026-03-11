require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL (Neon) connected via Sequelize');
  } catch (error) {
    console.error('Sequelize Connection Error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
