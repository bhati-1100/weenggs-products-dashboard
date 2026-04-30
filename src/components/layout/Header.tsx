import { Menu, Search, Bell, UserCircle2 } from "lucide-react";

type HeaderProps = {
  onToggleSidebar: () => void;
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
          Product Dashboard
        </h1>
      </div>

      {/* Center Search */}
      <div className="hidden w-full max-w-md px-6 md:block">
        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>

        <button className="rounded-full hover:bg-gray-100">
          <UserCircle2 size={34} className="text-gray-700" />
        </button>
      </div>
    </header>
  );
};

export default Header;
