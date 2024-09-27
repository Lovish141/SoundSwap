import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Music, User, LayoutDashboard, LogOut } from "lucide-react"; // Importing icons from Lucide, which is commonly used with ShadCN
import { Button } from "@/components/ui/button";
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate=useNavigate();
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
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
          <div className=" flex items-center">
          <Music className="w-8 h-8 text-purple-600 mr-2" />
          <span className="text-xl font-bold text-gray-800">SoundSwap</span>
          </div>
          </Link>
        </div>
        <div className="space-x-4">

          {isLoggedIn && (
           
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="default" className="bg-purple-600 text-white hover:bg-purple-700">
                    <span>Profile</span>
                    <User className="w-5 h-5" />{" "}
                    {/* User icon instead of profile image */}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User className="w-4 h-4" /> {/* Icon for profile */}
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                      
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      onClick={logOut}
                      className="flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" /> {/* Icon for logout */}
                      <span>Logout</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

          )}

          {!isLoggedIn && (
             <Link to="/signIn"><Button variant="default" className="bg-purple-600 text-white hover:bg-purple-700">Login</Button></Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
