import { useState } from 'react';
import {
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  Truck,
  Eye,
} from 'lucide-react';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      description: 'Welding Equipment - Industrial Grade',
      status: 'Discovery Mode Active',
      dateCreated: '2024-01-10',
      totalCost: 0,
      supplier: 'Multiple',
      quotations: 0
    },
    {
      id: 'ORD-002',
      description: 'Steel Materials - Construction Grade',
      status: 'Quotations Received',
      dateCreated: '2024-01-08',
      totalCost: 0,
      supplier: 'Multiple',
      quotations: 3
    },
    {
      id: 'ORD-003',
      description: 'Safety Equipment - PPE Package',
      status: 'Order Placed',
      dateCreated: '2024-01-05',
      totalCost: 1850,
      supplier: 'SafetyFirst Corp',
      quotations: 1
    },
    {
      id: 'ORD-004',
      description: 'Tools & Hardware - Maintenance Kit',
      status: 'Shipped',
      dateCreated: '2024-01-02',
      totalCost: 3200,
      supplier: 'ToolMaster Ltd',
      quotations: 1
    },
    {
      id: 'ORD-005',
      description: 'Office Supplies - Stationery',
      status: 'Delivered',
      dateCreated: '2023-12-28',
      totalCost: 450,
      supplier: 'OfficePro Inc',
      quotations: 1
    },
    {
      id: 'ORD-006',
      description: 'Electrical Components - Wiring',
      status: 'Pending Approval',
      dateCreated: '2024-01-12',
      totalCost: 0,
      supplier: 'ElectroSupply',
      quotations: 2
    }
  ];

  const quotations = {
    2: [
      {
        id: 1,
        supplier: 'SteelCorp Industries',
        pricePerUnit: 15.50,
        totalPrice: 1550,
        deliveryDate: '2024-01-25',
        paymentTerms: 'Net 30',
        rating: 4.5
      },
      {
        id: 2,
        supplier: 'MetalWorks Ltd',
        pricePerUnit: 14.80,
        totalPrice: 1480,
        deliveryDate: '2024-01-22',
        paymentTerms: 'Net 15',
        rating: 4.2
      },
      {
        id: 3,
        supplier: 'Construction Supply Co',
        pricePerUnit: 16.20,
        totalPrice: 1620,
        deliveryDate: '2024-01-28',
        paymentTerms: 'Net 30',
        rating: 4.0
      }
    ],
    6: [
      {
        id: 1,
        supplier: 'ElectroSupply',
        pricePerUnit: 8.50,
        totalPrice: 850,
        deliveryDate: '2024-01-20',
        paymentTerms: 'Net 30',
        rating: 4.3
      },
      {
        id: 2,
        supplier: 'PowerTech Solutions',
        pricePerUnit: 9.20,
        totalPrice: 920,
        deliveryDate: '2024-01-18',
        paymentTerms: 'Net 15',
        rating: 4.1
      }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Discovery Mode Active':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Quotations Received':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'Order Placed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'Pending Approval':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Discovery Mode Active':
        return 'text-blue-600 bg-blue-100';
      case 'Quotations Received':
        return 'text-yellow-600 bg-yellow-100';
      case 'Order Placed':
        return 'text-green-600 bg-green-100';
      case 'Shipped':
        return 'text-purple-600 bg-purple-100';
      case 'Delivered':
        return 'text-gray-600 bg-gray-100';
      case 'Pending Approval':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order.quotations > 0 ? parseInt(orderId.split('-')[1]) : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage all your procurement requests and orders</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-48"
            >
              <option value="all">All Status</option>
              <option value="Discovery Mode Active">Discovery Mode</option>
              <option value="Quotations Received">Quotations Received</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {order.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.dateCreated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.totalCost > 0 ? `$${order.totalCost.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleSelectOrder(order.id)}
                          className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quotations View */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quotations</h2>
            {selectedOrder && quotations[selectedOrder as keyof typeof quotations] ? (
              <div className="space-y-4">
                {quotations[selectedOrder as keyof typeof quotations].map((quote) => (
                  <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{quote.supplier}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500">Rating: </span>
                          <div className="flex items-center ml-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < Math.floor(quote.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                            <span className="ml-1 text-xs text-gray-500">({quote.rating})</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        ${quote.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Price/Unit:</span>
                        <span className="font-medium">${quote.pricePerUnit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Delivery:</span>
                        <span className="font-medium">{quote.deliveryDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Payment:</span>
                        <span className="font-medium">{quote.paymentTerms}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                        Accept
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Compare
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select an order to view quotations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
