import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  LogOut, 
  BookOpen, 
  Users, 
  ScrollText, 
  School,
  Briefcase,
  Cpu,
  Code 
} from 'lucide-react';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import JurusanManager from '@/components/admin/JurusanManager';
import PostinganManager from '@/components/admin/PostinganManager';
import TeacherStaffManager from '@/components/admin/TeacherStaffManager';
import PrincipalsManager from '@/components/admin/PrincipalsManager';

export const initialJurusanIcons = { Briefcase, Cpu, Code };

export const getIconName = (IconComponent) => {
  return Object.keys(initialJurusanIcons).find(key => initialJurusanIcons[key] === IconComponent) || 'Briefcase';
};

const menuItems = [
  { id: 'jurusan', label: 'Kelola Jurusan', icon: BookOpen },
  { id: 'postingan', label: 'Kelola Postingan', icon: ScrollText },
  { id: 'staff', label: 'Kelola Guru & Staff', icon: Users },
  { id: 'principals', label: 'Kelola Kepala Sekolah', icon: School }
];

const AdminPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [jurusanList, setJurusanList] = useState([]);
  const [postinganList, setPostinganList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('jurusan');

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(authStatus);
    if (authStatus) {
      loadData();
    }
  }, []);

  const loadData = () => {
    const storedJurusan = JSON.parse(localStorage.getItem('jurusanData') || '[]');
    setJurusanList(storedJurusan.map(j => ({...j, icon: initialJurusanIcons[j.icon] || Briefcase })));
    
    const storedPostingan = JSON.parse(localStorage.getItem('postinganData') || '[]');
    setPostinganList(storedPostingan);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAdmin', 'true');
    loadData();
    toast({
      title: "Login Berhasil",
      description: "Selamat datang, Admin!",
      duration: 3000, // Add duration
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdmin');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari halaman admin.",
      duration: 3000, // Add duration
    });
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'jurusan':
        return <JurusanManager 
                 jurusanList={jurusanList} 
                 setJurusanList={setJurusanList} 
                 initialJurusanIcons={initialJurusanIcons}
                 getIconName={getIconName}
               />;
      case 'postingan':
        return <PostinganManager 
                 postinganList={postinganList}
                 setPostinganList={setPostinganList}
               />;
      case 'staff':
        return <TeacherStaffManager />;
      case 'principals':
        return <PrincipalsManager />;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedMenu(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors
                ${selectedMenu === item.id 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {menuItems.find(item => item.id === selectedMenu)?.label}
            </h1>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          <motion.div
            key={selectedMenu}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;