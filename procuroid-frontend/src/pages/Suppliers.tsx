import { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Package,
  Plus,
  Building2,
  Globe,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  FileText,
  MessageSquare,
  Edit,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getSuppliers } from '../api/apiCalls';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_count: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });

  // Fetch suppliers on component mount and when page changes
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSuppliers(pagination.page, pagination.page_size);
        if (result.success) {
          setSuppliers(result.suppliers);
          setPagination(result.pagination);
        } else {
          setError('Failed to fetch suppliers');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch suppliers');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [pagination.page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchSuppliers = async () => {
        setLoading(true);
        try {
          const result = await getSuppliers(1, pagination.page_size, searchTerm || undefined);
          if (result.success) {
            setSuppliers(result.suppliers);
            setPagination(result.pagination);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to fetch suppliers');
        } finally {
          setLoading(false);
        }
      };
      if (searchTerm || pagination.page === 1) {
        fetchSuppliers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'inactive':
      case 'pending':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'verified':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPerformanceColor = (value: number, threshold: number = 90) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold - 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier relationships and performance</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Directory */}
        <div className="lg:col-span-1">
          <div className="card">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Supplier Directory</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
            </div>
            
            {/* Supplier List */}
            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {loading && (
                <div className="text-center py-8 text-sm text-gray-500">Loading...</div>
              )}
              {error && (
                <div className="text-center py-8 text-sm text-red-500">Error: {error}</div>
              )}
              {!loading && !error && suppliers.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-500">No suppliers found</div>
              )}
              {!loading && !error && suppliers.map((supplier) => {
                const isSelected = selectedSupplier?.id === supplier.id || 
                                  selectedSupplier?.supplier_id === supplier.supplier_id;
                return (
                  <div
                    key={supplier.id || supplier.supplier_id}
                    onClick={() => setSelectedSupplier(supplier)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 truncate mb-1">
                          {supplier.name || supplier.supplier_name || supplier.company_name || 'N/A'}
                        </h3>
                        <p className="text-xs text-gray-600 truncate mb-2">
                          {supplier.email || supplier.contact_email || supplier.contact || 'N/A'}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          {supplier.rating ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{supplier.rating.toFixed(1)}</span>
                            </div>
                          ) : null}
                          {supplier.status && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(supplier.status)}`}>
                              {supplier.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.has_previous || loading}
                    className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.has_next || loading}
                    className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Supplier Detail View */}
        <div className="lg:col-span-2">
          {selectedSupplier ? (
            <div className="space-y-6">
              {/* Supplier Header */}
              <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Building2 className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedSupplier.name || selectedSupplier.supplier_name || selectedSupplier.company_name || 'N/A'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {selectedSupplier.contact || selectedSupplier.contact_email || 'N/A'}
                        </p>
                      </div>
                    </div>
                    {selectedSupplier.rating && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(selectedSupplier.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {selectedSupplier.rating.toFixed(1)}/5.0
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {selectedSupplier.status && (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusColor(selectedSupplier.status)}`}>
                        {selectedSupplier.status}
                      </span>
                    )}
                    <button className="btn-secondary flex items-center gap-2 text-sm">
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="h-5 w-5 text-primary-600" />
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSupplier.total_orders || selectedSupplier.orders_count || 0}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Total Orders</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="h-5 w-5 text-primary-600" />
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(selectedSupplier.total_value || selectedSupplier.revenue || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Total Value</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle2 className="h-5 w-5 text-primary-600" />
                      <span className={`text-xs font-semibold ${getPerformanceColor(selectedSupplier.on_time_delivery || 95)}`}>
                        {selectedSupplier.on_time_delivery || 95}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSupplier.on_time_delivery || 95}%
                    </p>
                    <p className="text-xs text-gray-600 mt-1">On-Time Delivery</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="h-5 w-5 text-primary-600" />
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSupplier.avg_delivery_days || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Avg. Delivery Days</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="card">
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview', icon: FileText },
                      { id: 'performance', label: 'Performance', icon: TrendingUp },
                      { id: 'orders', label: 'Orders', icon: Package },
                      { id: 'notes', label: 'Notes', icon: MessageSquare }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'border-primary-500 text-primary-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="h-5 w-5 text-primary-600" />
                            Contact Information
                          </h3>
                          <div className="space-y-4">
                            {(selectedSupplier.email || selectedSupplier.contact_email) && (
                              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                  <a href={`mailto:${selectedSupplier.email || selectedSupplier.contact_email}`} className="text-sm font-medium text-gray-900 hover:text-primary-600">
                                    {selectedSupplier.email || selectedSupplier.contact_email}
                                  </a>
                                </div>
                              </div>
                            )}
                            {(selectedSupplier.phone || selectedSupplier.contact_phone) && (
                              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                  <a href={`tel:${selectedSupplier.phone || selectedSupplier.contact_phone}`} className="text-sm font-medium text-gray-900 hover:text-primary-600">
                                    {selectedSupplier.phone || selectedSupplier.contact_phone}
                                  </a>
                                </div>
                              </div>
                            )}
                            {(selectedSupplier.location || selectedSupplier.address) && (
                              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {selectedSupplier.location || selectedSupplier.address}
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedSupplier.website && (
                              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Website</p>
                                  <a href={selectedSupplier.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:underline flex items-center gap-1">
                                    {selectedSupplier.website}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Company Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary-600" />
                            Company Details
                          </h3>
                          <div className="space-y-4">
                            {selectedSupplier.company_name && (
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company Name</p>
                                <p className="text-sm font-medium text-gray-900">{selectedSupplier.company_name}</p>
                              </div>
                            )}
                            {selectedSupplier.industry && (
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Industry</p>
                                <p className="text-sm font-medium text-gray-900">{selectedSupplier.industry}</p>
                              </div>
                            )}
                            {selectedSupplier.founded_year && (
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Founded</p>
                                <p className="text-sm font-medium text-gray-900">{selectedSupplier.founded_year}</p>
                              </div>
                            )}
                            {selectedSupplier.employee_count && (
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Employees</p>
                                <p className="text-sm font-medium text-gray-900">{selectedSupplier.employee_count}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Specialties & Certifications */}
                      {(selectedSupplier.specialties || selectedSupplier.certifications) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedSupplier.specialties && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(selectedSupplier.specialties) 
                                  ? selectedSupplier.specialties.map((specialty: string, index: number) => (
                                      <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                                        {specialty}
                                      </span>
                                    ))
                                  : <span className="text-sm text-gray-600">{selectedSupplier.specialties}</span>
                                }
                              </div>
                            </div>
                          )}
                          {selectedSupplier.certifications && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(selectedSupplier.certifications)
                                  ? selectedSupplier.certifications.map((cert: string, index: number) => (
                                      <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <Award className="h-3 w-3 mr-1" />
                                        {cert}
                                      </span>
                                    ))
                                  : <span className="text-sm text-gray-600">{selectedSupplier.certifications}</span>
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Performance Tab */}
                  {activeTab === 'performance' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded">+12%</span>
                          </div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Performance Trend</p>
                          <p className="text-3xl font-bold text-blue-900">{selectedSupplier.performance_trend || '+12%'}</p>
                          <p className="text-xs text-blue-700 mt-1">vs last quarter</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            <span className={`text-xs font-semibold ${getPerformanceColor(selectedSupplier.on_time_delivery || 94)} bg-white px-2 py-1 rounded`}>
                              {selectedSupplier.on_time_delivery || 94}%
                            </span>
                          </div>
                          <p className="text-sm font-medium text-green-900 mb-1">On-Time Delivery</p>
                          <p className="text-3xl font-bold text-green-900">{selectedSupplier.on_time_delivery || 94}%</p>
                          <p className="text-xs text-green-700 mt-1">last 12 months</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                          <div className="flex items-center justify-between mb-4">
                            <Star className="h-6 w-6 text-purple-600" />
                            <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-1 rounded">
                              {selectedSupplier.rating?.toFixed(1) || '4.5'}/5
                            </span>
                          </div>
                          <p className="text-sm font-medium text-purple-900 mb-1">Quality Rating</p>
                          <p className="text-3xl font-bold text-purple-900">{selectedSupplier.rating?.toFixed(1) || '4.5'}</p>
                          <p className="text-xs text-purple-700 mt-1">average rating</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-4">Order Statistics</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Total Orders</span>
                              <span className="text-sm font-semibold text-gray-900">{selectedSupplier.total_orders || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Active Orders</span>
                              <span className="text-sm font-semibold text-green-600">{selectedSupplier.active_orders || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Completed</span>
                              <span className="text-sm font-semibold text-gray-900">{selectedSupplier.completed_orders || 0}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-4">Financial Overview</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Total Value</span>
                              <span className="text-sm font-semibold text-gray-900">
                                ${(selectedSupplier.total_value || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Average Order Value</span>
                              <span className="text-sm font-semibold text-gray-900">
                                ${((selectedSupplier.total_value || 0) / Math.max(selectedSupplier.total_orders || 1, 1)).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Last Order Date</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {selectedSupplier.last_order_date || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                        <button className="btn-primary text-sm flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          New Order
                        </button>
                      </div>
                      {selectedSupplier.orders && selectedSupplier.orders.length > 0 ? (
                        <div className="space-y-3">
                          {selectedSupplier.orders.map((order: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-colors">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{order.order_id || `Order #${index + 1}`}</h4>
                                <p className="text-sm text-gray-600 mt-1">{order.description || order.product_name || 'No description'}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    {order.date || order.order_date || 'N/A'}
                                  </span>
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status || 'Unknown'}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${(order.amount || order.value || 0).toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{order.quantity || 1} units</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No order history available</p>
                          <button className="btn-primary mt-4 text-sm flex items-center gap-2 mx-auto">
                            <Plus className="h-4 w-4" />
                            Create First Order
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Internal Notes</h3>
                        <button className="btn-secondary flex items-center gap-2 text-sm">
                          <MessageSquare className="h-4 w-4" />
                          Add Note
                        </button>
                      </div>
                      {selectedSupplier.notes && selectedSupplier.notes.length > 0 ? (
                        <div className="space-y-3">
                          {selectedSupplier.notes.map((note: any, index: number) => (
                            <div key={index} className={`p-4 border-l-4 rounded-r-lg ${
                              note.type === 'positive' ? 'border-green-500 bg-green-50' :
                              note.type === 'negative' ? 'border-red-500 bg-red-50' :
                              'border-gray-500 bg-gray-50'
                            }`}>
                              <p className="text-sm text-gray-900">{note.content || note.note || 'No content'}</p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-gray-500">By {note.author || 'System'}</span>
                                <span className="text-xs text-gray-500">{note.date || note.created_at || 'N/A'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No notes available</p>
                          <button className="btn-secondary flex items-center gap-2 mx-auto text-sm">
                            <MessageSquare className="h-4 w-4" />
                            Add First Note
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Supplier</h3>
                <p className="text-gray-500">Choose a supplier from the directory to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
