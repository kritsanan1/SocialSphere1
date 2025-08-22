import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 lg:pl-64">
        <Header title={title} onMobileMenuToggle={toggleMobileMenu} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
