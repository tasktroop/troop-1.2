import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity } from 'lucide-react';
import apiClient from '../api/apiClient';

// Mock Data
const leadsByWeekData = [
  { name: 'Week 1', leads: 40 },
  { name: 'Week 2', leads: 30 },
  { name: 'Week 3', leads: 45 },
  { name: 'Week 4', leads: 60 },
];

const leadsByStageData = [
  { name: 'New', value: 45 },
  { name: 'Contacted', value: 30 },
  { name: 'Qualified', value: 20 },
  { name: 'Closed', value: 5 },
  { name: 'Paid', value: 10 },
];

const COLORS = ['#3b82f6', '#eab308', '#6366f1', '#ef4444', '#10b981'];

const postsByWeekData = [
  { name: 'Week 1', posts: 5 },
  { name: 'Week 2', posts: 8 },
  { name: 'Week 3', posts: 4 },
  { name: 'Week 4', posts: 7 },
];

const Analytics: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [funnel, setFunnel] = useState<any>({});

  useEffect(() => {
    Promise.all([
      apiClient.get('/analytics/report'),
      apiClient.get('/analytics/leads/funnel')
    ]).then(([resReport, resFunnel]) => {
      setReport(resReport.data);
      setFunnel(resFunnel.data);
    }).catch(console.error);
  }, []);

  const totalLeads = report ? report.totalLeads : 175;
  const convRate = report ? report.conversionRate : '8.5%';
  const totalPosts = report ? (report.postsPublished + report.postsScheduled) : 24;

  const dynamicFunnel = Object.keys(funnel).length > 0 
    ? Object.keys(funnel).map(k => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: funnel[k] }))
    : leadsByStageData;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-success" />
          Analytics Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your lead generation and social engagement metrics.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Leads (30d)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLeads}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="p-3 rounded-full bg-success/20 text-success mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{convRate}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 mr-4">
            <Activity className="w-6 h-6" />
          </div>
          <div>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts (30d)</p>
             <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPosts}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Week */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Leads by Week</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadsByWeekData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads by Stage */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Leads by Stage</h3>
          <div style={{ width: '100%', height: 280 }} className="flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicFunnel}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {dynamicFunnel.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Posts Published per Week */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Social Posts Published</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postsByWeekData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                />
                <Bar dataKey="posts" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
