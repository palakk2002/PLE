import { useState, useMemo, useEffect } from 'react';
import api from '../../../../shared/utils/api';
import { FiBriefcase, FiUsers, FiEye, FiCheckCircle, FiXCircle, FiGlobe, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/admin/b2b-users');
      const data = response?.data?.data?.b2bUsers || [];
      const mappedCompanies = data.map(c => ({
        id: c._id,
        companyName: c.companyName,
        gstNumber: c.gstNumber,
        businessEmail: c.businessEmail,
        businessPhone: c.businessPhone,
        businessAddress: c.companyAddress,
        businessType: c.companyType,
        website: c.website,
        status: c.status === 'Active' ? 'Active' : 'Deactivated',
        admin: {
          name: c.admin?.adminName || 'No Admin',
          email: c.admin?.adminEmail || c.businessEmail,
          phone: c.admin?.phone || c.businessPhone,
        },
        employees: new Array(c.employeeCount || 0).fill({}),
        acceptanceExecutionDocument: c.acceptanceExecutionDocument,
      }));
      setCompanies(mappedCompanies);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const total = companies.length;
    const active = companies.filter(c => c.status === 'Active').length;
    const totalEmployees = companies.reduce((acc, c) => acc + (c.employees?.length || 0), 0);
    return { total, active, totalEmployees };
  }, [companies]);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const query = searchQuery.toLowerCase();
      return (
        c.companyName.toLowerCase().includes(query) ||
        c.gstNumber.toLowerCase().includes(query) ||
        c.admin?.name?.toLowerCase().includes(query)
      );
    });
  }, [companies, searchQuery]);

  const handleStatusToggle = async (companyId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
    try {
      // Assuming you have a patch route to update the general status, if not we fall back to local update visually
      // Or we just update visually if no endpoint for 'status' exists yet (note: verificationStatus is different)
      setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, status: nextStatus } : c));
      toast.success(`Company status updated to ${nextStatus}`);
      if (selectedCompany && selectedCompany.id === companyId) {
        setSelectedCompany(prev => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6 space-y-6 text-sm bg-gray-50 dark:bg-zinc-950 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-2">
          <FiBriefcase className="text-[#C07A3D]" /> B2B Company Management
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Manage corporate B2B registrations, employee counts, and verification status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 text-[#C07A3D] rounded-xl flex items-center justify-center text-xl font-bold">
            <FiBriefcase />
          </div>
          <div>
            <span className="text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase">Total Companies</span>
            <p className="text-2xl font-black text-gray-800 dark:text-zinc-100 mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold">
            <FiCheckCircle />
          </div>
          <div>
            <span className="text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase">Active Companies</span>
            <p className="text-2xl font-black text-gray-800 dark:text-zinc-100 mt-1">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">
            <FiUsers />
          </div>
          <div>
            <span className="text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase">Total Employees</span>
            <p className="text-2xl font-black text-gray-800 dark:text-zinc-100 mt-1">{stats.totalEmployees}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Company Name, GST Number, Admin Name..."
          className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none text-xs font-semibold"
        />
      </div>

      {/* Company List Table */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                <th className="p-4">Company Name</th>
                <th className="p-4">GST Number</th>
                <th className="p-4">Company Admin</th>
                <th className="p-4 text-center">Employees</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-750 dark:text-zinc-300">
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-950/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-zinc-100">{c.companyName}</p>
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5 mt-0.5">
                          <FiGlobe className="inline text-[9px]" /> {c.website}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold uppercase">{c.gstNumber}</td>
                  <td className="p-4 font-semibold text-gray-805 dark:text-zinc-150">
                    <p>{c.admin?.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{c.admin?.email}</p>
                  </td>
                  <td className="p-4 text-center font-bold text-base">{c.employees?.length || 0}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                      c.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'bg-red-50 text-red-750 border-red-250 dark:bg-red-950/20 dark:text-red-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedCompany(c)}
                      className="px-2.5 py-1 bg-amber-50 text-[#C07A3D] dark:bg-[#C07A3D]/10 hover:bg-[#C07A3D]/25 font-bold rounded-lg transition-colors flex-inline items-center gap-1 text-[11px]"
                    >
                      <FiEye className="inline" /> View Info
                    </button>
                    <button
                      onClick={() => handleStatusToggle(c.id, c.status)}
                      className={`px-2.5 py-1 font-bold rounded-lg transition-colors text-[11px] ${
                        c.status === 'Active'
                          ? 'border border-red-200 text-red-650 hover:bg-red-50'
                          : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No companies found matching search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details View Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-6 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b pb-4 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-50">{selectedCompany.companyName}</h3>
                <p className="text-xs text-gray-500 font-bold font-mono uppercase mt-0.5">GSTIN: {selectedCompany.gstNumber}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                selectedCompany.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {selectedCompany.status}
              </span>
            </div>

            {/* Company details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-gray-400 block mb-0.5">Business Email</span>
                <span className="text-gray-800 dark:text-zinc-150">{selectedCompany.businessEmail}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Business Phone</span>
                <span className="text-gray-800 dark:text-zinc-150">{selectedCompany.businessPhone}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Business Type</span>
                <span className="text-gray-800 dark:text-zinc-150">{selectedCompany.businessType}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Website</span>
                <span className="text-gray-800 dark:text-zinc-150">{selectedCompany.website || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Employee Count</span>
                <span className="text-gray-800 dark:text-zinc-150 font-bold">{selectedCompany.employees?.length || 0}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-400 block mb-0.5">Business Address</span>
                <span className="text-gray-800 dark:text-zinc-150">{selectedCompany.businessAddress}</span>
              </div>
            </div>

            {/* Admin Information */}
            <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-800 space-y-2 text-xs">
              <h4 className="font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-1"><FiUsers /> Company Admin Information</h4>
              <p className="text-gray-655 dark:text-zinc-350">Admin Name: <span className="font-bold text-gray-850 dark:text-zinc-150">{selectedCompany.admin?.name}</span></p>
              <p className="text-gray-655 dark:text-zinc-350">Admin Email: <span className="font-bold text-gray-850 dark:text-zinc-150">{selectedCompany.admin?.email}</span></p>
              <p className="text-gray-655 dark:text-zinc-350">Admin Phone: <span className="font-bold text-gray-850 dark:text-zinc-150">{selectedCompany.admin?.phone}</span></p>
            </div>

            {/* Acceptance & Execution Agreement */}
            {selectedCompany.acceptanceExecutionDocument && selectedCompany.acceptanceExecutionDocument.url ? (
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-800 space-y-2 text-xs">
                <h4 className="font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-1"><FiFileText /> Acceptance & Execution Agreement</h4>
                <p className="text-gray-655 dark:text-zinc-350">File Name: <span className="font-bold text-gray-850 dark:text-zinc-150 truncate">{selectedCompany.acceptanceExecutionDocument.fileName || 'Signed_Agreement.pdf'}</span></p>
                <p className="text-gray-655 dark:text-zinc-350">Uploaded Date: <span className="font-bold text-gray-850 dark:text-zinc-150">{selectedCompany.acceptanceExecutionDocument.uploadedAt ? new Date(selectedCompany.acceptanceExecutionDocument.uploadedAt).toLocaleString() : 'N/A'}</span></p>
                <div className="flex gap-2 pt-1.5">
                  <a 
                    href={selectedCompany.acceptanceExecutionDocument.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/30 transition-colors"
                  >
                    <FiEye /> Preview Signed PDF
                  </a>
                  <a 
                    href={selectedCompany.acceptanceExecutionDocument.url} 
                    download={selectedCompany.acceptanceExecutionDocument.fileName || 'Signed_Agreement.pdf'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-lg border border-gray-205 transition-colors"
                  >
                    <FiDownload /> Download Signed PDF
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-800 space-y-2 text-xs">
                <h4 className="font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-1"><FiFileText /> Acceptance & Execution Agreement</h4>
                <p className="text-gray-500 italic">No document uploaded or available for this company.</p>
              </div>
            )}

            {/* Employee Information */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-1"><FiUsers /> Employees list ({selectedCompany.employees?.length || 0})</h4>
              {selectedCompany.employees && selectedCompany.employees.length > 0 ? (
                <div className="border dark:border-zinc-800 rounded-xl overflow-hidden divide-y dark:divide-zinc-800 max-h-48 overflow-y-auto">
                  {selectedCompany.employees.map((emp) => (
                    <div key={emp.email} className="p-3 flex justify-between items-center text-xs bg-white dark:bg-zinc-900">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-zinc-100">{emp.name}</p>
                        <p className="text-gray-400 font-bold">{emp.email} • {emp.designation}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {emp.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 border dark:border-zinc-800 rounded-xl">No employees added yet.</div>
              )}
            </div>

            {/* Close */}
            <div className="flex justify-end pt-2 border-t dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="px-5 py-2 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
