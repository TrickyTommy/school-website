import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Newspaper, Image as ImageIcon, Video, PlusCircle, Edit, Trash2, CalendarDays, UserCircle, Tag, AlertTriangle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { useNavigate } from 'react-router-dom';
    import { API_ENDPOINTS } from '@/services/api';

    const PostinganPage = () => {
      const navigate = useNavigate();
      const [postinganList, setPostinganList] = useState([]);
      const [filter, setFilter] = useState('semua');
      const { toast } = useToast();
      const [isAdmin, setIsAdmin] = useState(false);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        loadPosts();
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
      }, []);

      const loadPosts = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(API_ENDPOINTS.postingan);
          const result = await response.json();
          
          if (result.status === 'success') {
            setPostinganList(result.data);
          } else {
            throw new Error(result.message || 'Failed to load posts');
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Gagal memuat postingan",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };

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

      const handlePostClick = (postId) => {
        navigate(`/postingan/detail/${postId}`);
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
           
          </div>
          
          {isLoading ? (
            <Card className="md:col-span-2 lg:col-span-3 glassmorphic">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Memuat postingan...</p>
              </CardContent>
            </Card>
          ) : filteredPostingan.length === 0 ? (
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
                  <Card 
                    className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/60 cursor-pointer"
                    onClick={() => handlePostClick(post.id)}
                  >
                    {(post.image || post.videoUrl) && (
                      <div className="relative h-56 w-full overflow-hidden">
                        {post.image ? (
                          <img   
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={post.image}
                          />
                        ) : post.videoUrl && (
                          <div className="w-full h-full">
                            <video 
                              src={post.videoUrl} 
                              controls
                              className="w-full h-full object-cover"
                            />
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
                   
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      );
    };

    export default PostinganPage;