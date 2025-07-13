// src/components/AboutPage.jsx

import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-strathmore-lightBlue p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-extrabold text-strathmore-blue text-center mb-6">
          About the Community Fundraising Portal
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The Strathmore Community Fundraising Portal is designed to centralize all charitable campaigns
          across the Strathmore University community. Students, staff, faculty, and affiliated NGOs can
          create, share, and support causes in one unified platform. Our mission is to foster a culture
          of giving and transparency, enabling contributors to see the direct impact of their donations.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          This portal offers features such as secure payment
          integration, campaign updates, progress tracking, and more. We aim to simplify fundraising
          workflows and empower every member of Strathmore University to make a difference.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          This project demonstrates a functional prototype for the Strathmore University Community Fundraising Portal,
          showcasing user authentication, campaign creation and management, donation processing, and administrative oversight.
        </p>
      </div>
    </div>
  );
}
