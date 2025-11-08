import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Phone,
  X,
  Calendar,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase'; 

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('weekly');

  useEffect(() => {
  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('Full user object:', user);
      console.log('User metadata:', user.user_metadata);
      console.log('Display name from metadata:', user.user_metadata?.display_name);
      console.log('First name:', user.user_metadata?.first_name);
      console.log('Last name:', user.user_metadata?.last_name);

      const metaDisplayName = user.user_metadata?.display_name;
      
      if (metaDisplayName) {
        console.log('Setting display name from metadata:', metaDisplayName);
      } else {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
        
        console.log('Profile data:', profile);
        console.log('Profile error:', error);
        
        if (profile?.display_name) {
          console.log('Setting display name from profile:', profile.display_name);
        }
      }
    } else {
      console.log('No user found in session');
    }
  };

  fetchUserData();
}, []);

  // Dummy data for expenses chart
  const expensesData = {
    daily: [
      { name: 'Mon', amount: 2400 },
      { name: 'Tue', amount: 1398 },
      { name: 'Wed', amount: 9800 },
      { name: 'Thu', amount: 3908 },
      { name: 'Fri', amount: 4800 },
      { name: 'Sat', amount: 3800 },
      { name: 'Sun', amount: 4300 },
    ],
    weekly: [
      { name: 'Week 1', amount: 12000 },
      { name: 'Week 2', amount: 19000 },
      { name: 'Week 3', amount: 15000 },
      { name: 'Week 4', amount: 22000 },
    ],
    monthly: [
      { name: 'Jan', amount: 45000 },
      { name: 'Feb', amount: 52000 },
      { name: 'Mar', amount: 48000 },
      { name: 'Apr', amount: 61000 },
    ]
  };

  const pendingApprovals = [
    {
      id: 1,
      supplier: 'ABC Manufacturing',
      product: 'Welding Rods - Grade 6061',
      totalPrice: 2450,
      terms: 'Net 30',
      deliveryDate: '2024-01-15'
    },
    {
      id: 2,
      supplier: 'SteelCorp Industries',
      product: 'Steel Beams - 12ft',
      totalPrice: 3200,
      terms: 'Net 15',
      deliveryDate: '2024-01-20'
    },
    {
      id: 3,
      supplier: 'MetalWorks Ltd',
      product: 'Aluminum Sheets',
      totalPrice: 1800,
      terms: 'Net 30',
      deliveryDate: '2024-01-18'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      status: 'Discovery Mode Active',
      description: 'Welding Equipment',
      date: '2024-01-10',
      progress: 25
    },
    {
      id: 'ORD-002',
      status: 'Quotations Received',
      description: 'Steel Materials',
      date: '2024-01-08',
      progress: 50
    },
    {
      id: 'ORD-003',
      status: 'Order Placed',
      description: 'Safety Equipment',
      date: '2024-01-05',
      progress: 75
    },
    {
      id: 'ORD-004',
      status: 'Shipped',
      description: 'Tools & Hardware',
      date: '2024-01-02',
      progress: 100
    },
    {
      id: 'ORD-005',
      status: 'Delivered',
      description: 'Office Supplies',
      date: '2023-12-28',
      progress: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Discovery Mode Active':
        return 'text-blue-600 bg-blue-100';
      case 'Quotations Received':
        return 'text-yellow-600 bg-yellow-100';
      case 'Order Placed':
        return 'text-purple-600 bg-purple-100';
      case 'Shipped':
        return 'text-green-600 bg-green-100';
      case 'Delivered':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleApprove = (id: number) => {
    console.log('Approving order:', id);
  };

  const handleRequestMeeting = (id: number) => {
    console.log('Requesting meeting for order:', id);
  };

  const handleReject = (id: number) => {
    console.log('Rejecting order:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600">Overview of your procurement activities</p>
      </div>

      {/* Order Expenses Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Order Expenses</h2>
          <div className="flex space-x-2">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  timeframe === period
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={expensesData[timeframe as keyof typeof expensesData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                labelStyle={{ color: '#374151' }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h2>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{approval.supplier}</h3>
                    <p className="text-sm text-gray-600 mt-1">{approval.product}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${approval.totalPrice.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {approval.deliveryDate}
                      </span>
                      <span>{approval.terms}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleApprove(approval.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleRequestMeeting(approval.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Request Call</span>
                  </button>
                  <button
                    onClick={() => handleReject(approval.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Timeline */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders Timeline</h2>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={order.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    order.progress === 100 ? 'bg-green-500' : 
                    order.progress >= 75 ? 'bg-blue-500' : 
                    order.progress >= 50 ? 'bg-yellow-500' : 'bg-gray-300'
                  }`} />
                  {index < recentOrders.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{order.id}</span>
                    <span className="text-xs text-gray-500">{order.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <div className="ml-4 flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;