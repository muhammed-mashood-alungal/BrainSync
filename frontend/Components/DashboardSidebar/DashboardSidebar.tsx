// components/Sidebar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { icon: 'home', label: 'Dashboard', path: '/dashboard' },
    { icon: 'file-text', label: 'My Sessions', path: '/dashboard/sessions' },
    { icon: 'folder', label: 'Notes', path: '/dashboard/notes' },
    { icon: 'code', label: 'Codes', path: '/dashboard/code-snippets' },
    { icon: 'users', label: 'My Groups', path: '/dashboard/groups' },
    { icon: 'user', label: 'Profile', path: '/dashboard/profile' }
  ];
  
  return (
    <div className="w-72 min-h-screen bg-[#1E1E1E] border-r border-gray-800">
      <div className="p-6">
        
        <h1 className="text-3xl font-bold text-[#00D2D9]">Brain Sync</h1>
      </div>
      
      <div className="mt-6 px-4">
        {navItems.map((item) => (
          <Link 
            href={item.path} 
            key={item.path}
            className={`flex items-center gap-3 p-4 mb-2 rounded-md transition-colors ${
              pathname === item.path 
                ? 'bg-[#00D2D9] text-[#1E1E1E]' 
                : 'text-white hover:bg-gray-800'
            }`}
          >
            <span className={`flex items-center justify-center ${
              pathname === item.path ? 'text-[#1E1E1E]' : 'text-white'
            }`}>
              {item.icon === 'home' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              )}
              {item.icon === 'file-text' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              )}
              {item.icon === 'folder' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              )}
              {item.icon === 'users' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              )}
              {item.icon === 'user' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </span>
            <span className="text-base font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}