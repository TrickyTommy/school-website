import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { useToast } from '@/components/ui/use-toast';
    import { LogIn, LogOut } from 'lucide-react';
    import AdminLoginForm from '@/components/admin/AdminLoginForm';
    import JurusanManager from '@/components/admin/JurusanManager';
    import PostinganManager from '@/components/admin/PostinganManager';
    import TeacherStaffManager from '@/components/admin/TeacherStaffManager';
    import { Briefcase, Cpu, Code } from 'lucide-react';

    export const initialJurusanIcons = { Briefcase, Cpu, Code };
    
    export const getIconName = (IconComponent) => {
      return Object.keys(initialJurusanIcons).find(key => initialJurusanIcons[key] === IconComponent) || 'Briefcase';
    };

    const AdminPage = () => {
      const { toast } = useToast();
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      
      const [jurusanList, setJurusanList] = useState([]);
      const [postinganList, setPostinganList] = useState([]);

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
        toast({ title: "Login Berhasil", description: "Selamat datang, Admin!", variant: "default" });
      };

      const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdmin');
        toast({ title: "Logout Berhasil", description: "Anda telah keluar dari halaman admin.", variant: "default" });
      };
      
      const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      };

      if (!isAuthenticated) {
        return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
      }

      return (
        <div className="space-y-8">
          <motion.section 
            className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg"
            variants={fadeInUp} initial="initial" animate="animate"
          >
            <h1 className="text-3xl font-bold">Halaman Admin</h1>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-5 w-5" /> Logout
            </Button>
          </motion.section>

          <Tabs defaultValue="jurusan" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <TabsTrigger value="jurusan" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md py-2.5">Kelola Jurusan</TabsTrigger>
              <TabsTrigger value="postingan" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md py-2.5">Kelola Postingan</TabsTrigger>
              <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md py-2.5">Kelola Guru & Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="jurusan" className="mt-6">
              <motion.div variants={fadeInUp} initial="initial" animate="animate">
                <JurusanManager 
                  jurusanList={jurusanList} 
                  setJurusanList={setJurusanList} 
                  initialJurusanIcons={initialJurusanIcons}
                  getIconName={getIconName}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="postingan" className="mt-6">
              <motion.div variants={fadeInUp} initial="initial" animate="animate">
                <PostinganManager 
                  postinganList={postinganList}
                  setPostinganList={setPostinganList}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="staff" className="mt-6">
              <motion.div variants={fadeInUp} initial="initial" animate="animate">
                <TeacherStaffManager />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      );
    };

    export default AdminPage;