import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Find the instructor
        const instructor = await User.findOne({ email: 'instructor@example.com' });

        if (!instructor) {
            console.log('Instructor not found');
            process.exit(1);
        }

        // Set new password (the User model's pre-save hook will hash it)
        instructor.password = 'Instructor@123';
        await instructor.save();

        console.log('Password reset successfully!');
        console.log('Email: instructor@example.com');
        console.log('Password: Instructor@123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
