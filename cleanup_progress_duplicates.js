import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const CourseProgress = mongoose.model('CourseProgress', new mongoose.Schema({}, { strict: false }));
    
    const allProgress = await CourseProgress.find();
    console.log(`\n📊 Found ${allProgress.length} progress documents`);
    
    let totalFixed = 0;
    
    for (const progress of allProgress) {
      const originalCount = progress.lectureProgress.length;
      
      // Remove duplicates by keeping only unique lecture IDs
      const uniqueLectures = new Map();
      
      progress.lectureProgress.forEach(lp => {
        const lectureId = lp.lecture.toString();
        // Keep the entry with isCompleted = true if any exist
        if (!uniqueLectures.has(lectureId) || lp.isCompleted) {
          uniqueLectures.set(lectureId, {
            lecture: lp.lecture,
            isCompleted: lp.isCompleted,
            watchTime: lp.watchTime || 0,
            lastWatched: lp.lastWatched || new Date()
          });
        }
      });
      
      progress.lectureProgress = Array.from(uniqueLectures.values());
      
      const newCount = progress.lectureProgress.length;
      
      if (originalCount !== newCount) {
        console.log(`\n🔧 Fixing progress for user ${progress.user}:`);
        console.log(`   Course: ${progress.course}`);
        console.log(`   Before: ${originalCount} entries`);
        console.log(`   After: ${newCount} entries`);
        console.log(`   Removed: ${originalCount - newCount} duplicates`);
        
        // Don't rely on pre-save hook, set percentage to 0 (controller will calculate)
        progress.completionPercentage = 0;
        
        await progress.save();
        totalFixed++;
      }
    }
    
    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Fixed ${totalFixed} progress documents`);
    console.log(`   ${allProgress.length - totalFixed} were already clean`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
