const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

async function runMigrations() {
  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  const seedPath = path.join(__dirname, 'database', 'seed.sql');

  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Running Schema...');
    await db.query(schemaSql);
    console.log('Schema created successfully.');

    console.log('Running Seed...');
    await db.query(seedSql);
    console.log('Seed executed successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
