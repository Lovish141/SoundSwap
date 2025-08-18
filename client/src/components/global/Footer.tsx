import { Button } from "@/components/ui/button";
import { Github, Twitter, Music, Heart, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 to-purple-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SoundSwap
              </span>
            </div>
            <p className="text-gray-300 text-lg mb-6 max-w-md">
              Transform your music experience with seamless playlist conversion from Spotify to YouTube.
            </p>
            <p className="text-purple-300 font-medium">
              Convert • Discover • Enjoy
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Home
              </Link>
              <Link to="/dashboard" className="block text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Dashboard
              </Link>
              <Link to="/profile" className="block text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Profile
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Help Center
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
            <div className="space-y-3">
              <Link to="#" className="block text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Contact Us
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-purple-400 transition-colors duration-200">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">Connect with us:</span>
              <div className="flex space-x-3">
                <Button 
                  variant="glass" 
                  size="icon-sm" 
                  className="text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button 
                  variant="glass" 
                  size="icon-sm" 
                  className="text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button 
                  variant="glass" 
                  size="icon-sm" 
                  className="text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button 
                  variant="glass" 
                  size="icon-sm" 
                  className="text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">
                © {new Date().getFullYear()} SoundSwap. Made with
              </span>
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm">
                for music lovers
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
