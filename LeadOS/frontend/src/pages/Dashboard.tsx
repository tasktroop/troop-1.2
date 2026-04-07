import React, { useState } from 'react';
import { Users, CheckSquare, MessageSquare, DollarSign, Plus, Calendar as CalendarIcon, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Leads', value: '143', icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'Open Approvals', value: '12', icon: CheckSquare, change: '3 urgent', changeType: 'warning' },
    { name: 'Posts This Week', value: '8', icon: MessageSquare, change: '2 scheduled', changeType: 'neutral' },
    { name: 'MRR', value: '$12,450', icon: DollarSign, change: '+4.5%', changeType: 'increase' },
  ];

  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  const mockRecentLeads = [
    { id: 1, name: 'Alice Smith', stage: 'New', source: 'Website', created: '2026-03-22' },
    { id: 2, name: 'Bob Jones', stage: 'Contacted', source: 'Referral', created: '2026-03-21' },
    { id: 3, name: 'Charlie Brown', stage: 'Qualified', source: 'Facebook', created: '2026-03-20' },
    { id: 4, name: 'Diana Prince', stage: 'Closed', source: 'Direct', created: '2026-03-19' },
    { id: 5, name: 'Evan Hansen', stage: 'Paid', source: 'Website', created: '2026-03-18' },
  ];

  const mockRecentApprovals = [
    { id: 101, leadName: 'Sarah Connor', requestedBy: 'John Agent', date: '2026-03-22', type: 'Special Discount' },
    { id: 102, leadName: 'Kyle Reese', requestedBy: 'Jane Agent', date: '2026-03-21', type: 'Custom AI Prompt' },
    { id: 103, leadName: 'Miles Dyson', requestedBy: 'Bob Agent', date: '2026-03-20', type: 'Extension Request' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
              <dt>
                <div className="absolute bg-success rounded-md p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
                <div className="absolute bottom-0 inset-x-0 bg-gray-50 dark:bg-gray-700/50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className={`font-medium ${
                      item.changeType === 'increase' ? 'text-success' : 
                      item.changeType === 'warning' ? 'text-warning' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.change}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400"> from last month</span>
                  </div>
                </div>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Row */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button onClick={() => setShowAddLeadModal(true)} className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Lead
          </button>
          <Link to="/social" className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <CalendarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Schedule Post
          </Link>
          <Link to="/analytics" className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <BarChart2 className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            View Analytics
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads Table (Takes 2/3 width on large screens) */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 lg:col-span-2 flex flex-col">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Leads</h3>
            <Link to="/leads" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">View All &rarr;</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/80">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stage</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mockRecentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Approvals List (Takes 1/3 width) */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Pending Approvals</h3>
            <Link to="/approvals" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">View All &rarr;</Link>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 flex-1">
            {mockRecentApprovals.map((approval) => (
              <li key={approval.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{approval.leadName}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Pending
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      Req. by {approval.requestedBy}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <p>{approval.date}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showAddLeadModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddLeadModal(false)}></div>
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden p-6 transform transition-all">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Lead</h3>
              <button type="button" onClick={() => setShowAddLeadModal(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Lead Added Successfully'); setShowAddLeadModal(false); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input required type="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="+1 555-0100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input required type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Website</option>
                    <option>Referral</option>
                    <option>Cold Call</option>
                    <option>Facebook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stage</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
