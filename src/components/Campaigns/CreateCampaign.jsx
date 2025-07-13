import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function CreateCampaign() {
  // State for managing form inputs.
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  // State for feedback messages (success/error).
  const [message, setMessage] = useState('');
  // State for loading indicator during form submission.
  const [loading, setLoading] = useState(false);
  // State to hold the currently authenticated user.
  const [user, setUser] = useState(null);

  const navigate = useNavigate(); // Hook to programmatically navigate.

  // Effect to check user authentication status and redirect if not logged in.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      // If no user is logged in, set a message and redirect to the home/auth page.
      if (!currentUser) {
        setMessage('Please log in to create a campaign.');
        navigate('/');
      }
    });
    return () => unsubscribe(); // Clean up the authentication listener.
  }, [navigate]); // `Maps` is a dependency to satisfy linting rules.

  // Handles the form submission for creating a new campaign.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission.
    setMessage(''); // Clear any previous messages.
    setLoading(true); // Set loading to true to disable the form and show indicator.

    // Basic client-side validation.
    if (!user) {
      setMessage('You must be logged in to create a campaign.');
      setLoading(false);
      return;
    }
    if (!title || !description || !goalAmount || !category) {
      setMessage('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    // Validate that goalAmount is a positive number.
    if (isNaN(parseFloat(goalAmount)) || parseFloat(goalAmount) <= 0) {
      setMessage('Goal amount must be a positive number.');
      setLoading(false);
      return;
    }

    try {
      // Add a new document to the 'campaigns' collection in Firestore.
      await addDoc(collection(db, 'campaigns'), {
        title: title,
        description: description,
        goalAmount: parseFloat(goalAmount), // Convert the string input to a number.
        currentAmount: 0, // All new campaigns start with zero donations.
        category: category,
        imageUrl: imageUrl, // Optional image URL provided by the user.
        creatorId: user.uid, // Store the Firebase User ID.
        creatorEmail: user.email, // Store the creator's email for easy identification.
        status: 'pending', // New campaigns are 'pending' admin approval.
        createdAt: serverTimestamp(), // Use Firestore's server timestamp for consistent timing.
      });

      setMessage('Campaign created successfully and is awaiting admin approval!');
      // Clear the form fields after successful submission.
      setTitle('');
      setDescription('');
      setGoalAmount('');
      setCategory('');
      setImageUrl('');
      // Optionally, navigate the user to another page, e.g., a list of campaigns.
      // navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      setMessage(`Failed to create campaign: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-strathmore-lightBlue to-strathmore-blue p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-strathmore-blue mb-6">
          Create New Campaign
        </h2>

        {/* Display feedback messages to the user. */}
        {message && (
          <p className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        {/* Render the form only if a user is logged in. */}
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Campaign Title:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue"
                placeholder="e.g., Student Aid for Research Trip"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue"
                placeholder="Describe your campaign in detail..."
                required
                disabled={loading}
              ></textarea>
            </div>

            <div>
              <label htmlFor="goalAmount" className="block text-gray-700 text-sm font-bold mb-2">
                Goal Amount (KES):
              </label>
              <input
                type="number"
                id="goalAmount"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue"
                placeholder="e.g., 50000"
                required
                min="0"
                step="any"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                Category:
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue"
                placeholder="e.g., Scholarships, Community Project, Peer Aid"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">
                Image URL (Optional):
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue"
                placeholder="https://example.com/campaign-image.jpg"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-strathmore-blue hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-strathmore-blue focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating Campaign...' : 'Submit Campaign'}
            </button>
          </form>
        ) : (
          // Message displayed if the user is not logged in.
          <p className="text-center text-gray-600">
            Please log in to create a campaign. You will be redirected shortly.
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateCampaign;