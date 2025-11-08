import { X, CheckCircle, AlertCircle, Clock, Truck } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
}

const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const notifications = [
    {
      id: 1,
      type: 'quote',
      title: 'New quote received for Order #123',
      message: 'ABC Manufacturing has submitted a quote for $2,450',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Meeting confirmed with Supplier XYZ',
      message: 'Your meeting is scheduled for tomorrow at 2:00 PM',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'delivery',
      title: 'Order #121 has been shipped',
      message: 'Your welding rods are on their way. Expected delivery: Dec 15',
      time: '3 hours ago',
      unread: false
    },
    {
      id: 4,
      type: 'approval',
      title: 'Order #120 requires approval',
      message: 'Quote from SteelCorp is pending your review',
      time: '1 day ago',
      unread: false
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'meeting':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'delivery':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'approval':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
              notification.unread ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
              {notification.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
