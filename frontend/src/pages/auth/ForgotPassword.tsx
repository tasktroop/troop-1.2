import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Supabase auth reset link stub
      toast.success('Password reset link sent to ' + email);
    } catch (err: any) {
      toast.error(err?.message || 'Error sending link');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Reset Password</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <input name="email" type="email" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-success focus:border-success focus:z-10 sm:text-sm dark:bg-gray-700" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-success hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success">
              Send Reset Link
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
           <Link to="/login" className="text-sm font-medium text-success hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
