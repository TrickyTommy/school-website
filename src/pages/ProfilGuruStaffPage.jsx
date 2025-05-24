import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { UserCircle, Briefcase, Mail } from 'lucide-react';

    const ProfilGuruStaffPage = () => {
      const fadeInUp = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
      };

      const staggerContainer = {
        animate: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      };

      const teachers = [
        { name: 'Dr. Budi Santoso, M.Pd.', subject: 'Kepala Sekolah', expertise: 'Manajemen Pendidikan', email: 'budi.s@smkbmk.sch.id', image: 'Foto Kepala Sekolah Dr. Budi Santoso' },
        { name: 'Siti Aminah, S.Kom.', subject: 'Guru Rekayasa Perangkat Lunak', expertise: 'Web Development, Database', email: 'siti.a@smkbmk.sch.id', image: 'Foto Guru Siti Aminah' },
        { name: 'Ahmad Hidayat, S.T.', subject: 'Guru Teknik Komputer Jaringan', expertise: 'Networking, Cyber Security', email: 'ahmad.h@smkbmk.sch.id', image: 'Foto Guru Ahmad Hidayat' },
        { name: 'Dewi Lestari, S.E., Ak.', subject: 'Guru Akuntansi Keuangan Lembaga', expertise: 'Akuntansi, Perpajakan', email: 'dewi.l@smkbmk.sch.id', image: 'Foto Guru Dewi Lestari' },
        { name: 'Rizki Maulana, S.Pd.', subject: 'Guru Matematika', expertise: 'Matematika Terapan', email: 'rizki.m@smkbmk.sch.id', image: 'Foto Guru Rizki Maulana' },
        { name: 'Putri Anggraini, S.S.', subject: 'Guru Bahasa Inggris', expertise: 'English for Specific Purposes', email: 'putri.a@smkbmk.sch.id', image: 'Foto Guru Putri Anggraini' },
      ];
      
      const staff = [
        { name: 'Andi Wijaya', position: 'Kepala Tata Usaha', email: 'andi.w@smkbmk.sch.id', image: 'Foto Staf Andi Wijaya' },
        { name: 'Rina Marlina', position: 'Staf Perpustakaan', email: 'rina.m@smkbmk.sch.id', image: 'Foto Staf Rina Marlina' },
        { name: 'Joko Susilo', position: 'Teknisi Laboratorium', email: 'joko.s@smkbmk.sch.id', image: 'Foto Staf Joko Susilo' },
      ];


      return (
        <div className="space-y-12">
          <motion.section
            className="py-12 text-center bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500 rounded-xl shadow-xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Guru & Staff</h1>
            <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
              Mengenal para pendidik dan tenaga kependidikan yang berdedikasi di SMK Budi Mulia Karawang.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} initial="initial" animate="animate">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Tenaga Pendidik (Guru)</h2>
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {teachers.map((teacher, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/50 overflow-hidden">
                    <div className="relative h-56 bg-gray-200 dark:bg-gray-700">
                      <img   
                        alt={teacher.image} 
                        class="w-full h-full object-cover" 
                        src={`https://images.unsplash.com/photo-1573496359112-58d0005915${index % 9 < 10 ? '0' + (index % 9) : (index % 9)}?auto=format&fit=crop&w=400&q=60`}
                      />
                    </div>
                    <CardHeader className="pt-4">
                      <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">{teacher.name}</CardTitle>
                      <CardDescription className="text-primary dark:text-primary-light">{teacher.subject}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-gray-500" /> Keahlian: {teacher.expertise}</p>
                      <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-500" /> Email: {teacher.email}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
          
          <motion.section variants={fadeInUp} initial="initial" animate="animate">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Tenaga Kependidikan (Staff)</h2>
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {staff.map((person, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/50 overflow-hidden">
                     <div className="relative h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                       <img   
                        alt={person.image} 
                        class="w-full h-full object-cover" 
                        src={`https://images.unsplash.com/photo-1580894742597-87bc87892${500 + index}?auto=format&fit=crop&w=400&q=60`}
                      />
                    </div>
                    <CardHeader className="pt-4">
                      <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">{person.name}</CardTitle>
                      <CardDescription className="text-primary dark:text-primary-light">{person.position}</CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                       <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-500" /> Email: {person.email}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

        </div>
      );
    };

    export default ProfilGuruStaffPage;