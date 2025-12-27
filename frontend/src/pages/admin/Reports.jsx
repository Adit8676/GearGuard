import { useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, Users, Calendar } from 'lucide-react';
import useReportStore from '../../store/reportStore';
import usePageTitle from '../../hooks/usePageTitle';

const Reports = () => {
  usePageTitle('Reports & Analytics');
  
  const {
    summary,
    teamStats,
    monthlyStats,
    isLoading,
    error,
    fetchAllReports
  } = useReportStore();

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-emerald-500"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400">Monitor maintenance performance and insights</p>
          {error && (
            <p className="text-yellow-400 text-sm mt-1">⚠️ {error}</p>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Requests This Month */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Requests This Month</p>
                <p className="text-2xl font-bold text-white">{summary.requestsThisMonth}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500 text-sm">+12% from last month</span>
                </div>
              </div>
              <div className="bg-emerald-600 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Average Response Time */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">{summary.avgResponseTime}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500 text-sm">-8% improvement</span>
                </div>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-white">{summary.completionRate}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500 text-sm">+3% this month</span>
                </div>
              </div>
              <div className="bg-emerald-600 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Team Efficiency */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Team Efficiency</p>
                <p className="text-2xl font-bold text-white">{summary.teamEfficiency}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500 text-sm">+5% this quarter</span>
                </div>
              </div>
              <div className="bg-purple-600 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Team Performance</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          {teamStats.length > 0 ? (
            <div className="space-y-4">
              {teamStats.map((team, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">{team.teamName}</span>
                    <span className="text-white font-medium">
                      {Math.round(team.completionRate)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${team.completionRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{team.completedRequests} completed</span>
                    <span>{team.totalRequests} total</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Team performance chart will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Trends Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Monthly Trends</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          {monthlyStats.length > 0 ? (
            <div className="space-y-4">
              {monthlyStats.slice(-4).map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      {getMonthName(month._id.month)} {month._id.year}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {month.completedRequests}/{month.totalRequests} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">
                      {Math.round((month.completedRequests / month.totalRequests) * 100)}%
                    </p>
                    <p className="text-gray-400 text-sm">completion</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Monthly trends chart will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Equipment Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Active Equipment</span>
              <span className="text-emerald-400 font-semibold">85</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Under Maintenance</span>
              <span className="text-yellow-400 font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Out of Service</span>
              <span className="text-red-400 font-semibold">3</span>
            </div>
          </div>
        </div>

        {/* Request Types */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Request Types</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Corrective</span>
              <span className="text-blue-400 font-semibold">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Preventive</span>
              <span className="text-emerald-400 font-semibold">32%</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-l-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Response Times</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">&lt; 1 hour</span>
              <span className="text-emerald-400 font-semibold">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">1-4 hours</span>
              <span className="text-yellow-400 font-semibold">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">&gt; 4 hours</span>
              <span className="text-red-400 font-semibold">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;