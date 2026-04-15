import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, Award, History, AlertTriangle, Video as VideoIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { tentangKamiAPI } from '@/services/api';

// Helper: ekstrak YouTube ID dan kembalikan embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const isDirectVideoUrl = (url) =>
  url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

// Icon mapping
const ICON_MAP = {
  'History': History,
  'Building': Building,
  'Award': Award,
  'Users': Users,
  'Bookmark': History,
  'Star': Award,
  'Heart': Users,
  'Zap': Building
};

const ProfilTentangKamiPage = () => {
  const { toast } = useToast();
  const [schoolInfo, setSchoolInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const result = await tentangKamiAPI.getAll();
      if (result.status === 'success') {
        setSchoolInfo(result.data);
      } else {
        throw new Error(result.message || 'Gagal memuat data');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data tentang kami",
        variant: "destructive"
      });
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="space-y-12">
      <motion.section
        className="py-12 text-center bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Tentang Kami</h1>
        <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
          Mengenal lebih dekat SMK Budi Mulia Karawang, lembaga pendidikan yang berdedikasi untuk masa depan generasi muda.
        </p>
      </motion.section>

      {isLoading ? (
        <Card className="md:col-span-2 lg:col-span-3 glassmorphic">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Memuat data...</p>
          </CardContent>
        </Card>
      ) : schoolInfo.length === 0 ? (
        <Card className="md:col-span-2 lg:col-span-3 glassmorphic">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Belum ada data.</p>
            <p className="text-gray-500 dark:text-gray-400">Hubungi admin untuk menambahkan data tentang kami.</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="grid md:grid-cols-1 lg:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {schoolInfo.map((info) => {
            const IconComponent = ICON_MAP[info.icon_type] || History;
            
            // Handle video media
            const videoUrl = info.video_url || null;
            const videoFile = info.video_file || null;
            const ytEmbed = getYouTubeEmbedUrl(videoUrl);
            const isDirect = isDirectVideoUrl(videoUrl);

            return (
              <motion.div key={info.id} variants={fadeInUp}>
                <Card className="h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/60 flex flex-col">
                  {/* Media Section */}
                  {(() => {
                    // YouTube Video
                    if (ytEmbed) {
                      return (
                        <div className="relative w-full pt-[56.25%] overflow-hidden rounded-t-lg">
                          <iframe
                            src={ytEmbed}
                            title={info.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                          />
                        </div>
                      );
                    }

                    // Direct Video File or URL
                    if (isDirect || videoFile) {
                      return (
                        <div className="relative w-full pt-[56.25%] overflow-hidden bg-black rounded-t-lg">
                          <video
                            src={isDirect ? videoUrl : videoFile}
                            controls
                            preload="metadata"
                            className="absolute top-0 left-0 w-full h-full object-contain"
                          />
                        </div>
                      );
                    }

                    // Image
                    if (info.image) {
                      return (
                        <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                          <img
                            alt={info.title}
                            src={info.image}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-md">
                            <IconComponent className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      );
                    }

                    // Fallback: Just icon
                    return (
                      <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <IconComponent className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                      </div>
                    );
                  })()}

                  <CardHeader className="pb-3 pt-5">
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <motion.section variants={fadeInUp} initial="initial" animate="animate" className="py-8">
        <Card className="shadow-lg glassmorphic dark:bg-gray-800/60">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Budaya Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Di SMK Budi Mulia Karawang, kami menjunjung tinggi nilai-nilai disiplin, kejujuran, kerja keras, dan semangat kolaborasi. Kami menciptakan lingkungan belajar yang positif, inklusif, dan inspiratif, di mana setiap individu dihargai dan didorong untuk mencapai potensi terbaiknya.
            </p>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
};

export default ProfilTentangKamiPage;