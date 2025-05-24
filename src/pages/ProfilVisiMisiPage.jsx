import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Target, Eye, CheckCircle } from 'lucide-react';

    const ProfilVisiMisiPage = () => {
      const fadeInUp = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
      };

      const visi = "“Terwujudnya sekolah unggulan di bidang IPTEK untuk mencetak SDM yang berakhlak mulia, terampil, mandiri, berjiwa enterpreneur, kompetitif, berwawasan lingkungan dan religius”";
      const misi = [
        "Menerapkan penguatan pendidikan karakter melalui kegiatan pembelajaran berbasis teknologi informasi dan komunikasi, pembiasaan, keagamaan dan pengembangan diri.",
        "Menyelenggarakan pendidikan di semua bidang keahlian secara profesional efektif dan efisien dengan konsep BMW ( Bekerja, Melanjutkan, Wirausaha).",
        "Meningkatkan kemampuan guru dan tenaga kependidikan lainnya agar menjadi tenaga yang profesional di bidangnya.",
        "Memberdayakan dan mengembangkan sarana/ prasarana secara maksimal.",
        "Mengadakan pelatihan-pelatihan untuk menciptakan SDM yang terampil, kreatif, dan inovatif.",
        "Membina dan meningkatkan kerjasama dengan seluruh stake holder.",
        "Melatih dan menanamkan jiwa enterpreneur.",
        "Mewujudkan lingkungan belajar yang sehat, bersih, dan nyaman.",
      ];

      return (
        <div className="space-y-12">
          <motion.section
            className="py-12 text-center bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 rounded-xl shadow-xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Visi & Misi Sekolah</h1>
            <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
              Landasan dan arah pengembangan SMK Budi Mulia Karawang menuju masa depan yang lebih baik.
            </p>
          </motion.section>

          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="shadow-xl glassmorphic dark:bg-gray-800/60">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Eye className="w-12 h-12 text-primary" />
                <CardTitle className="text-3xl font-semibold text-gray-800 dark:text-white">Visi Sekolah</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {visi}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="shadow-xl glassmorphic dark:bg-gray-800/60">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Target className="w-12 h-12 text-primary" />
                <CardTitle className="text-3xl font-semibold text-gray-800 dark:text-white">Misi Sekolah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {misi.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default ProfilVisiMisiPage;