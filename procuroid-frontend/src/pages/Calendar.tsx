import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Phone, 
  Users, 
  Truck,
  Calendar as CalendarIcon
} from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate calendar days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Dummy events data
  const events = [
    {
      id: 1,
      title: 'Meeting with SteelCorp Industries',
      type: 'meeting',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '1 hour',
      location: 'Conference Room A',
      attendees: ['John Smith', 'Sarah Johnson'],
      description: 'Discuss new steel material specifications and pricing'
    },
    {
      id: 2,
      title: 'Call with MetalWorks Ltd',
      type: 'call',
      date: '2024-01-16',
      time: '2:00 PM',
      duration: '30 minutes',
      location: 'Phone',
      attendees: ['Mike Davis'],
      description: 'Follow up on aluminum sheet quote'
    },
    {
      id: 3,
      title: 'Delivery - Order #123',
      type: 'delivery',
      date: '2024-01-18',
      time: '9:00 AM',
      duration: '2 hours',
      location: 'Warehouse Dock',
      attendees: ['Delivery Team'],
      description: 'Expected delivery of welding equipment'
    },
    {
      id: 4,
      title: 'Supplier Review Meeting',
      type: 'meeting',
      date: '2024-01-20',
      time: '3:00 PM',
      duration: '1.5 hours',
      location: 'Conference Room B',
      attendees: ['Procurement Team', 'Lisa Wilson'],
      description: 'Quarterly supplier performance review'
    },
    {
      id: 5,
      title: 'Call with SafetyFirst Corp',
      type: 'call',
      date: '2024-01-22',
      time: '11:00 AM',
      duration: '45 minutes',
      location: 'Phone',
      attendees: ['David Brown'],
      description: 'Discuss safety equipment requirements'
    }
  ];

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'call':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAddEvent(true);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(
        <div
          key={`prev-${i}`}
          className="h-24 p-1 border border-gray-200 bg-gray-50"
        >
          <span className="text-gray-400 text-sm">{date.getDate()}</span>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
            isSelected ? 'bg-primary-50 border-primary-200' : ''
          } ${!isCurrentMonth(date) ? 'bg-gray-50' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${
              isToday(date) ? 'text-primary-600 bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center' : 
              isCurrentMonth(date) ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {day}
            </span>
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border-l-2 ${getEventTypeColor(event.type)} truncate`}
                title={event.title}
              >
                <div className="flex items-center space-x-1">
                  {getEventTypeIcon(event.type)}
                  <span className="truncate">{event.title}</span>
                </div>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    // Next month's leading days
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push(
        <div
          key={`next-${day}`}
          className="h-24 p-1 border border-gray-200 bg-gray-50"
        >
          <span className="text-gray-400 text-sm">{date.getDate()}</span>
        </div>
      );
    }

    return days;
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage meetings, calls, and deliveries</p>
        </div>
        <button 
          onClick={() => setShowAddEvent(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {dayNames.map((day) => (
                <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Events Panel */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate ? selectedDate.toLocaleDateString() : 'Upcoming Events'}
            </h2>
            
            <div className="space-y-3">
              {selectedDate ? (
                getSelectedDateEvents().length > 0 ? (
                  getSelectedDateEvents().map((event) => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {event.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {event.time} • {event.duration}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No events scheduled</p>
                )
              ) : (
                events.slice(0, 5).map((event) => (
                  <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded ${getEventTypeColor(event.type)}`}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.date} • {event.time}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Schedule Event</h2>
              <button
                onClick={() => setShowAddEvent(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Meeting with Supplier"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      defaultValue={selectedDate?.toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select className="input-field">
                    <option value="meeting">Meeting</option>
                    <option value="call">Phone Call</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Conference Room A, Phone, etc."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Schedule Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
