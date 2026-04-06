require('dotenv').config();
const { sequelize } = require('./src/config/db');

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255) UNIQUE;');
    console.log('Successfully added stripe_session_id column');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
