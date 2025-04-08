import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import District from './models/District.js';
import Office from './models/Office.js';
import Zone from './models/Zone.js'; // Ensure you import all relevant models

dotenv.config();

const clearDatabase = async () => {
    try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
        console.log("✅ All collections cleared successfully.");
    } catch (error) {
        console.error("❌ Error clearing collections:", error.message);
    }
};

const createCEOUser = async () => {
    try {
        // Step 1: Create a District
        const newDistrict = await District.create({
            name: 'Sample District'
        });

        console.log('✅ District created successfully:', newDistrict);

        // Step 2: Create a CEO Office in that District
        const ceoOffice = await Office.create({
            officeId: 'CEO001',
            officeName: 'CEO Office',
            officeType: 'Administrative',
            isDdo: true,
            address: 'District HQ, Sample District',
            contact: '1234567890'
        });

        console.log('✅ CEO Office created successfully:', ceoOffice);

        // Step 3: Create a CEO User // Encrypt the password for security
        const ceoUser = new User({
            userName: 'ceoUser',
            password: 'ceoUser',
            role: 'CEO',
            passwordChanged: false,
            districtId: newDistrict._id,
            office: ceoOffice._id
        });
        await ceoUser.save();
        console.log('✅ CEO User created successfully:', ceoUser);

        // Step 4: Link the Office to the District
        newDistrict.officeId = ceoOffice._id;
        await newDistrict.save();
        console.log('✅ District updated with CEO Office successfully.');
        
        console.log('🎉 Database reset and seed completed successfully.');
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
    }
};

const resetDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Database connected successfully.');

        // Clear the database before seeding
        await clearDatabase();

        // Seed new data
        await createCEOUser();
        
        process.exit();
    } catch (error) {
        console.error('❌ Error connecting to the database:', error.message);
        process.exit(1);
    }
};

resetDatabase();
