import React from 'react';
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
    import Navbar from '@/components/Navbar';
    import Footer from '@/components/Footer';
    import HomePage from '@/pages/HomePage';
    import JurusanPage from '@/pages/JurusanPage';
    import PostinganPage from '@/pages/PostinganPage';
    import KontakPage from '@/pages/KontakPage';
    import AdminPage from '@/pages/AdminPage';
    import ProfilVisiMisiPage from '@/pages/ProfilVisiMisiPage';
    import ProfilTentangKamiPage from '@/pages/ProfilTentangKamiPage';
    import ProfilGuruStaffPage from '@/pages/ProfilGuruStaffPage';
    import { Toaster } from '@/components/ui/toaster';
    import { ThemeProvider } from '@/components/ThemeProvider';
    import PostDetailPage from '@/pages/PostDetailPage';

    function App() {
      return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 text-gray-800 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 dark:text-gray-200">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/jurusan" element={<JurusanPage />} />
                  <Route path="/postingan" element={<PostinganPage />} />
                  <Route path="/kontak" element={<KontakPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/profil/visi-misi" element={<ProfilVisiMisiPage />} />
                  <Route path="/profil/tentang-kami" element={<ProfilTentangKamiPage />} />
                  <Route path="/profil/guru-staff" element={<ProfilGuruStaffPage />} />
                  <Route path="/postingan/:id" element={<PostDetailPage />} />
                  <Route path="/postingan/detail/:id" element={<PostDetailPage />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </ThemeProvider>
      );
    }

    export default App;