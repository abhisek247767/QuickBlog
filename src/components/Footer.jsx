
import { assets } from "../assets/assets";
import {
  Linkedin,
  Twitter,
  Github,
  Mail,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-5 border-b border-gray-200">
          {/* Brand Section */}
          <div className="text-center lg:text-left max-w-lg">
            <img
              alt="QuickblogAI logo"
              className="w-32 sm:w-44 mx-auto lg:mx-0 mb-6"
              src={assets.logo || "/placeholder.svg"}
            />
            <p className="text-gray-600 leading-relaxed mb-6">
              QuickblogAI is an innovative application designed to empower users
              in their blogging journey. Create amazing content with the power
              of AI or craft your stories manually.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-500">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:abhisekroy169@gmail.com"
                className="text-sm hover:underline"
              >
                abhisekroy169@gmail.com
              </a>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Connect With Us
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm">
              Follow us on social media for the latest updates, tips, and
              inspiration for your blogging journey.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-6">
              <a
                href="https://www.linkedin.com/in/royabhisek247767/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gray-100 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
              >
                <Linkedin className="h-6 w-6 text-gray-600 group-hover:text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gray-100 rounded-full hover:bg-sky-500 transition-all duration-300 transform hover:scale-110"
              >
                <Twitter className="h-6 w-6 text-gray-600 group-hover:text-white" />
              </a>
              <a
                href="https://github.com/abhisek247767"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-gray-100 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-110"
              >
                <Github className="h-6 w-6 text-gray-600 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              Copyright 2025 © Abhisek Roy - All Rights Reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for bloggers worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
