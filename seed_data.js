import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import { Course } from './models/course.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Check if instructor exists
        let instructor = await User.findOne({ email: 'instructor@example.com' });

        if (!instructor) {
            const hashedPassword = await bcrypt.hash('Instructor@123', 10);
            instructor = await User.create({
                name: 'Demo Instructor',
                email: 'instructor@example.com',
                password: hashedPassword,
                role: 'instructor'
            });
            console.log('Instructor created:', instructor.email);
        } else {
            console.log('Instructor already exists');
        }

        // Check if course exists
        const courseCount = await Course.countDocuments();
        if (courseCount === 0) {
            await Course.create({
                title: 'Full Stack Web Development',
                description: 'Master the MERN stack with this comprehensive project-based course. Includes React, Node.js, Express, and MongoDB.',
                category: 'Development',
                price: 4999,
                thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop',
                instructor: instructor._id,
                isPublished: true,
                lectures: []
            });
            console.log('Sample course created');
        } else {
            console.log('Courses already exist');
        }

        console.log('Seeding complete');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
