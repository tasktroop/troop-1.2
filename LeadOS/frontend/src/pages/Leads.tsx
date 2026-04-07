import React, { useState } from 'react';
import { Search, Filter, Calendar as CalendarIcon, MoreVertical, ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, createLead } from '../api/leads';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Mock Data
const mockLeads = Array.from({ length: 20 }).map((_, idx) => ({
  id: `lead_${idx}`,
  name: `John Doe ${idx}`,
  phone: `+1 555-010${idx}`,
  stage: ['new', 'contacted', 'qualified', 'closed', 'paid'][Math.floor(Math.random() * 5)],
  source: ['Website', 'Facebook', 'Referral', 'Cold Call'][Math.floor(Math.random() * 4)],
  createdDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
}));

const Leads: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const role = user?.role || 'admin'; // fallback to admin for testing
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [newLead, setNewLead] = useState({ name: '', phone: '', email: '', source: 'Website', stage: 'new' });

  const { data: leadsData = mockLeads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      try {
        const res = await getLeads();
        return res.data.length ? res.data : mockLeads; // fallback for ui demo if empty
      } catch (err) {
        return mockLeads; // fallback to mock
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createLead(data),
    onSuccess: () => {
      toast.success('Lead added successfully!');
      setIsAddModalOpen(false);
      setNewLead({ name: '', phone: '', email: '', source: 'Website', stage: 'new' });
      // In a real app we would invalidate queries, but since we rely on mock data fallback if DB is empty, 
      // let's forcefully append to local cache so the user sees it in the UI immediately without DB dependency.
      queryClient.setQueryData(['leads'], (old: any) => [{...newLead, id: Math.random().toString(), createdDate: new Date().toISOString()}, ...(old || [])]);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Error occurred creating lead. Make sure backend is running.');
    }
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newLead);
  };

  const stageColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    qualified: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    closed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    paid: 'bg-success/20 text-success dark:bg-success/20 dark:text-success',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads ({leadsData.length})</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 flex items-center gap-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div className="relative flex-1 max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search leads..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-success focus:border-success sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex items-center">
              <Filter className="absolute left-3 h-4 w-4 text-gray-400" />
              <select
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-success sm:text-sm"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="all">All Stages</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="relative flex items-center">
               <CalendarIcon className="absolute left-3 h-4 w-4 text-gray-400" />
               <input type="date" className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-success sm:text-sm" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stage</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {leadsData.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${stageColors[lead.stage] || stageColors['new']}`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lead.createdDate ? new Date(lead.createdDate).toLocaleDateString() : new Date().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === lead.id ? null : lead.id)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {openDropdownId === lead.id && (
                      <div className="absolute right-8 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-20 border border-gray-200 dark:border-gray-600">
                        <Link 
                          to={`/leads/${lead.id}`} 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                        >
                          View Details
                        </Link>
                        {role === 'admin' && (
                          <button 
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                            onClick={() => {
                                alert("Delete lead logic fired");
                                setOpenDropdownId(null);
                            }}
                          >
                            Delete Lead
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">20</span> of <span className="font-medium">97</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-all">
            <form onSubmit={handleCreateSubmit}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Add New Lead</h3>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-5 h-5"/>
                  </button>
                </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                      <input type="text" required value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                      <input type="text" required value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <input type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
                      <select value={newLead.source} onChange={e => setNewLead({...newLead, source: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-success focus:border-success sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Facebook">Facebook</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stage</label>
                      <select value={newLead.stage} onChange={e => setNewLead({...newLead, stage: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-success focus:border-success sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                  <button type="submit" disabled={createMutation.isPending} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                    {createMutation.isPending ? 'Saving...' : 'Save Lead'}
                  </button>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm focus:outline-none">
                    Cancel
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
