
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from './models/course.model.js';

dotenv.config();

const checkCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const courses = await Course.find({}, 'title isPublished instructor');
        console.log('All Courses:');
        courses.forEach(c => {
            console.log(`- ${c.title} (ID: ${c._id}): ${c.isPublished ? 'PUBLISHED' : 'DRAFT'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCourses();
