import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import { Course } from './models/course.model.js';
import { CoursePurchase } from './models/coursePurchase.model.js';

dotenv.config();

const enrollTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Find test user
        const student = await User.findOne({ email: 'test@test.com' });
        if (!student) {
            console.log('Student test@test.com not found');
            process.exit(1);
        }
        console.log('Found student:', student.name, student._id);

        // Find any course (published or not)
        let course = await Course.findOne({ isPublished: true });
        if (!course) {
            course = await Course.findOne();
        }
        if (!course) {
            console.log('No course found');
            process.exit(1);
        }
        console.log('Found course:', course.title, course._id);

        // Check existing purchase
        const existingPurchase = await CoursePurchase.findOne({
            user: student._id,
            course: course._id
        });

        if (existingPurchase) {
            console.log('Purchase already exists, updating status to completed');
            existingPurchase.status = 'completed';
            await existingPurchase.save();
        } else {
            const purchase = await CoursePurchase.create({
                user: student._id,
                course: course._id,
                amount: course.price || 0,
                status: 'completed',
                paymentMethod: 'manual',
                paymentId: 'MANUAL_' + Date.now()
            });
            console.log('Created purchase:', purchase._id);
        }

        // Update relationships
        await Course.findByIdAndUpdate(course._id, { $addToSet: { enrolledStudents: student._id } });
        await User.findByIdAndUpdate(student._id, { $addToSet: { enrolledCourses: course._id } });

        console.log('\n✅ Successfully enrolled test@test.com in:', course.title);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

enrollTestUser();
