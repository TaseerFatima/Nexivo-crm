const mongoose = require('mongoose');
const dns = require('dns');
const User = require('./models/User');
require('dotenv').config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedAdmin = async () => {
  try {
    // Ensure we use your live Atlas URI from the .env file
    const dbUri = process.env.MONGO_URI;
    
    if (!dbUri) {
      console.error('Error: MONGO_URI is missing from your server/.env file.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(dbUri, { family: 4 });
    
    // Check if an admin already exists so we don't duplicate it
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log(`\nAdmin already exists in your Atlas DB! Use: ${adminExists.email} to login.`);
      process.exit();
    }

    // Create the super admin account
    await User.create({
      name: 'Super Admin',
      email: 'admin@nexivo.com',
      password: 'adminpassword123', 
      role: 'admin',
      isActive: true
    });

    console.log('==================================================');
    console.log(' SUCCESS: MASTER ADMIN ACCOUNT INJECTED TO ATLAS!');
    console.log(' Email: admin@nexivo.com');
    console.log(' Password: adminpassword123');
    console.log('==================================================');
    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();