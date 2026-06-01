const router = require('express').Router()
const { protect, roleGuard } = require('../middleware/auth')
const Lead = require('../models/Lead')

router.get('/summary', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(today.getDate() - 7);
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(today.getDate() - 30);

    // 1. Gross metrics
    const total = await Lead.countDocuments();
    const todayLeads = await Lead.countDocuments({ createdAt: { $gte: today } });
    const weeklyLeads = await Lead.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const monthlyLeads = await Lead.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // 2. Status distribution aggregation
    const statusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 3. Source distribution aggregation
    const sourceCounts = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    res.json({ 
      total, 
      todayLeads, 
      weeklyLeads, 
      monthlyLeads, 
      statusCounts, 
      sourceCounts 
    });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

router.get('/operators', protect, roleGuard('admin', 'owner'), async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { 
        $group: { 
          _id: '$assignedTo', 
          total: { $sum: 1 },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } }
        }
      },
      { 
        $lookup: { 
          from: 'users', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'user' 
        }
      },
      { $unwind: '$user' },
      { 
        $project: { 
          name: '$user.name', 
          total: 1, 
          closed: 1
        }
      }
    ]);
    res.json(data);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;
