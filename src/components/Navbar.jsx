import React, { useState } from 'react';
    import { Link, NavLink } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Menu, X, Sun, Moon, BookOpen, Users, Newspaper, Phone, ShieldCheck, Info, ChevronDown, Eye, Target, UserSquare } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useTheme } from '@/components/ThemeProvider';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu';

    const mainNavLinks = [
      { href: '/', label: 'Beranda', icon: BookOpen },
      { href: '/jurusan', label: 'Jurusan', icon: Users },
      { href: '/postingan', label: 'Postingan', icon: Newspaper },
      { href: '/kontak', label: 'Kontak', icon: Phone },
    ];

    const profileSubLinks = [
      { href: '/profil/visi-misi', label: 'Visi Misi', icon: Target },
      { href: '/profil/tentang-kami', label: 'Tentang Kami', icon: Info },
      { href: '/profil/guru-staff', label: 'Guru & Staff', icon: UserSquare },
    ];
    
    const adminLink = { href: '/admin', label: 'Admin', icon: ShieldCheck };

    const NavItem = ({ href, label, icon: Icon, onClick, isDropdown = false, isActiveLink }) => {
      const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out flex items-center space-x-1 ${
        isActiveLink ? 'bg-white text-indigo-600 shadow-md' : 'text-purple-100 hover:bg-purple-500 hover:text-white'
      }`;

      if (isDropdown) {
        return (
          <div className={linkClasses} onClick={onClick}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        );
      }

      return (
        <NavLink to={href} className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out flex items-center space-x-1 ${
            isActive ? 'bg-white text-indigo-600 shadow-md' : 'text-purple-100 hover:bg-purple-500 hover:text-white'
          }`
        } onClick={onClick}>
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </NavLink>
      );
    };
    
    const MobileNavItem = ({ href, label, icon: Icon, onClick, isDropdown = false, subLinks, closeMenu }) => {
      const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
      
      const handleMainClick = () => {
        if (isDropdown) {
          setIsSubMenuOpen(!isSubMenuOpen);
        } else {
          onClick();
        }
      };

      return (
        <>
          <NavLink
            to={isDropdown ? '#' : href}
            onClick={handleMainClick}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out flex items-center space-x-2 justify-between
              ${isActive && !isDropdown ? 'bg-white text-indigo-600 shadow-md' : 'text-purple-100 hover:bg-purple-500 hover:text-white'}`
            }
          >
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </div>
            {isDropdown && <ChevronDown className={`h-5 w-5 transform transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`} />}
          </NavLink>
          {isDropdown && isSubMenuOpen && (
            <div className="pl-8 space-y-1 py-1">
              {subLinks.map(subLink => (
                <NavLink
                  key={subLink.href}
                  to={subLink.href}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out flex items-center space-x-2
                    ${isActive ? 'bg-purple-100 text-indigo-700' : 'text-purple-200 hover:bg-purple-600 hover:text-white'}`
                  }
                >
                  <subLink.icon className="h-4 w-4" />
                  <span>{subLink.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </>
      );
    };


    const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);
      const { theme, setTheme } = useTheme();

      const toggleNavbar = () => {
        setIsOpen(!isOpen);
      };
      
      const closeMobileMenu = () => setIsOpen(false);

      const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      };

      return (
        <nav className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center space-x-2 text-white">
                <img  alt="SMK Budi Mulia Karawang Logo" className="h-10 w-10 rounded-full border-2 border-white shadow-md" src="https://images.unsplash.com/photo-1685722624202-c84f60443677" />
                <span className="text-2xl font-bold tracking-tight">SMK Budi Mulia Karawang</span>
              </Link>

              <div className="hidden md:flex items-center space-x-2">
                {mainNavLinks.map((link) => (
                  <NavItem key={link.href} {...link} />
                ))}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-purple-100 hover:bg-purple-500 hover:text-white flex items-center space-x-1">
                      <Info className="h-4 w-4" />
                      <span>Profil</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md mt-1">
                    {profileSubLinks.map((subLink) => (
                      <DropdownMenuItem key={subLink.href} asChild>
                        <NavLink
                          to={subLink.href}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md
                            ${isActive ? 'font-semibold text-indigo-600 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200'}`
                          }
                        >
                          <subLink.icon className="h-4 w-4" />
                          <span>{subLink.label}</span>
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <NavItem {...adminLink} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-purple-100 hover:bg-purple-500 hover:text-white"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </div>

              <div className="md:hidden flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-purple-100 hover:bg-purple-500 hover:text-white mr-2"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={toggleNavbar}
                  variant="ghost"
                  size="icon"
                  className="text-purple-100 hover:bg-purple-500 hover:text-white"
                  aria-label="Toggle navigation"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-indigo-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {mainNavLinks.map((link) => (
                <MobileNavItem key={link.href} {...link} onClick={closeMobileMenu} closeMenu={closeMobileMenu}/>
              ))}
              <MobileNavItem 
                href="#" 
                label="Profil" 
                icon={Info} 
                isDropdown 
                subLinks={profileSubLinks}
                onClick={() => {}} 
                closeMenu={closeMobileMenu}
              />
              <MobileNavItem {...adminLink} onClick={closeMobileMenu} closeMenu={closeMobileMenu}/>
            </div>
          </motion.div>
        </nav>
      );
    };

    export default Navbar;