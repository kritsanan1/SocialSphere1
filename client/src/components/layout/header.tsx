import { Menu, Bell, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

export function Header({ title, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="bg-slate-800 shadow-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white" data-testid="text-page-title">
            {title}
          </h1>
          
          {/* Mobile menu button */}
          <button 
            onClick={onMobileMenuToggle}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              data-testid="button-get-stats"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Get Stats</span>
            </Button>
            <Button 
              variant="secondary"
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors duration-200"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
