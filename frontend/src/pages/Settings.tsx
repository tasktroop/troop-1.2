import React, { useState } from 'react';
import { User, Key, Users, Building, Mail, EyeOff, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('org');
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showTwilioKey, setShowTwilioKey] = useState(false);
  
  const [apiKeys, setApiKeys] = useState({
    openai: 'sk-proj-xxxxxxxxxxxxxxxxxxxx',
    twilioSid: 'ACxxxxxxxxxxxxxxxxxxxx',
    twilioToken: 'xxxxxxxxxxxxxxxxxxxx',
  });

  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  const tabs = [
    { id: 'org', name: 'Org Profile', icon: Building },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'team', name: 'Team Members', icon: Users },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage organization details, team invitations, and third-party API configurations.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tabs Desktop & Mobile */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="sm:hidden p-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full border-gray-300 dark:border-gray-600 rounded-md focus:ring-success focus:border-success text-gray-900 dark:text-white bg-white dark:bg-gray-700"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex -mb-px" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      ${activeTab === tab.id
                        ? 'border-success text-success'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          
          {/* Org Profile Tab */}
          {activeTab === 'org' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Organization Profile</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name</label>
                  <input type="text" defaultValue="Acme Corp" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Domain</label>
                  <input type="text" defaultValue="acme.com" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 border" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button className="bg-success text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-medium">Save Changes</button>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Integration Keys</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 pb-4">These keys connect LeadOS to external services securely.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">OpenAI API Key</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input 
                      type={showOpenAIKey ? 'text' : 'password'} 
                      value={apiKeys.openai} 
                      onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                      className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-none rounded-l-md focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                    />
                    <button type="button" onClick={() => setShowOpenAIKey(!showOpenAIKey)} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500">
                      {showOpenAIKey ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twilio Account SID</label>
                    <input type="text" value={apiKeys.twilioSid} onChange={(e) => setApiKeys({...apiKeys, twilioSid: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twilio Auth Token</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input 
                        type={showTwilioKey ? 'text' : 'password'} 
                        value={apiKeys.twilioToken} 
                        onChange={(e) => setApiKeys({...apiKeys, twilioToken: e.target.value})}
                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-none rounded-l-md focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                      />
                      <button type="button" onClick={() => setShowTwilioKey(!showTwilioKey)} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500">
                        {showTwilioKey ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="bg-success text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-medium">Save Keys</button>
              </div>
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Team</h3>
              </div>
              
              <form onSubmit={handleInvite} className="flex gap-3">
                <div className="flex-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="focus:ring-success focus:border-success block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border"
                    placeholder="Enter email to invite"
                  />
                </div>
                <button type="submit" className="bg-success text-white px-4 py-2 rounded-md shadow hover:bg-opacity-90 font-medium">
                  Send Invite
                </button>
              </form>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-0">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <li className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="h-10 w-10 bg-success/20 text-success rounded-full flex items-center justify-center font-bold">A</span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">admin@acme.com</p>
                      </div>
                    </div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Admin</span>
                  </li>
                  <li className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="h-10 w-10 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 rounded-full flex items-center justify-center font-bold">J</span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Jane Agent</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">jane@acme.com</p>
                      </div>
                    </div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Agent</span>
                  </li>
                </ul>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
