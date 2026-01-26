import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import { Course } from './models/course.model.js';
import { CoursePurchase } from './models/coursePurchase.model.js';

dotenv.config();

const enrollStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Find the student (your personal account)
        const student = await User.findOne({ email: 'amarnaniharsh@gmail.com' });
        if (!student) {
            console.log('Student not found. Please check the email.');
            process.exit(1);
        }
        console.log('Found student:', student.name);

        // Find the course
        const course = await Course.findOne({ title: 'Full Stack Web Development' });
        if (!course) {
            console.log('Course not found');
            process.exit(1);
        }
        console.log('Found course:', course.title);

        // Check if already enrolled
        const existingPurchase = await CoursePurchase.findOne({
            user: student._id,
            course: course._id,
            status: 'completed'
        });

        if (existingPurchase) {
            console.log('Student is already enrolled in this course!');
            process.exit(0);
        }

        // Create a completed purchase record
        const purchase = await CoursePurchase.create({
            user: student._id,
            course: course._id,
            amount: course.price,
            status: 'completed',
            paymentMethod: 'manual',
            paymentId: 'MANUAL_ENROLLMENT_' + Date.now()
        });
        console.log('Created purchase record:', purchase._id);

        // Add student to course's enrolledStudents array
        if (!course.enrolledStudents.includes(student._id)) {
            course.enrolledStudents.push(student._id);
            await course.save();
            console.log('Added student to course enrolledStudents');
        }

        // Add course to student's enrolledCourses array
        if (!student.enrolledCourses.includes(course._id)) {
            student.enrolledCourses.push(course._id);
            await student.save();
            console.log('Added course to student enrolledCourses');
        }

        console.log('\n✅ Student successfully enrolled!');
        console.log('Student:', student.email);
        console.log('Course:', course.title);
        console.log('\nYou can now log in as this student and access /course/' + course._id + '/learn');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

enrollStudent();
