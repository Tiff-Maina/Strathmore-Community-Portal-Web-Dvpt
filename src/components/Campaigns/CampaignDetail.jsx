import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebaseConfig.js';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon, EmailIcon } from 'react-share';
import { QRCode } from 'react-qr-code';

function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [donationAmount, setDonationAmount] = useState(100);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [donating, setDonating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Effect to set the share URL and listen for authentication state changes.
  useEffect(() => {
    setShareUrl(window.location.href);

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth(); // Cleanup the auth listener.
  }, []);

  // Effect to fetch campaign details when the component mounts or the ID changes.
  useEffect(() => {
    if (!id) {
      setError("No campaign ID provided.");
      setLoading(false);
      return;
    }

    const fetchCampaign = async () => {
      setLoading(true);
      setError('');
      try {
        const docRef = doc(db, 'campaigns', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Campaign not found.");
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError(`Failed to load campaign: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  // Handles the donation process, including M-Pesa simulation.
  const handleDonate = async (paymentMethod) => {
    if (!user) {
      setDonationMessage('Please log in to donate.');
      return;
    }
    if (isNaN(parseFloat(donationAmount)) || parseFloat(donationAmount) <= 0) {
      setDonationMessage('Please enter a valid positive donation amount.');
      return;
    }

    if (paymentMethod === 'mpesa' && !phoneNumber) {
      setDonationMessage('Please enter your M-Pesa phone number.');
      return;
    }

    setDonating(true);
    setDonationMessage('');

    try {
      const amountToAdd = parseFloat(donationAmount);

      if (paymentMethod === 'mpesa') {
        setDonationMessage(`Initiating M-Pesa STK Push to ${phoneNumber} for KES ${amountToAdd.toLocaleString()}... Please check your phone.`);
        // Simulate M-Pesa STK Push delay.
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate M-Pesa transaction success/failure.
        const isMpesaSuccess = Math.random() < 0.9; // 90% success rate for demonstration.
        if (!isMpesaSuccess) {
          setDonationMessage('M-Pesa transaction failed or timed out. Please try again.');
          setDonating(false);
          return;
        }
        setDonationMessage(`M-Pesa transaction successful! Updating campaign...`);
      }

      // Update the campaign's current amount in Firestore.
      const campaignRef = doc(db, 'campaigns', id);
      await updateDoc(campaignRef, {
        currentAmount: increment(amountToAdd)
      });

      setDonationMessage(`Successfully donated KES ${amountToAdd.toLocaleString()}! Thank you.`);
      // Fetch updated campaign data to reflect the new amount.
      const updatedDocSnap = await getDoc(campaignRef);
      if (updatedDocSnap.exists()) {
        setCampaign({ id: updatedDocSnap.id, ...updatedDocSnap.data() });
      }
      setDonationAmount(100); // Reset donation amount.
      setPhoneNumber(''); // Clear phone number.
    } catch (err) {
      console.error("Error donating:", err);
      setDonationMessage(`Failed to process donation: ${err.message}`);
    } finally {
      setDonating(false);
    }
  };

  // Function to copy the current campaign link to clipboard.
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  // Display loading state.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-strathmore-lightBlue">
        <p className="text-lg text-strathmore-blue">Loading campaign details...</p>
      </div>
    );
  }

  // Display error message if campaign loading fails.
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-100 p-4">
        <p className="text-lg text-red-700 mb-4">{error}</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  // Display message if campaign data is not available.
  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen bg-strathmore-lightBlue">
        <p className="text-lg text-strathmore-blue">Campaign data not available.</p>
      </div>
    );
  }

  // Calculate donation progress.
  const progress = Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100 || 0);
  const shareTitle = `Support ${campaign.title} on Strathmore Community Portal`;

  return (
    <div className="min-h-screen bg-strathmore-lightBlue p-4">
      <div className="container mx-auto py-8 max-w-3xl">
        <button
          onClick={() => navigate('/campaigns')}
          className="mb-6 bg-strathmore-blue hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-strathmore-blue focus:ring-opacity-50"
        >
          &larr; Back to All Campaigns
        </button>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {campaign.imageUrl && (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-64 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x300/cccccc/ffffff?text=No+Image`; }}
            />
          )}
          {!campaign.imageUrl && (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
              No Image Available
            </div>
          )}
          <div className="p-8">
            <h1 className="text-4xl font-extrabold text-strathmore-blue mb-3">{campaign.title}</h1>
            <p className="text-md text-gray-600 mb-4">{campaign.category}</p>
            <p className="text-gray-800 text-lg leading-relaxed mb-6">{campaign.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-strathmore-lightBlue p-4 rounded-lg shadow-inner">
                <p className="text-gray-700 text-sm font-medium">Goal Amount:</p>
                <p className="text-2xl font-bold text-strathmore-blue">KES {campaign.goalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow-inner">
                <p className="text-gray-700 text-sm font-medium">Amount Raised:</p>
                <p className="text-2xl font-bold text-green-800">KES {campaign.currentAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-strathmore-blue h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mb-6">{progress.toFixed(2)}% of goal reached</p>

            {/* Share Campaign Section */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-2xl font-bold text-strathmore-blue mb-4">Share This Campaign</h3>
              <p className="text-gray-600 mb-4">Help spread the word to support this cause!</p>

              <div className="flex flex-wrap gap-4 items-center mb-4">
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>

                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>

                <EmailShareButton url={shareUrl} subject={shareTitle} body="Check out this campaign:">
                  <EmailIcon size={40} round />
                </EmailShareButton>

                <button
                  onClick={copyToClipboard}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy Link
                </button>
              </div>

              {/* QR Code Section */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Share via QR Code:</p>
                <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                  <QRCode
                    value={shareUrl}
                    size={128}
                    bgColor="#ffffff"
                    fgColor="#1e40af"  // Strathmore blue
                    level="Q"
                  />
                  <p className="text-xs text-center mt-2 text-gray-500">
                    Scan to view campaign
                  </p>
                </div>
              </div>
            </div>

            {/* Donation Section */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-2xl font-bold text-strathmore-blue mb-4">Make a Donation</h3>
              {donationMessage && (
                <p className={`text-center mb-4 ${donationMessage.includes('Successfully') ? 'text-green-600' : (donationMessage.includes('Initiating') ? 'text-blue-500' : 'text-red-500')}`}>
                  {donationMessage}
                </p>
              )}
              {user ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="donationAmount" className="block text-gray-700 text-sm font-bold mb-2">
                      Donation Amount (KES):
                    </label>
                    <input
                      type="number"
                      id="donationAmount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue"
                      placeholder="Enter amount"
                      min="1"
                      step="any"
                      disabled={donating}
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                      M-Pesa Phone Number (e.g., 2547XXXXXXXX):
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue"
                      placeholder="2547XXXXXXXX"
                      pattern="^2547[0-9]{8}$"
                      disabled={donating}
                    />
                  </div>

                  <button
                    onClick={() => handleDonate('mpesa')}
                    className="bg-strathmore-gold hover:bg-yellow-600 text-strathmore-blue font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-strathmore-gold focus:ring-opacity-50"
                    disabled={donating}
                  >
                    {donating ? 'Processing M-Pesa...' : 'Pay with M-Pesa'}
                  </button>
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  Please log in to make a donation.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetail;