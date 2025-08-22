import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Upload, 
  Calendar, 
  MessageCircle, 
  MessageSquare, 
  Zap,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navigation = [
  { name: 'Social Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Connect Socials', href: '/connect-socials', icon: LinkIcon },
  { name: 'Upload Posts', href: '/upload-posts', icon: Upload },
  { name: 'Content Calendar', href: '/content-calendar', icon: Calendar },
  { name: 'Social Messages', href: '/social-messages', icon: MessageCircle },
  { name: 'Social Comments', href: '/social-comments', icon: MessageSquare },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800 border-r border-slate-700">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SocialAI
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
                data-testid={`nav-${item.href.replace('/', '')}`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 flex bg-slate-700 p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.firstName || user?.username}
                </p>
                <p className="text-xs text-slate-300">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-white text-xs"
              data-testid="button-logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
