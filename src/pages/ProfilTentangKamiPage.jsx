import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building, Users, Award, History, AlertTriangle, ChevronLeft, ChevronRight, X } from 'lucide-react';
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

// Component untuk display single media
const MediaRenderer = ({ media }) => {
  if (!media) return null;

  const { url, file, type } = media;

  // Handle YouTube Video
  if (type === 'video' && url) {
    const ytId = getYouTubeEmbedUrl(url);
    if (ytId) {
      return (
        <div className="relative w-full pt-[56.25%] overflow-hidden bg-black rounded-lg">
          <iframe
            src={ytId}
            title="YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      );
    }
    // Direct video URL
    if (isDirectVideoUrl(url)) {
      return (
        <div className="relative w-full pt-[56.25%] overflow-hidden bg-black rounded-lg">
          <video
            src={url}
            controls
            preload="metadata"
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        </div>
      );
    }
  }

  // Handle Video File (Base64)
  if (type === 'video' && file) {
    return (
      <div className="relative w-full pt-[56.25%] overflow-hidden bg-black rounded-lg">
        <video
          src={file}
          controls
          preload="metadata"
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
      </div>
    );
  }

  // Handle Image
  if (type === 'image' && (url || file)) {
    return (
      <img
        alt="Media"
        src={url || file}
        className="w-full h-auto object-cover rounded-lg transition-transform duration-500 hover:scale-105"
      />
    );
  }

  return null;
};

// Component untuk carousel media
const MediaCarousel = ({ media, itemTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return null;
  }

  const currentMedia = media[currentIndex];

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Media Display */}
      <div className="relative group">
        <MediaRenderer media={currentMedia} />

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter */}
        {media.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {media.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {m.type === 'image' ? (
                <img
                  src={m.url || m.file}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-white text-xs">Video</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfilTentangKamiPage = () => {
  const { toast } = useToast();
  const [schoolInfo, setSchoolInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Load detail data saat modal dibuka
  useEffect(() => {
    if (selectedItem && !selectedItemDetail) {
      loadDetailData(selectedItem.id);
    }
  }, [selectedItem, selectedItemDetail]);

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

  const loadDetailData = async (itemId) => {
    try {
      setIsLoadingDetail(true);
      const result = await tentangKamiAPI.getById(itemId);
      if (result.status === 'success') {
        setSelectedItemDetail(result.data);
      } else {
        throw new Error(result.message || 'Gagal memuat detail');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat detail item",
        variant: "destructive"
      });
      console.error('Error loading detail:', error);
    } finally {
      setIsLoadingDetail(false);
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
            const hasMedia = info.media && info.media.length > 0;
            const firstMedia = hasMedia ? info.media[0] : null;

            return (
              <motion.div key={info.id} variants={fadeInUp}>
                <Card 
                  onClick={() => setSelectedItem(info)}
                  className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 glassmorphic dark:bg-gray-800/60 flex flex-col cursor-pointer hover:scale-105 hover:-translate-y-2"
                >
                  {/* Preview Media */}
                  {hasMedia && firstMedia ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-900">
                      {firstMedia.type === 'image' ? (
                        <img
                          src={firstMedia.url || firstMedia.file}
                          alt={info.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <div className="text-center">
                            <ChevronRight className="w-16 h-16 text-white/50 mx-auto mb-2" />
                            <p className="text-white text-sm">Klik untuk melihat detail</p>
                          </div>
                        </div>
                      )}
                      {hasMedia && (
                        <div className="absolute top-2 right-2 bg-blue-500/80 text-white text-xs px-3 py-1 rounded-full">
                          {info.media.length} media
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <IconComponent className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}

                  <CardHeader className="pb-3 pt-5">
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {info.description}
                    </p>
                    <p className="text-sm text-blue-500 mt-3 font-semibold">Klik untuk melihat detail →</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Detail Modal */}
      <Dialog 
        open={!!selectedItem} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
            setSelectedItemDetail(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">{selectedItem.title}</DialogTitle>
              </DialogHeader>
              
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat detail...</p>
                  </div>
                </div>
              ) : selectedItemDetail ? (
                <div className="space-y-6">
                  {/* Media Carousel */}
                  {selectedItemDetail.media && selectedItemDetail.media.length > 0 && (
                    <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50">
                      <MediaCarousel media={selectedItemDetail.media} itemTitle={selectedItemDetail.title} />
                    </div>
                  )}

                  {/* Deskripsi */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Deskripsi</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedItemDetail.description}
                    </p>
                  </div>

                  {/* Info Badge */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                      Icon: {selectedItemDetail.icon_type}
                    </span>
                    {selectedItemDetail.media && selectedItemDetail.media.length > 0 && (
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedItemDetail.media.length} Media
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </DialogContent>
      </Dialog>

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