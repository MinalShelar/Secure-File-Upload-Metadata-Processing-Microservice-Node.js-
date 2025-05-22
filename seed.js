require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

async function seed() {
  await sequelize.sync();

  const hashedPassword = await bcrypt.hash('Password123', 10);

  await User.create({
    "email": 'testuser@example.com',
    "password": hashedPassword,
  });

  console.log('User seeded');
  process.exit(0);
}

seed();
