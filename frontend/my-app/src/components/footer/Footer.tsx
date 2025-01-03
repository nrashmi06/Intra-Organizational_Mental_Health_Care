import React from 'react';
import Link from "next/link";
import { Facebook, Instagram, Linkedin} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white relative z-20 pt-12">
      <div className="container mx-auto px-6 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
              SerenitySphere
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">+91 1234567891</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">SerenitySphere@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/t&c" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Connect With Us</h3>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors group"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-center">
            Nitte, State Highway 1, Karkal, Karnataka 574110
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Copyright © 2024 Agencies Private Limited
        </div>
      </div>
    </footer>
  );
};

export default Footer;