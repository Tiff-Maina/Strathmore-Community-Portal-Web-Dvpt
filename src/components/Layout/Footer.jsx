// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="mt-auto"> {/* This pushes footer to bottom */}
      <div className="border-t border-gray-300 mt-8"></div> {/* Separation line */}
      <footer className="bg-[#012169] text-white py-8 px-4"> {/* Using exact Strathmore blue */}
        <div className="container mx-auto">
           {/* University Name at the top of the footer */}
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Strathmore University
          </h2>

          {/* Main footer content with columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            {/* Column 1 */}
            <div>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:text-yellow-400">Community Portal</Link></li>
                <li><Link to="https://strathmore.edu/communication-office/" className="hover:text-yellow-400">Brand Guidelines</Link></li>
                <li><Link to="https://strathmore.edu/new-strathmore/wp-content/uploads/2023/06/Draft-Lecturers-Guide-for-Online-Learning.pdf" className="hover:text-yellow-400">Lectures Guide for Online Learning</Link></li>
                <li><Link to="https://strathmore.edu/graduation-policy/" className="hover:text-yellow-400">Graduation Policy</Link></li>
                <li><Link to="https://strathmore.edu/new-strathmore/wp-content/uploads/2023/06/Draft-SU-Online-Live-Class-Regulations-lecturers.pdf" className="hover:text-yellow-400">Lecturers Regulations for Live Video Class</Link></li>
                <li><Link to="https://strathmore.edu/new-strathmore/wp-content/uploads/2023/06/Draft-SU-Online-Live-Class-Regulations-students.pdf" className="hover:text-yellow-400">Students Regulations for Live Video</Link></li>
                <li><Link to="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://strathmore.edu/wp-content/uploads/2023/06/sedgwick_medical_providers_sep_2019.pdf" className="hover:text-yellow-400">Strathmore Medical Service Providers</Link></li>
                <li><Link to="https://icts.strathmore.edu/" className="hover:text-yellow-400">ICT Services</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <ul className="space-y-2">
                <li><Link to="https://sagana.strathmore.edu/" className="hover:text-yellow-400">Sagana</Link></li>
                <li><Link to="https://elearning.strathmore.edu/login/" className="hover:text-yellow-400">Students' E-Learning System</Link></li>
                <li><Link to="https://su-sso.strathmore.edu/cas-prd/" className="hover:text-yellow-400">AMS Students' Module</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <ul className="space-y-2">
                <li><Link to="https://strathmore.edu/vice-chancellors-blog/" className="hover:text-yellow-400">Vice Chancellor's Blog</Link></li>
              </ul>  
            </div>

            {/* Column 4 */}
            <div>
              {/* Empty column as per design */}
              <ul className="space-y-2">
                <li><Link to="https://strathmore.edu/faqs/" className="hover:text-yellow-400">FAQs</Link></li>
              </ul>  
            </div>
          </div>

          {/* Horizontal line separator */}
          <hr className="border-t border-gray-500 my-4" />

          {/* Bottom links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
            <Link to="#" className="hover:text-yellow-400">University Relations & Communications</Link>
            <Link to="#" className="hover:text-yellow-400">Data Privacy Policy</Link>
            <Link to="#" className="hover:text-yellow-400">Legal Notice</Link>
            <Link to="#" className="hover:text-yellow-400">Whistle Blowing Platform</Link>
            <Link to="#" className="hover:text-yellow-400">Contact Us</Link>
            <Link to="#" className="hover:text-yellow-400">Cookie Policy (EU)</Link>
          </div>

          {/* Copyright */}
          <div className="text-center pt-4 border-t border-gray-500">
            <p>© Strathmore - All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;