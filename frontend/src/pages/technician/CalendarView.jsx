import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Wrench
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useMaintenanceStore from '../../store/maintenanceStore';

const CalendarView = () => {
  const { user } = useAuthStore();
  const { requests, fetchRequests } = useMaintenanceStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Filter requests based on user role and type (preventive only)
  const getFilteredRequests = () => {
    if (!user) return [];
    
    let filtered = requests.filter(req => req.type === 'preventive' && req.scheduledDate);
    
    if (user.role === 'manager') {
      filtered = filtered.filter(req => 
        user.managedTeams?.includes(req.teamId) || req.teamName === user.teamName
      );
    } else if (user.role === 'technician') {
      filtered = filtered.filter(req => req.teamId === user.teamId || req.teamName === user.teamName);
    }
    
    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  while (current <= lastDay || days.length < 42) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Group requests by date
  const requestsByDate = {};
  filteredRequests.forEach(request => {
    if (request.scheduledDate) {
      const dateKey = new Date(request.scheduledDate).toDateString();
      if (!requestsByDate[dateKey]) {
        requestsByDate[dateKey] = [];
      }
      requestsByDate[dateKey].push(request);
    }
  });

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getRequestsForDate = (date) => {
    return requestsByDate[date.toDateString()] || [];
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const RequestCard = ({ request }) => (
    <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-medium text-sm">{request.equipmentName}</h4>
        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(request.priority)}`}>
          {request.priority || 'medium'}
        </div>
      </div>
      <p className="text-gray-300 text-xs mb-2 line-clamp-2">{request.subject}</p>
      <div className="flex items-center text-gray-400 text-xs">
        <Clock className="w-3 h-3 mr-1" />
        {request.status.replace('_', ' ')}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Calendar View</h1>
        <p className="text-gray-400">Scheduled preventive maintenance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dayRequests = getRequestsForDate(day);
                  const isCurrentMonthDay = isCurrentMonth(day);
                  const isTodayDay = isToday(day);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 h-20 text-left border border-gray-700 hover:border-gray-600 transition-colors
                        ${isCurrentMonthDay ? 'bg-gray-800' : 'bg-gray-900'}
                        ${isTodayDay ? 'ring-2 ring-emerald-500' : ''}
                        ${selectedDate?.toDateString() === day.toDateString() ? 'bg-emerald-900/20' : ''}
                      `}
                    >
                      <span className={`text-sm ${isCurrentMonthDay ? 'text-white' : 'text-gray-500'}`}>
                        {day.getDate()}
                      </span>
                      
                      {dayRequests.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="flex items-center justify-center">
                            <div className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {dayRequests.length}
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center mb-4">
            <CalendarIcon className="w-5 h-5 text-emerald-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">
              {selectedDate ? formatDate(selectedDate) : 'Select a date'}
            </h3>
          </div>

          {selectedDate ? (
            <div className="space-y-3">
              {getRequestsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No maintenance scheduled</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-400 text-sm mb-3">
                    {getRequestsForDate(selectedDate).length} maintenance request(s) scheduled
                  </p>
                  {getRequestsForDate(selectedDate).map(request => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Click on a date to view scheduled maintenance</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-4">
        <h3 className="text-white font-medium mb-3">This Month Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {Object.values(requestsByDate).flat().length}
            </div>
            <div className="text-gray-400 text-sm">Total Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {Object.values(requestsByDate).flat().filter(r => r.status === 'in_progress').length}
            </div>
            <div className="text-gray-400 text-sm">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Object.values(requestsByDate).flat().filter(r => r.status === 'repaired').length}
            </div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;