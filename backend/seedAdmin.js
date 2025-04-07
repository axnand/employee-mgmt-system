import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import District from './models/District.js';
import Office from './models/Office.js';

dotenv.config();

const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

const createCEOUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully.');

        // Clear the database before seeding
        await clearDatabase();
        console.log('Database cleared successfully.');

        // Step 1: Create a District
        const newDistrict = await District.create({
            name: 'Sample District'
        });

        console.log('District created successfully:', newDistrict);

        // Step 2: Create a CEO Office in that District
        const ceoOffice = await Office.create({
            officeId: 'CEO001',
            officeName: 'CEO Office',
            officeType: 'Administrative',
            isDdo: true,
            address: 'District HQ, Sample District',
            contact: '1234567890'
        });

        console.log('CEO Office created successfully:', ceoOffice);

        const ceoUser = new User({
            userName: 'ceoUser',
            password: 'ceoUser',
            role: 'CEO',
            passwordChanged: false,
            districtId: newDistrict._id,
            office: ceoOffice._id
        });
        await ceoUser.save();
        console.log('CEO User created successfully:', ceoUser);

        newDistrict.officeId = ceoOffice._id;
        await newDistrict.save();

        console.log('District updated with CEO Office successfully.');

        process.exit();
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
};

createCEOUser();
