import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiTruck,
  FiAlertTriangle,
  FiTrendingUp,
  FiClock,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiShield,
  FiPackage,
  FiUser
} from 'react-icons/fi';
import {
  deliveryZones as initialZones,
  initialDeliveryOrders,
  platformLogisticsStats
} from '../../../shared/data/deliveryMockData';
import { formatPrice } from '../../../shared/utils/helpers';

const AdminDeliveryManager = () => {
  const [zones, setZones] = useState(initialZones);
  const [orders, setOrders] = useState(initialDeliveryOrders);
  
  // New zone form states
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCode, setNewZoneCode] = useState('');
  const [newZoneType, setNewZoneType] = useState('same-city');
  const [newZoneDrivers, setNewZoneDrivers] = useState(10);
  
  // Stats summary from mock utilities
  const stats = [
    {
      label: 'Average Transit Time',
      value: `${platformLogisticsStats.averageDeliveryHours} Hours`,
      desc: 'Same-city local deliveries',
      icon: FiClock,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'On-Time SLA Success',
      value: `${platformLogisticsStats.sameCitySuccessRate}%`,
      desc: 'Guaranteed 8-16h express SLA',
      icon: FiTrendingUp,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Critical SLA Delays',
      value: `${platformLogisticsStats.delayedShipmentPercentage}%`,
      desc: 'Escalations and delayed orders',
      icon: FiAlertTriangle,
      color: 'from-red-500 to-orange-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Active Carrier Partners',
      value: `${platformLogisticsStats.activeCarrierPartners} fleets`,
      desc: 'Registered courier partners',
      icon: FiTruck,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  // Handler to add zone coverage parameters dynamically
  const handleAddZone = (e) => {
    e.preventDefault();
    if (!newZoneName.trim() || !newZoneCode.trim()) return;

    const newZone = {
      id: `ZONE-${zones.length + 1}`,
      name: newZoneName,
      type: newZoneType,
      code: newZoneCode,
      activeDrivers: Number(newZoneDrivers),
      successRate: 98.5
    };

    setZones([...zones, newZone]);
    setNewZoneName('');
    setNewZoneCode('');
    setNewZoneDrivers(10);
  };

  // Handler to delete a zone
  const handleDeleteZone = (id) => {
    setZones(zones.filter(z => z.id !== id));
  };

  // Seller SLAs benchmarks data
  const sellerSlas = [
    { name: 'Apex Electronics Ltd', zone: 'Mumbai Metro Loop', dispatchHours: '4.8h', compliance: '99.1%', status: 'Superstar' },
    { name: 'Premium Logistics Furnitures', zone: 'Bangalore Zone-A', dispatchHours: '7.2h', compliance: '98.4%', status: 'Superstar' },
    { name: 'Vibrant Glasswares Inc', zone: 'Delhi Ring Loop', dispatchHours: '14.5h', compliance: '94.2%', status: 'Compliant' },
    { name: 'Standard Packaging Suppliers', zone: 'Outstation Western Zone', dispatchHours: '32.1h', compliance: '88.5%', status: 'Needs Improvement' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-1 bg-gray-50/50"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <FiShield className="text-primary-600" />
            Logistics Control Tower
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time platform wide SLA compliance, delivery zone setups, and active escalations tracking.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-150 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bgColor} p-3 rounded-xl ${stat.textColor} shadow-inner`}>
                  <Icon className="text-xl" />
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Control metrics</span>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Double Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Escalated / Delayed Orders (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Escalations Board */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiAlertTriangle className="text-red-500" />
                  Active Shipments & SLA Status
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Real-time status of orders and SLA priority pipelines</p>
              </div>
              <span className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-bold border border-red-100 animate-pulse">
                Live Auditing
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-150 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="px-5 py-3.5">Order ID</th>
                    <th className="px-5 py-3.5">Customer & Destination</th>
                    <th className="px-5 py-3.5">Logistics Channel</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">SLA SLA Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const isDelayed = order.delivery?.slaStatus === 'delayed';
                    const isExpress = order.delivery?.type === 'express';
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors text-xs">
                        <td className="px-5 py-4 font-bold text-gray-700">{order.id}</td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-800">{order.customer}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-xs">{order.address}</div>
                        </td>
                        <td className="px-5 py-4">
                          {isExpress ? (
                            <span className="bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">⚡ Express</span>
                          ) : order.delivery?.type === 'bulk' ? (
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">📦 B2B Bulk</span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">🚚 Standard</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max ${
                            isDelayed ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' :
                            order.delivery?.priority ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {isDelayed ? '⚠️ Delayed SLA' : order.delivery?.priority ? '⏱️ Priority SLA' : '✓ On Time'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Seller / Vendor SLA Benchmark Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiUser className="text-primary-600" />
                  Seller SLA Processing Speed benchmarks
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Average dispatch speed rankings across top platform vendors</p>
              </div>
              <span className="text-[10px] bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-bold border border-primary-100">
                Sellers Board
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-150 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="px-5 py-3.5">Vendor Name</th>
                    <th className="px-5 py-3.5">Coverage Hub</th>
                    <th className="px-5 py-3.5">Avg Processing Time</th>
                    <th className="px-5 py-3.5">SLA Compliance Rate</th>
                    <th className="px-5 py-3.5">Status Group</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {sellerSlas.map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-800">{s.name}</td>
                      <td className="px-5 py-4 text-gray-600">{s.zone}</td>
                      <td className="px-5 py-4 font-bold text-gray-700">{s.dispatchHours}</td>
                      <td className="px-5 py-4 text-emerald-600 font-extrabold">{s.compliance}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.status === 'Superstar' ? 'bg-emerald-100 text-emerald-800' :
                          s.status === 'Compliant' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Zone Config Coverage Editor */}
        <div className="space-y-6">
          {/* Active Logistics Coverage Setup */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiMapPin className="text-primary-600" />
                Delivery Zones Setup
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage regional boundaries and postal ZIP restrictions</p>
            </div>

            {/* List of active zones */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {zones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-150 hover:border-primary-100 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-800">{zone.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        zone.type === 'same-city' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {zone.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Zip Prefix: <strong className="text-gray-700 font-semibold">{zone.code}*</strong> • Drivers: <strong className="text-gray-700 font-semibold">{zone.activeDrivers}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteZone(zone.id)}
                    className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              ))}
            </div>

            {/* Dynamic Add Zone Form */}
            <form onSubmit={handleAddZone} className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-800 block">Add New Delivery Boundary</span>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Zone Name (e.g. Chennai Metro Loop)"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="Zip Prefix (e.g. 600)"
                    value={newZoneCode}
                    onChange={(e) => setNewZoneCode(e.target.value.replace(/\D/g, ''))}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Active Drivers"
                    value={newZoneDrivers}
                    onChange={(e) => setNewZoneDrivers(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <select
                  value={newZoneType}
                  onChange={(e) => setNewZoneType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="same-city">⚡ Same-City Express Loop</option>
                  <option value="outstation">🚚 Standard Outstation Corridor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <FiPlus className="text-sm" />
                Register Active Zone
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDeliveryManager;
