import React from "react";
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaClock,
  FaInfoCircle,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaGraduationCap className="text-blue-500 text-2xl" />
              <span className="text-xl font-bold">EduTech</span>
              <span className="text-blue-400 text-xs">.com</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your complete portal to online education. Access courses, resources, and learning materials with ease and flexibility.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@edutech.com"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaEnvelope className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/admin/login"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-blue-500" />
              Our Services
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/courses"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  All Courses
                </a>
              </li>
              <li>
                <a
                  href="/my-learning"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  My Learning
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Documentation
                </a>
              </li>
              
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-500" />
              Contact & Info
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <FaClock className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>24/7 Learning Support</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-blue-500 flex-shrink-0" />
                <span>support@edutech.com</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-blue-500 flex-shrink-0" />
                <span>Support Hotline: 1-800-EDU-TECH</span>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} EduTech.com. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-4 md:mt-0">
            Online Education Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;