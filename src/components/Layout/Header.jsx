// src/components/Layout/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig.js';
import { signOut } from 'firebase/auth';

import logo from '../../assets/images/Strathmore-University-Logo-White.png'; // Ensure this path is correct


// IMPORTANT: Replace this with the actual UID of your admin user from Firebase Authentication
const ADMIN_UID = 'eeLVnYceVYSfGJCsxWPrD64D6762'; // CONFIRM THIS IS YOUR ADMIN UID

function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out from header.');
      navigate('/'); // Redirect to home/auth page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-strathmore-blue text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center"> {/* py-2 for compact header */}
        {/* Logo and Title Section */}
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Strathmore University Logo" className="h-16 mr-4" />
            <span className="text-white text-3xl md:text-4xl font-bold uppercase flex items-center">Community Portal</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="w-full md:w-auto">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            {/* Always visible links */}
            <Link to="/" className="text-white hover:text-gray-300 px-4 py-2 rounded-lg font-medium transition-all w-full md:w-auto text-center">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-gray-300 px-4 py-2 rounded-lg font-medium transition-all w-full md:w-auto text-center">
              About
            </Link>

            {user ? (
              // Logged In User Navigation
              <>
                <Link to="/create-campaign" className="bg-strathmore-gold hover:bg-yellow-600 text-strathmore-blue px-4 py-2 rounded-lg font-medium transition-all w-full md:w-auto text-center">
                  Create Campaign
                </Link>
                <Link to="/campaigns" className="bg-white hover:bg-gray-100 text-strathmore-blue px-4 py-2 rounded-lg font-medium transition-all w-full md:w-auto text-center">
                  View Campaigns
                </Link>
                {user.uid === ADMIN_UID && (
                  <Link to="/admin" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all w-full md:w-auto text-center">
                    Admin
                  </Link>
                )}
                <span className="text-sm text-gray-200 px-2 py-2 w-full md:w-auto text-center">
                  Welcome, <span className="font-semibold">{user.displayName || user.email}</span>
                </span>
                <button onClick={handleLogout} className="border border-white hover:bg-white hover:text-strathmore-blue text-white px-4 py-2 rounded-lg transition-all w-full md:w-auto">
                  Logout
                </button>
              </>
            ) : (
              // Not Logged In Navigation (Updated link to /login)
              <Link to="/login" className="bg-strathmore-gold hover:bg-yellow-600 text-strathmore-blue px-4 py-2 rounded-lg font-medium block transition-all w-full text-center">
                Login / Register
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
