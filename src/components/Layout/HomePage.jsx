import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-strathmore-lightBlue text-gray-800">
      {/* Hero section with background image and overlay */}
      <section className="bg-hero-pattern bg-cover bg-center bg-no-repeat text-white py-20 px-4 text-center relative">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="relative z-10"> {/* Ensure content is above the overlay */}
          {/* Changed text color to white */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Empower Change in Our Community</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Browse and support campaigns led by students, staff, and faculty.</p>
          <Link to="/create-campaign" className="bg-strathmore-gold hover:bg-yellow-600 text-strathmore-blue font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 inline-block">
            Start a Campaign
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="py-16 px-4 bg-white shadow-lg rounded-xl mx-auto max-w-6xl -mt-10 relative z-10">
        <h3 className="text-3xl font-bold text-center text-strathmore-blue mb-10">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-strathmore-lightBlue rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-strathmore-blue mb-2">Create</h4>
            <p className="text-gray-700">Submit your fundraising idea with goals and duration.</p>
          </div>
          <div className="p-6 bg-strathmore-lightBlue rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-strathmore-blue mb-2">Share</h4>
            <p className="text-gray-700">Promote your campaign via campus networks.</p>
          </div>
          <div className="p-6 bg-strathmore-lightBlue rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-strathmore-blue mb-2">Receive</h4>
            <p className="text-gray-700">Track donations and engage with supporters.</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 text-center">
        <p className="text-center text-gray-600 text-xl">
          Use the "View Campaigns" link in the header to browse all campaigns.
        </p>
      </section>

      <section className="py-12 px-4">
        <h3 className="text-3xl font-bold text-center text-strathmore-blue mb-8">Featured Campaigns</h3>
        <p className="text-center text-gray-600 text-xl">
          No featured campaigns at the moment. Check back later or view all campaigns!
        </p>
        <div className="text-center mt-4">
          <Link to="/campaigns" className="bg-strathmore-blue hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 inline-block">
            View All Campaigns
          </Link>
        </div>
      </section>

      <section id="create-section" className="py-16 px-4 bg-strathmore-blue text-white text-center">
        {/* Added text-white to the heading and paragraph */}
        <h3 className="text-3xl font-bold mb-4 text-white">Ready to Make an Impact?</h3>
        <p className="text-lg mb-8 text-white">Click below to start your own fundraising campaign.</p>
        <Link to="/create-campaign" className="bg-strathmore-gold hover:bg-yellow-600 text-strathmore-blue font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 inline-block">
          Create Campaign
        </Link>
      </section>
    </div>
  );
}
