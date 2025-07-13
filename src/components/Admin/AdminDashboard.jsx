import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig.js';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

function AdminDashboard() {
  // State variables for managing campaign data, loading status, errors, and user information
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // The UID for the administrator account. This should ideally be stored more securely, e.g., in environment variables.
  const ADMIN_UID = 'eeLVnYceVYSfGJCsxWPrD64D6762';

  // Effect hook to listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Redirect if the current user is not the admin
      if (!currentUser || currentUser.uid !== ADMIN_UID) {
        setError('Access Denied: You must be an administrator to view this page.');
        setTimeout(() => navigate('/'), 3000); // Redirect to home after 3 seconds
      }
    });
    return () => unsubscribeAuth(); // Cleanup the auth listener
  }, [navigate, ADMIN_UID]);

  // Effect hook to fetch pending campaigns from Firestore
  useEffect(() => {
    // Fetch campaigns only if the user is logged in and is the admin
    if (user && user.uid === ADMIN_UID) {
      // Create a query to get campaigns with 'pending' status
      const q = query(collection(db, 'campaigns'), where('status', '==', 'pending'));

      // Set up a real-time listener for the query
      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const campaignsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPendingCampaigns(campaignsData);
        setError('');
        setLoading(false);
      }, (err) => {
        console.error('Error fetching pending campaigns:', err);
        setError('Failed to load pending campaigns. Please try again.');
        setLoading(false);
      });
      return () => unsubscribeFirestore(); // Cleanup the Firestore listener
    } else if (!loading && (!user || user.uid !== ADMIN_UID)) {
        // Clear campaigns if not admin and not loading
        setPendingCampaigns([]);
    }
  }, [user, loading, ADMIN_UID]);

  // Handler to approve a campaign
  const handleApprove = async (campaignId) => {
    if (!user || user.uid !== ADMIN_UID) {
      setError('Permission denied to approve campaigns.');
      return;
    }
    setLoading(true);
    try {
      const campaignRef = doc(db, 'campaigns', campaignId);
      await updateDoc(campaignRef, {
        status: 'approved' // Change status to 'approved'
      });
      setError('');
    } catch (err) {
      console.error('Error approving campaign:', err);
      setError(`Failed to approve campaign: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler to reject and delete a campaign
  const handleReject = async (campaignId) => {
    if (!user || user.uid !== ADMIN_UID) {
      setError('Permission denied to reject campaigns.');
      return;
    }
    setLoading(true);
    try {
      const campaignRef = doc(db, 'campaigns', campaignId);
      await deleteDoc(campaignRef); // Delete the campaign document
      setError('');
    } catch (err) {
      console.error('Error rejecting campaign:', err);
      setError(`Failed to reject campaign: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Display loading screen while data is being fetched or processed
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-strathmore-lightBlue">
        <p className="text-lg text-strathmore-blue">Loading admin dashboard...</p>
      </div>
    );
  }

  // Display access denied message if not an admin
  if (error && (!user || user.uid !== ADMIN_UID)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
          <h2 className="text-3xl font-extrabold text-red-800 mb-4">Access Denied!</h2>
          <p className="text-lg text-red-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-strathmore-blue hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-strathmore-lightBlue p-4">
      <div className="container mx-auto py-8">
        <h2 className="text-4xl font-extrabold text-center text-strathmore-blue mb-8">
          Admin Dashboard - Pending Campaigns
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {pendingCampaigns.length === 0 ? (
          <p className="text-center text-gray-600 text-xl mt-10">
            No pending campaigns to review. All clear!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
              >
                {/* Display campaign image or a placeholder if no image */}
                {campaign.imageUrl && (
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x200/cccccc/ffffff?text=No+Image`; }}
                  />
                )}
                {!campaign.imageUrl && (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{campaign.category}</p>
                  <p className="text-gray-700 text-base mb-4 line-clamp-3">{campaign.description}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Created by: <span className="font-semibold">{campaign.creatorEmail}</span>
                    {campaign.createdAt && ` on ${new Date(campaign.createdAt.toDate()).toLocaleDateString()}`}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Goal: KES {campaign.goalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Current Status: <span className="font-semibold text-orange-500">{campaign.status.toUpperCase()}</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    {/* Action buttons for approving and rejecting campaigns */}
                    <button
                      onClick={() => handleApprove(campaign.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      disabled={loading}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(campaign.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      disabled={loading}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;