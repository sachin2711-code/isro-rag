import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050A0F] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-light text-white/10 mb-4">404</h1>
        <h2 className="text-2xl font-light text-white mb-2">Page Not Found</h2>
        <p className="text-white/40 text-sm mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved. Return to the Indra Climate Twin dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft size={16} className="mr-1.5" /> Go Back
          </Button>
          <Link to="/">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
              <Home size={16} className="mr-1.5" /> Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
