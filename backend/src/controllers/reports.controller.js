const MaintenanceRequest = require('../models/maintenanceRequest.model');
const Equipment = require('../models/equipment.model');
const Team = require('../models/team.model');

class ReportsController {
  async getSummary(req, res) {
    try {
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      // Requests this month
      const requestsThisMonth = await MaintenanceRequest.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      // Completion rate (repaired / total)
      const totalRequests = await MaintenanceRequest.countDocuments();
      const completedRequests = await MaintenanceRequest.countDocuments({ status: 'repaired' });
      const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

      // Average response time (mock calculation)
      const avgResponseTime = "2.4h";

      // Team efficiency (mock calculation)
      const teamEfficiency = "87%";

      const summary = {
        requestsThisMonth,
        avgResponseTime,
        completionRate: `${completionRate}%`,
        teamEfficiency
      };

      res.json({ ok: true, summary });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async getByTeam(req, res) {
    try {
      const teamStats = await MaintenanceRequest.aggregate([
        {
          $group: {
            _id: '$teamName',
            totalRequests: { $sum: 1 },
            completedRequests: {
              $sum: { $cond: [{ $eq: ['$status', 'repaired'] }, 1, 0] }
            },
            inProgressRequests: {
              $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            teamName: '$_id',
            totalRequests: 1,
            completedRequests: 1,
            inProgressRequests: 1,
            completionRate: {
              $cond: [
                { $gt: ['$totalRequests', 0] },
                { $multiply: [{ $divide: ['$completedRequests', '$totalRequests'] }, 100] },
                0
              ]
            }
          }
        }
      ]);

      res.json({ ok: true, teamStats });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async getMonthly(req, res) {
    try {
      const monthlyStats = await MaintenanceRequest.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            totalRequests: { $sum: 1 },
            completedRequests: {
              $sum: { $cond: [{ $eq: ['$status', 'repaired'] }, 1, 0] }
            }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        },
        {
          $limit: 12
        }
      ]);

      res.json({ ok: true, monthlyStats });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
}

module.exports = new ReportsController();