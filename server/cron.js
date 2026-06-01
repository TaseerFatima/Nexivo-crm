const cron = require('node-cron');
const Lead = require('./models/Lead');
const Task = require('./models/Task');

const runCronJobs = () => {
  // Run every night at midnight to check for overdue leads and tasks
  cron.schedule('0 0 * * *', async () => {
    console.log('Background Check: Scanning database for overdue leads & tasks...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Sync leads overdue status
      const overdueLeadsResult = await Lead.updateMany(
        { 
          followUpDate: { $lt: today }, 
          status: { $nin: ['Closed', 'Not Interested'] }, 
          isOverdue: false 
        },
        { isOverdue: true }
      );
      
      await Lead.updateMany(
        { 
          $or: [
            { followUpDate: { $gte: today } },
            { followUpDate: null },
            { status: { $in: ['Closed', 'Not Interested'] } }
          ], 
          isOverdue: true 
        },
        { isOverdue: false }
      );

      // 2. Sync tasks overdue status
      const overdueTasksResult = await Task.updateMany(
        { 
          dueDate: { $lt: today }, 
          isDone: false, 
          isOverdue: false 
        },
        { isOverdue: true }
      );

      await Task.updateMany(
        { 
          $or: [
            { dueDate: { $gte: today } },
            { isDone: true }
          ], 
          isOverdue: true 
        },
        { isOverdue: false }
      );

      console.log(`Cron completed: flagged ${overdueLeadsResult.modifiedCount} leads and ${overdueTasksResult.modifiedCount} tasks as overdue.`);
    } catch (err) {
      console.error('Error running background overdue checks:', err.message);
    }
  });
};

module.exports = runCronJobs;
