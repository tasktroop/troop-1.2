import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup as signupApi } from '../../api/auth';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ orgName: '', email: '', password: '', role: 'agent' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const data = await signupApi(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Create LeadOS Account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-3">
              <input name="orgName" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-success focus:border-success focus:z-10 sm:text-sm dark:bg-gray-700" placeholder="Organization name" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <input name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-success focus:border-success focus:z-10 sm:text-sm dark:bg-gray-700" placeholder="Email address" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <input name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-success focus:border-success focus:z-10 sm:text-sm dark:bg-gray-700" placeholder="Password" onChange={handleChange} />
            </div>
            <div>
              <select name="role" value={formData.role} onChange={handleChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-success focus:border-success focus:z-10 sm:text-sm dark:bg-gray-700">
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="agent">Agent</option>
              </select>
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-success hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success">
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account? <Link to="/login" className="font-medium text-success">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
