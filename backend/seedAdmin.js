import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully.');
 // Replace 'zonal' with your desired password

        // Create a new user
        const newUser = new User({
            userName: 'zonal',
            password: 'zonal',
            role: 'ZEO',
            passwordChanged: false,
            districtId: '67eff559e0e221b836393c04',  // Replace with your actual District ID
            zoneId: '67eff559e0e221b836393c06'      // Replace with your actual Zone ID
        });

        await newUser.save();  
        console.log('User created successfully.');

        process.exit();
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
};

createUser();
