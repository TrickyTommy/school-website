import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Briefcase, Cpu, Code, AlertTriangle, Play } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { jurusanAPI } from '@/services/api';

    const iconComponents = {
      Briefcase: Briefcase,
      Cpu: Cpu,
      Code: Code,
    };

    const JurusanPage = () => {
      const [jurusanList, setJurusanList] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const { toast } = useToast();

      useEffect(() => {
        loadJurusan();
      }, []);

      const loadJurusan = async () => {
        try {
          setIsLoading(true);
          const result = await jurusanAPI.getAll();
          if (result.status === 'success') {
            setJurusanList(result.data.map(j => ({
              ...j,
              icon: iconComponents[j.icon] || Briefcase
            })));
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Gagal memuat data jurusan",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };

      const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
      };
    
      const staggerContainer = {
        animate: {
          transition: {
            staggerChildren: 0.15
          }
        }
      };

      return (
        <div className="space-y-12">
          <motion.section 
            className="py-12 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Program Keahlian Unggulan</h1>
            <p className="mt-4 text-lg text-purple-100 max-w-2xl mx-auto">
              Temukan passion dan kembangkan potensi Anda melalui berbagai pilihan program keahlian yang kami tawarkan.
            </p>
          </motion.section>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {isLoading ? (
              <Card className="md:col-span-2 lg:col-span-3 glassmorphic">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Memuat data jurusan...</p>
                </CardContent>
              </Card>
            ) : jurusanList.length === 0 ? (
              <Card className="md:col-span-2 lg:col-span-3 glassmorphic">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Belum ada data jurusan.</p>
                  <p className="text-gray-500 dark:text-gray-400">Silakan tambahkan jurusan baru melalui halaman Admin.</p>
                </CardContent>
              </Card>
            ) : (
              jurusanList.map((jurusan) => {
                const IconComponent = jurusan.icon;
                return (
                  <motion.div key={jurusan.id} variants={fadeInUp} className="h-full">
                    <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 glassmorphic dark:bg-gray-800/60 border-transparent hover:border-purple-500">
                      <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {jurusan.video_url ? (
                          <div className="w-full h-full">
                            <iframe
                              src={`https://www.youtube.com/embed/${jurusan.video_url.split('v=')[1]}`}
                              title={jurusan.name}
                              className="w-full h-full"
                              allowFullScreen
                            />
                          </div>
                        ) : jurusan.image ? (
                          <img   
                            alt={`Ilustrasi ${jurusan.name}`} 
                            className="w-full h-full object-contain"
                            src={jurusan.image.startsWith('data:') ? jurusan.image : `data:image/jpeg;base64,${jurusan.image}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {IconComponent && <IconComponent className="w-16 h-16 text-gray-400" />}
                          </div>
                        )}
                        <div className={`absolute top-4 right-4 p-3 rounded-full bg-white/80 dark:bg-gray-900/80 shadow-md ${jurusan.color}`}>
                          {IconComponent && <IconComponent className="w-8 h-8" />}
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                          {jurusan.name}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="flex-grow">
                        <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                          {jurusan.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      );
    };

    export default JurusanPage;