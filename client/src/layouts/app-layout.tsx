import { useState, useContext } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthContext } from "@/App";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 ml-0 md:ml-64 pt-16">
          {children}
        </main>
      </div>
      
      <Footer />

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
