import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Newspaper, Image as ImageIcon, Video, PlusCircle, Edit, Trash2, CalendarDays, UserCircle, Tag, AlertTriangle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const initialPostinganData = [
      { id: 'post1', title: 'Kegiatan Class Meeting Akhir Semester', type: 'berita', content: 'Siswa-siswi SMK Budi Mulia Karawang mengikuti berbagai lomba dalam class meeting...', image: 'Siswa bermain basket saat class meeting', videoUrl: null, date: '2025-05-20', author: 'Admin Sekolah', category: 'Kegiatan Sekolah' },
      { id: 'post2', title: 'Juara 1 Lomba Kompetensi Siswa (LKS) Tingkat Kabupaten', type: 'berita', content: 'Selamat kepada tim TKJ yang berhasil meraih juara 1 LKS bidang IT Network Systems Administration.', image: 'Siswa menerima piala LKS', videoUrl: null, date: '2025-05-15', author: 'Humas Sekolah', category: 'Prestasi' },
      { id: 'post3', title: 'Galeri Foto Studi Wisata ke Bandung', type: 'foto', content: 'Kumpulan foto keceriaan siswa saat studi wisata ke berbagai tempat edukatif di Bandung.', image: 'Siswa berfoto di depan gedung sate bandung', videoUrl: null, date: '2025-05-10', author: 'Tim Dokumentasi', category: 'Studi Wisata' },
      { id: 'post4', title: 'Video Profil Jurusan RPLG', type: 'video', content: 'Saksikan video profil menarik tentang jurusan Rekayasa Perangkat Lunak dan Gim di SMK Budi Mulia Karawang.', image: 'Thumbnail video profil jurusan RPLG', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', date: '2025-05-05', author: 'Tim Multimedia', category: 'Profil Jurusan' },
    ];
    
    const PostinganPage = () => {
      const [postinganList, setPostinganList] = useState([]);
      const [filter, setFilter] = useState('semua');
      const { toast } = useToast();
      const [isAdmin, setIsAdmin] = useState(false);

      useEffect(() => {
        const storedPostingan = localStorage.getItem('postinganData');
        if (storedPostingan) {
          setPostinganList(JSON.parse(storedPostingan));
        } else {
          setPostinganList(initialPostinganData);
          localStorage.setItem('postinganData', JSON.stringify(initialPostinganData));
        }
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
      }, []);

      const filteredPostingan = postinganList.filter(post => 
        filter === 'semua' || post.type === filter
      );

      const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
      };

      const staggerContainer = {
        animate: {
          transition: {
            staggerChildren: 0.1
          }
        }
      };
      
      const handleAddPostingan = () => {
        toast({ title: "Info", description: "Fitur tambah postingan akan tersedia di halaman Admin." });
      };

      const handleEditPostingan = (id) => {
        toast({ title: "Info", description: `Fitur edit postingan (ID: ${id}) akan tersedia di halaman Admin.` });
      };

      const handleDeletePostingan = (id) => {
        toast({
          variant: "destructive",
          title: "Konfirmasi Hapus",
          description: `Fitur hapus postingan (ID: ${id}) akan tersedia di halaman Admin.`,
        });
      };

      const getPostIcon = (type) => {
        if (type === 'berita') return <Newspaper className="w-5 h-5 mr-2 text-blue-500" />;
        if (type === 'foto') return <ImageIcon className="w-5 h-5 mr-2 text-green-500" />;
        if (type === 'video') return <Video className="w-5 h-5 mr-2 text-red-500" />;
        return null;
      };

      return (
        <div className="space-y-12">
          <motion.section 
            className="py-12 text-center bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 rounded-xl shadow-xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Kabar Sekolah & Galeri</h1>
            <p className="mt-4 text-lg text-sky-100 max-w-2xl mx-auto">
              Ikuti berita terbaru, lihat galeri foto kegiatan, dan tonton video menarik dari SMK Budi Mulia Karawang.
            </p>
          </motion.section>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
              {['semua', 'berita', 'foto', 'video'].map(type => (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'ghost'}
                  onClick={() => setFilter(type)}
                  className={`capitalize transition-all duration-200 ${filter === type ? 'bg-primary text-primary-foreground' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {type}
                </Button>
              ))}
            </div>
            {isAdmin && (
              <Button onClick={handleAddPostingan} className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                <PlusCircle className="mr-2 h-5 w-5" /> Tambah Postingan
              </Button>
            )}
          </div>
          
          {filteredPostingan.length === 0 ? (
             <Card className="md:col-span-2 lg:col-span-3 glassmorphic">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Belum ada postingan.</p>
                  <p className="text-gray-500 dark:text-gray-400">Tidak ada postingan yang cocok dengan filter saat ini, atau belum ada postingan yang dibuat.</p>
                </CardContent>
              </Card>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredPostingan.map(post => (
                <motion.div key={post.id} variants={fadeInUp} className="h-full">
                  <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/60">
                    {post.image && (
                      <div className="relative h-56 w-full overflow-hidden">
                        <img   
                          alt={post.image} 
                          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
                        {post.type === 'video' && post.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Video className="w-16 h-16 text-white opacity-80" />
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {getPostIcon(post.type)}
                        <span className="capitalize">{post.type}</span>
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white leading-tight hover:text-primary dark:hover:text-primary-foreground transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription className="text-gray-600 dark:text-gray-300 mb-3 text-sm line-clamp-3">
                        {post.content}
                      </CardDescription>
                       {post.type === 'video' && post.videoUrl && (
                        <div className="aspect-w-16 aspect-h-9 my-3 rounded-lg overflow-hidden">
                          <iframe
                            src={post.videoUrl}
                            title={post.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-3 pt-3 border-t dark:border-gray-700">
                        <p className="flex items-center"><CalendarDays className="w-3 h-3 mr-1.5" /> {new Date(post.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="flex items-center"><UserCircle className="w-3 h-3 mr-1.5" /> Oleh: {post.author}</p>
                        <p className="flex items-center"><Tag className="w-3 h-3 mr-1.5" /> Kategori: {post.category}</p>
                      </div>
                    </CardContent>
                    {isAdmin && (
                      <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditPostingan(post.id)} className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30">
                          <Edit className="mr-1 h-3 w-3" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePostingan(post.id)}>
                          <Trash2 className="mr-1 h-3 w-3" /> Hapus
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      );
    };

    export default PostinganPage;