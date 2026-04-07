import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, Clock, Zap, MessageSquare, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stage, setStage] = useState('new');
  const { user } = useAuth();
  const role = user?.role || 'admin';
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [aiDraft, setAiDraft] = useState('');
  const [newNote, setNewNote] = useState('');

  const lead = {
    id: id || '1',
    name: 'Sarah Connor',
    email: 'sarah@skynet.com',
    phone: '+1 555-8899',
    source: 'Referral',
  };

  const handleGenerateDraft = () => {
    setShowAiPanel(true);
    setAiDraft("Hi Sarah, I saw you were referred to LeadOS. Are you still interested in learning about our automated AI assistant workflows? I'd love to jump on a quick 10-min call.\n\nBest, John");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4 mb-2">
        <Link to="/leads" className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Leads
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Lead Info and Actions */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700 relative">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{lead.name}</h2>
              {role === 'admin' && (
                <div className="relative">
                  <button 
                    onClick={() => setShowMenu(!showMenu)} 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-20 border border-gray-200 dark:border-gray-600">
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => alert("Delete lead logic fired")}
                      >
                        Delete Lead
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold w-16 inline-block">Email:</span> {lead.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold w-16 inline-block">Phone:</span> {lead.phone}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold w-16 inline-block">Source:</span> {lead.source}</p>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stage</label>
              <select 
                value={stage} 
                onChange={(e) => setStage(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-success focus:border-success sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="mt-8 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <CheckCircle className="w-4 h-4 text-warning" />
                Request Approval
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-opacity-90">
                <MessageSquare className="w-4 h-4" />
                Send WhatsApp
              </button>
              <button onClick={handleGenerateDraft} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700">
                <Zap className="w-4 h-4" />
                Generate AI Draft
              </button>
            </div>
          </div>
          
          {/* AI Panel */}
          {showAiPanel && (
            <div className="bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Draft Content
              </h3>
              <textarea 
                value={aiDraft} 
                onChange={(e) => setAiDraft(e.target.value)}
                rows={5}
                className="w-full block border border-indigo-200 dark:border-indigo-700 rounded-md bg-white dark:bg-gray-800 p-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
              />
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1.5 border border-indigo-300 text-indigo-700 dark:border-indigo-600 dark:text-indigo-300 text-sm font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-800">
                  Edit
                </button>
                <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700">
                  Approve & Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Activity Timeline */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Activity & Notes</h3>
            
            {/* Timeline */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center z-10">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="w-px h-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Lead Created</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Oct 24, 2023 - 10:45 AM</p>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-100 dark:border-gray-600">
                    Captured from Website contact form.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center z-10">
                    <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Note Added User (Admin)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Oct 25, 2023 - 2:00 PM</p>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-100 dark:border-yellow-800/50">
                    Called but no answer. Left a voicemail. Will try again tomorrow.
                  </div>
                </div>
              </div>
            </div>

            {/* Note Input */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3 items-start">
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note or log activity..."
                  className="flex-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-success focus:border-success sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                />
                <button 
                  disabled={!newNote.trim()}
                  className="inline-flex items-center p-2.5 border border-transparent rounded-md shadow-sm text-white bg-success hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
