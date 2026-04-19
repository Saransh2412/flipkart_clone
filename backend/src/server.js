require('dotenv').config();

// Ensure DATABASE_URL uses the modern sslmode to avoid warnings
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('sslmode=require', 'sslmode=verify-full');
}
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  console.log('Database initialization check complete.');
}).catch(err => {
  console.error('Database pre-check failed (likely quota exceeded), but starting server anyway...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


 