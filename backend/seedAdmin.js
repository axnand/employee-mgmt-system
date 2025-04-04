import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Role from './models/Role.js';
import District from './models/District.js';
import Zone from './models/Zone.js';
import Office from './models/Office.js';
import School from './models/School.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully.');

        // Clear existing data
        await Role.deleteMany({});
        await User.deleteMany({});
        await District.deleteMany({});
        await Zone.deleteMany({});
        await Office.deleteMany({});
        await School.deleteMany({});

        await Role.insertMany([
          { roleName: 'CEO' },
          { roleName: 'ZEO' },
          { roleName: 'schoolAdmin' },
          { roleName: 'staff' }
        ]);

        console.log('Roles created successfully.');

        // Create Dummy Districts and Zones
        const districts = [];
        const zones = [];
        const offices = [];

        for (let i = 1; i <= 3; i++) {
            const district = new District({
                name: `District ${i}`
            });
            await district.save();
            districts.push(district);

            for (let j = 1; j <= 3; j++) {
                const zone = new Zone({
                    name: `Zone ${j} of District ${i}`,
                    district: district._id,
                    offices: []
                });
                await zone.save();
                zones.push(zone);

                if (!district.zones) district.zones = [];
                district.zones.push(zone._id);
            }

            await district.save();
        }

        console.log('Districts and Zones created successfully.');

        // ✅ Create a User with the CEO role and associate it with the FIRST district created
        const admin = new User({
            userName: 'anand',
            password: 'anand', // 🔑 Store the plain text password; the hashing will be done by Mongoose pre-save middleware
            role: 'CEO',
            passwordChanged: false,
            districtId: districts[0]._id  // Correctly assigning the existing district ID
        });

        await admin.save();  // Save the user after setting the districtId
        console.log('Admin user created successfully.');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
