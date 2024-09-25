import { Button } from "@/components/ui/button";
import { Github, Twitter } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold text-gray-800">SoundSwap</span>
          <p className="text-gray-600 mt-2">Convert your music. Anytime. Anywhere.</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600">
            <Github className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600">
            <Twitter className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-600">
        <p>&copy; 2024 SoundSwap. All rights reserved.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
