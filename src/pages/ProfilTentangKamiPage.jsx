import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Building, Users, Award, History } from 'lucide-react';

    const ProfilTentangKamiPage = () => {
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

      const schoolInfo = [
        {
          icon: History,
          title: "Sejarah Singkat",
          content: "SMK Budi Mulia Karawang didirikan pada tahun YYYY dengan komitmen untuk menyediakan pendidikan kejuruan berkualitas yang relevan dengan kebutuhan industri. Sejak awal pendiriannya, sekolah kami terus berkembang dan berinovasi untuk mencetak lulusan yang siap kerja dan berkarakter.",
          image: "Foto arsip gedung sekolah lama atau momen pendirian"
        },
        {
          icon: Building,
          title: "Fasilitas Sekolah",
          content: "Kami memiliki fasilitas lengkap untuk mendukung proses belajar mengajar, termasuk ruang kelas yang nyaman, laboratorium komputer modern, bengkel praktik sesuai jurusan, perpustakaan dengan koleksi buku lengkap, lapangan olahraga, dan kantin yang bersih.",
          image: "Kolase foto berbagai fasilitas sekolah"
        },
        {
          icon: Award,
          title: "Prestasi Sekolah",
          content: "SMK Budi Mulia Karawang telah meraih berbagai prestasi baik di bidang akademik maupun non-akademik, mulai dari tingkat kabupaten, provinsi, hingga nasional. Prestasi ini merupakan bukti komitmen kami terhadap kualitas pendidikan.",
          image: "Foto piala atau siswa berprestasi"
        },
        {
          icon: Users,
          title: "Komunitas Sekolah",
          content: "Kami bangga memiliki komunitas sekolah yang solid dan suportif, terdiri dari siswa-siswi yang antusias, guru-guru yang berdedikasi, staf yang profesional, serta orang tua dan alumni yang peduli terhadap kemajuan sekolah.",
          image: "Foto kegiatan bersama siswa dan guru"
        }
      ];

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

          <motion.div 
            className="grid md:grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {schoolInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/60 flex flex-col">
                    <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                      <img   
                        alt={info.image} 
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={`https://images.unsplash.com/photo-15${index % 2 === 0 ? '78876904529' : '44432778'}?auto=format&fit=crop&w=800&q=60`} 
                      />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                       <div className="absolute bottom-4 left-4 p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-md">
                          <IconComponent className="w-10 h-10 text-white" />
                       </div>
                    </div>
                    <CardHeader className="pb-3 pt-5">
                      <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {info.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

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