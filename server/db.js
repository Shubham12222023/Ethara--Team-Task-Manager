const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Use PostgreSQL in production (Railway)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
  });
} else {
  // Use SQLite for local development
  if (process.env.NODE_ENV === 'production') {
    // If we are in production but forgot DATABASE_URL, don't use sqlite (causes crash).
    sequelize = new Sequelize('postgres://fake:fake@fake:5432/fake', { logging: false });
    console.error('\nCRITICAL: DATABASE_URL is missing in Railway Variables!\n');
  } else {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, 'database.sqlite'),
      logging: false
    });
  }
}

module.exports = sequelize;
