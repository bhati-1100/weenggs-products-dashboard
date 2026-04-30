import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Content */}
      <div className="lg:ml-64">
        <Header onToggleSidebar={openSidebar} />

        <main className="min-h-[calc(100vh-128px)] p-4 md:p-6">{children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
