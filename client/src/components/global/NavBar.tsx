import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Music, User, LayoutDashboard, LogOut, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const logOut = () => {
    localStorage.removeItem("soundSwapUser");
    setIsLoggedIn(false);
    navigate("/");
  };
  
  useEffect(() => {
    const userData = localStorage.getItem("soundSwapUser");
    if (userData) {
      setIsLoggedIn(true);
    }
  });
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-soft border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold gradient-text bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  SoundSwap
                </span>
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="glass" className="group relative overflow-hidden">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Profile</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 glass backdrop-blur-xl border-white/20">
                    <DropdownMenuItem className="hover:bg-white/20 transition-colors duration-200">
                      <Link to="/profile" className="flex items-center space-x-3 w-full">
                        <User className="w-4 h-4 text-purple-600" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/20 transition-colors duration-200">
                      <Link to="/dashboard" className="flex items-center space-x-3 w-full">
                        <LayoutDashboard className="w-4 h-4 text-blue-600" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                      <button onClick={logOut} className="flex items-center space-x-3 w-full">
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Logout</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/signUp">
                  <Button variant="ghost" className="font-medium">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/signIn">
                  <Button variant="modern" className="font-medium shadow-lg">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 glass backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-b border-white/20 shadow-strong animate-slide-up">
          <div className="px-4 py-6 space-y-4">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">My Profile</span>
                </Link>
                <button 
                  onClick={() => {
                    logOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 w-full"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-600">Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <Link to="/signUp" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-medium">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/signIn" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="modern" className="w-full font-medium">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
