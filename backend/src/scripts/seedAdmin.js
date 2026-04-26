import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import env from '../config/env.js';
import connectDB from '../config/db.js';

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
    
    // Create admin user
    const admin = new Admin({
      name: 'Super Admin',
      email: env.ADMIN_EMAIL,
      password: hashedPassword,
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: ' + env.ADMIN_EMAIL);
    console.log('Password: ' + env.ADMIN_PASSWORD);
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
