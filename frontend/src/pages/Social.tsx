import React, { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isSameMonth, isSameDay, addDays, getDay } from 'date-fns';
import { Plus, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';

interface Post {
  id: string;
  date: Date;
  platform: 'Facebook' | 'LinkedIn' | 'Instagram';
  caption: string;
  time: string;
}

const mockPosts: Post[] = [
  { id: '1', date: new Date(), platform: 'LinkedIn', caption: 'Excited to announce our new update...', time: '10:00 AM' },
  { id: '2', date: addDays(new Date(), 2), platform: 'Facebook', caption: 'Join our upcoming webinar!', time: '02:30 PM' },
];

const Social: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newPost, setNewPost] = useState({ platform: 'LinkedIn', caption: '', time: '12:00' });

  const nextMonth = () => setCurrentDate(addDays(endOfMonth(currentDate), 1));
  const prevMonth = () => setCurrentDate(addDays(startOfMonth(currentDate), -1));

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setNewPost({ platform: 'LinkedIn', caption: '', time: '12:00' });
    setShowModal(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    try {
      await apiClient.post('/social/schedule', {
        date: selectedDate.toISOString(),
        platform: newPost.platform,
        caption: newPost.caption,
        time: newPost.time,
      });
    } catch (err) {
      console.warn('Backend unavailable, falling back to local state:', err);
    }
    
    const post: Post = {
      id: Math.random().toString(),
      date: selectedDate,
      platform: newPost.platform as any,
      caption: newPost.caption,
      time: newPost.time,
    };
    
    setPosts([...posts, post]);
    toast.success('Social post scheduled!');
    setShowModal(false);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-success" />
            Social Content Calendar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Schedule and manage multi-platform social media posts.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">Prev</button>
          <span className="text-lg font-bold text-gray-900 dark:text-white min-w-[150px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={nextMonth} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">Next</button>
        </div>
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const platformColors: Record<string, string> = {
      LinkedIn: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      Facebook: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
      Instagram: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800',
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayPosts = posts.filter(p => isSameDay(p.date, cloneDay));
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 relative hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!isSameMonth(day, monthStart) ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="flex justify-between items-start">
              <span className={`text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center ${isSameDay(day, new Date()) ? 'bg-success text-white' : ''}`}>
                {format(day, 'd')}
              </span>
              <button className="text-gray-300 dark:text-gray-600 hover:text-success dark:hover:text-success opacity-0 hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-2 space-y-1">
              {dayPosts.map(post => (
                <div key={post.id} className={`text-xs px-2 py-1 rounded border ${platformColors[post.platform]} truncate`} title={post.caption}>
                  <span className="font-bold mr-1">{post.platform.substring(0,2)}</span> {post.time}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7">{days}</div>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {renderHeader()}
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
          {daysOfWeek.map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        {renderCells()}
      </div>

      {showModal && selectedDate && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
          <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-all">
            <form onSubmit={handleCreatePost}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Schedule Post for {format(selectedDate, 'MMM d, yyyy')}</h3>
                    <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500"><X className="w-5 h-5"/></button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform</label>
                      <select 
                        value={newPost.platform} 
                        onChange={e => setNewPost({...newPost, platform: e.target.value})}
                        className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-success focus:border-success sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Caption / Content</label>
                      <textarea
                        rows={4}
                        required
                        className="mt-1 shadow-sm focus:ring-success focus:border-success block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 border"
                        placeholder="Write something engaging..."
                        value={newPost.caption}
                        onChange={e => setNewPost({...newPost, caption: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule Time</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="time"
                          required
                          value={newPost.time}
                          onChange={e => setNewPost({...newPost, time: e.target.value})}
                          className="focus:ring-success focus:border-success block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                  Schedule Post
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm focus:outline-none">
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

export default Social;
