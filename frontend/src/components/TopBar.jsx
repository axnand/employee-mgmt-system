import { useState, useRef } from "react";
import { User, Settings, LogOut, Search, BellRingIcon, User2 } from "lucide-react";
import Link from "next/link";
import { useOutsideClick } from "@/hooks/useOutsideClick";
export function TopBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  useOutsideClick(dropdownRef, () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  });

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center gap-6 h-16">
          <div className="flex mr-8 w-72">
            <div className="flex items-center w-full">
            <div className="flex items-center p-1 rounded-full bg-white   text-[13px] border relative w-full">
          <input
            type="text"
            placeholder="Search by School, Employee..."
            className="flex-grow px-3 py-[3px] text-gray-700 placeholder-gray-500 bg-transparent outline-none rounded-full"
          />
          <button className="p-2 rounded-full bg-[#377DFF] text-white hover:bg-[#3f68b4] focus:outline-none flex transition">
          <Search className="w-4 h-4" style={{ strokeWidth: 2.6 }} />

          </button>
        </div>
            </div>
          </div>
          <div className="flex items-center justify-center p-2 border hover:bg-[#377DFF] group cursor-pointer transition rounded-full"><BellRingIcon className="w-4 h-4 group-hover:text-white"/></div>
          
          <div className="flex items-center">
            {/* Dropdown Button */}
            <div className="relative ">
              <button
                onClick={toggleDropdown}
                className="relative p-[6px] rounded-full group bg-gray-400 hover:bg-[#377DFF] transition  border flex items-center justify-center"
              >
                <User2 className="w-5 h-5 text-white group-hover:text-white transition"/>
                
              </button>

              {/* Dropdown Menu */}
              <div
              ref={dropdownRef}
                className={`absolute right-0 w-56 mt-2 bg-white border shadow-lg rounded-md ${
                  dropdownVisible
                    ? "transform translate-y-0 opacity-100"
                    : "transform translate-y-4 opacity-0 hidden"
                } transition-all duration-300 ease-out`}
              >
                <div className="p-4">
                  <p className="text-sm font-medium leading-none mb-1">Sahil Kumar</p>
                  <p className="text-xs text-muted-foreground">User Id: 3758390</p>
                </div>
                <div className="border-t">
                  <ul>
                    <li>
                      <Link href="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
