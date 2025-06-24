import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import Loader from '../../components/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FaRegTrashCan } from "react-icons/fa6";
import { CiWarning } from "react-icons/ci";

const Profile = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [subscriptonStatus, setSubscriptonStatus] = useState(false);
  const [profileData, setProfileData] = useState({ fullname: '', username: '', phone: '', bio: '' });

  const { logout } = useAuth();
  const userId = localStorage.getItem("userId");

  const fetchData = async () => {
    setLoadingData(true);
    setError(null);
    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoadingData(false);
      return;
    }
    try {
      const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/get/${userId}`, { withCredentials: true });
      const userData = userRes.data;
      setProfileData(userData);

      if (userData.username) {
        const subStatusRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptionstatus/${userData.username}`, { withCredentials: true });
        setSubscriptonStatus(subStatusRes.data.status);
      }
    } catch (error) {
      toast.error("Session expired or unauthorized. Please log in again.");
      setError("Failed to load profile or subscription status.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdate = async () => {
    if (!userId) return;
    setLoadingData(true);
    setError(null);
    setIsEdit(false);
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${userId}`, profileData, { withCredentials: true });
      setProfileData(res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubscription = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/subscribe`, { email: profileData.username, userId }, { withCredentials: true });
      toast.success(res.data.message || "Subscribed successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to subscribe.");
    }
  };

  const unsubscribe = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/unsubscribe`, { email: profileData.username, userId }, { withCredentials: true });
      toast.success("Unsubscribed successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to unsubscribe.");
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${userId}`, { withCredentials: true });
      toast.success("Account deleted successfully");
      logout();
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {loadingData ? (
        <Loader loading={loadingData} spinnerSize="md" spinnerColor="text-purple-500" message="Loading profile data..." />
      ) : error ? (
        <div className="text-red-600 text-center p-4">
          <p>Error: {error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Retry</button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <img className="w-32 h-32 rounded-full border-2 border-gray-300" src={assets.user_icon} alt="profile" />
            <div className="w-full mt-6 bg-white p-6 rounded-lg shadow">
              {['fullname', 'username', 'phone', 'bio'].map(field => (
                <div className="mb-4" key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  {isEdit ? (
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-400 p-2 rounded-lg "
                      value={profileData[field] || ''}
                      onChange={e => setProfileData(prev => ({ ...prev, [field]: e.target.value }))}
                    />
                  ) : (
                    <p className="mt-1 text-gray-800">{profileData[field]}</p>
                  )}
                </div>
              ))}

              {isEdit ? (
                <div className="flex gap-4">
                  <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsEdit(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setIsEdit(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
              )}

              <div className="mt-4">
                {subscriptonStatus ? (
                  <>
                    <input className="mr-2" type="checkbox" checked readOnly />
                    <span>Subscribed to latest blogs</span>
                    <br />
                    <button onClick={unsubscribe} className="mt-2 text-sm bg-red-500 text-white px-3 py-1 rounded">Unsubscribe</button>
                  </>
                ) : (
                  <button onClick={handleSubscription} className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded">Subscribe</button>
                )}
              </div>

              {/* Danger Zone */}
              <div className="mt-10 p-4 border border-red-500 bg-red-50 rounded">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <CiWarning /> Danger Zone
                </div>
                <p className="text-sm text-red-600 mt-2">Deleting your account is permanent and cannot be undone.</p>
                <button onClick={() => setShowDeleteModal(true)} className="mt-3 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded">
                  <FaRegTrashCan /> Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-bold text-red-600 mb-4">Confirm Account Deletion</h2>
                <p className="text-sm mb-2">Please type <span className="font-bold">DELETE</span> to confirm:</p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full rounded mb-4 border border-gray-400 p-2 rounded-lg text-base shadow-[0px_2px_0px_rgba(0,0,0,0.04)] placeholder:text-[14px] placeholder:font-normal active:border-[#1369E9] focus:border-[#1369E9] focus:shadow-inputShadow placeholder:text-[#A9A9AC] "
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button onClick={deleteAccount} disabled={deleteInput !== 'DELETE'} className={`px-4 py-2 rounded ${deleteInput === 'DELETE' ? 'bg-red-600 text-white' : 'bg-red-200 text-red-500 cursor-not-allowed'}`}>
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;