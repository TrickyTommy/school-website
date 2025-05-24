import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { ArrowRight, BookOpen, Users, Newspaper, Award, Building, Lightbulb } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

    const HomePage = () => {
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

      const features = [
        { title: "Kurikulum Unggul", description: "Kurikulum terkini yang relevan dengan kebutuhan industri.", icon: BookOpen, color: "text-purple-500" },
        { title: "Tenaga Pendidik Profesional", description: "Guru berpengalaman dan berdedikasi tinggi.", icon: Users, color: "text-indigo-500" },
        { title: "Fasilitas Lengkap", description: "Ruang kelas nyaman, laboratorium modern, dan perpustakaan.", icon: Building, color: "text-sky-500" },
        { title: "Ekstrakurikuler Beragam", description: "Kembangkan bakat dan minat melalui berbagai kegiatan.", icon: Award, color: "text-emerald-500" },
        { title: "Lingkungan Belajar Kondusif", description: "Suasana belajar yang aman, nyaman, dan inspiratif.", icon: Lightbulb, color: "text-yellow-500" },
        { title: "Berita & Kegiatan Terkini", description: "Informasi terbaru seputar kegiatan dan prestasi sekolah.", icon: Newspaper, color: "text-rose-500" },
      ];

      const jurusanUnggulan = [
        { name: "Akuntansi dan Keuangan Lembaga", image: "Jurusan Akuntansi", description: "Mempelajari pengelolaan keuangan dan akuntansi profesional." },
        { name: "Teknik Komputer Jaringan", image: "Jurusan TKJ", description: "Menguasai instalasi, konfigurasi, dan troubleshooting jaringan komputer." },
        { name: "Rekayasa Perangkat Lunak dan Gim", image: "Jurusan RPLG", description: "Mengembangkan aplikasi perangkat lunak dan game inovatif." },
      ];

      return (
        <div className="space-y-16">
          {/* Hero Section */}
          <motion.section 
            className="relative py-20 md:py-32 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-tr from-purple-600 via-indigo-700 to-blue-600 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 opacity-20">
              <img  alt="Gedung sekolah SMK Budi Mulia Karawang" class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1632466722833-568a49d7b1f7" />
            </div>
            <div className="container mx-auto px-4 text-center relative z-10">
              <motion.h1 
                className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Selamat Datang
                <span className="block">SMK Budi Mulia</span>
                <span className="block">Karawang</span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-purple-100"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Mencetak Generasi Unggul, Kreatif, dan Berkarakter untuk Masa Depan Gemilang.
              </motion.p>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-purple-100 shadow-lg transition-transform hover:scale-105">
                  <Link to="/jurusan">
                    Lihat Jurusan Kami <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.section>

          {/* Tentang Kami Section */}
          <motion.section className="py-12" variants={staggerContainer} initial="initial" animate="animate">
            <div className="text-center mb-12">
              <motion.h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4" variants={fadeInUp}>
                Mengapa Memilih SMK Budi Mulia Karawang?
              </motion.h2>
              <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" variants={fadeInUp}>
                Kami berkomitmen untuk memberikan pendidikan berkualitas yang mempersiapkan siswa menghadapi tantangan global.
              </motion.p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/50">
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                      <feature.icon className={`w-10 h-10 ${feature.color}`} />
                      <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Jurusan Unggulan Section */}
          <motion.section className="py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl" variants={staggerContainer} initial="initial" animate="animate">
            <div className="text-center mb-12">
              <motion.h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4" variants={fadeInUp}>
                Jurusan Unggulan
              </motion.h2>
              <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" variants={fadeInUp}>
                Temukan passion dan kembangkan potensi Anda di berbagai pilihan jurusan kami.
              </motion.p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {jurusanUnggulan.map((jurusan, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col">
                    <div className="relative h-56">
                      <img   
                        alt={jurusan.image} 
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src="https://images.unsplash.com/photo-1620886434979-5cc4ddc31858" />
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{jurusan.name}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">{jurusan.description}</CardDescription>
                      </div>
                      <Button asChild variant="link" className="text-purple-600 dark:text-purple-400 p-0 self-start hover:underline">
                        <Link to="/jurusan">
                          Pelajari Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Call to Action Section */}
          <motion.section className="py-16 text-center" variants={fadeInUp} initial="initial" animate="animate">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Siap Bergabung dengan Kami?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Jadilah bagian dari keluarga besar SMK Budi Mulia Karawang dan raih masa depan cerah bersama kami.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-lg transition-transform hover:scale-105">
                <Link to="/kontak">
                  Hubungi Kami
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20 shadow-lg transition-transform hover:scale-105">
                <Link to="/postingan">
                  Lihat Kegiatan Sekolah
                </Link>
              </Button>
            </div>
          </motion.section>
        </div>
      );
    };

    export default HomePage;