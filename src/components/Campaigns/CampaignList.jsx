// src/components/Campaigns/CampaignList.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig.js'; // Import Firestore instance
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'; // Firestore functions
import { Link } from 'react-router-dom'; // For linking to individual campaign pages (future)

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Create a query to fetch campaigns
    // For now, we'll fetch all campaigns. Later, we might add:
    // query(collection(db, 'campaigns'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'))
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc')); // Order by creation time, newest first

    // Set up a real-time listener for campaigns
    // onSnapshot automatically updates the component when data changes in Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id, // Document ID is important for unique identification
        ...doc.data() // All other fields from the document
      }));
      setCampaigns(campaignsData);
      setLoading(false);
      console.log("Fetched campaigns:", campaignsData); // Debugging log
    }, (err) => {
      console.error("Error fetching campaigns:", err);
      setError("Failed to load campaigns. Please try again.");
      setLoading(false);
    });

    // Cleanup function: unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs only once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-strathmore-lightBlue">
        <p className="text-lg text-strathmore-blue">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <p className="text-lg text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-strathmore-lightBlue p-4">
      <div className="container mx-auto py-8">
        <h2 className="text-4xl font-extrabold text-center text-strathmore-blue mb-8">
          Active Campaigns
        </h2>

        {campaigns.length === 0 ? (
          <p className="text-center text-gray-600 text-xl mt-10">
            No campaigns found. Be the first to create one!
            <Link to="/create-campaign" className="text-strathmore-blue hover:underline ml-2">
              Create Campaign
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition duration-300 ease-in-out transform hover:scale-105"
              >
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
                  <div className="flex justify-between items-center text-gray-800 font-semibold mb-2">
                    <span>Goal: KES {campaign.goalAmount.toLocaleString()}</span>
                    <span>Raised: KES {campaign.currentAmount.toLocaleString()}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-strathmore-blue h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Status: <span className={`font-semibold ${campaign.status === 'approved' ? 'text-green-600' : 'text-orange-500'}`}>{campaign.status.toUpperCase()}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Created by: {campaign.creatorEmail}
                    {campaign.createdAt && ` on ${new Date(campaign.createdAt.toDate()).toLocaleDateString()}`}
                  </p>
                  {/* Link to individual campaign detail page (will be implemented next) */}
                  <Link
                    to={`/campaign/${campaign.id}`} // Dynamic route for individual campaign
                    className="block text-center bg-strathmore-gold hover:bg-yellow-600 text-strathmore-blue font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-strathmore-gold focus:ring-opacity-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignList;
