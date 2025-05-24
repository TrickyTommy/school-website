import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Briefcase, Cpu, Code, PlusCircle, Edit, Trash2, AlertTriangle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';

    const initialJurusanData = [
      { id: 'akl', name: 'Akuntansi dan Keuangan Lembaga', description: 'Mempelajari pengelolaan keuangan perusahaan, perpajakan, dan audit. Lulusan siap bekerja di sektor keuangan, perbankan, atau menjadi akuntan profesional.', icon: Briefcase, color: 'text-green-500', image: 'Suasana kelas Akuntansi dengan siswa belajar serius' },
      { id: 'tkj', name: 'Teknik Komputer Jaringan', description: 'Fokus pada instalasi, konfigurasi, dan pemeliharaan jaringan komputer, serta keamanan siber. Prospek karir meliputi teknisi jaringan, administrator sistem, dan spesialis IT.', icon: Cpu, color: 'text-blue-500', image: 'Siswa TKJ sedang merakit komputer di laboratorium' },
      { id: 'rplg', name: 'Rekayasa Perangkat Lunak dan Gim', description: 'Mengembangkan aplikasi web, mobile, desktop, dan game. Siswa akan belajar bahasa pemrograman, desain UI/UX, dan manajemen proyek perangkat lunak.', icon: Code, color: 'text-purple-500', image: 'Siswa RPLG berdiskusi tentang kode program di depan monitor' },
    ];
    
    const iconComponents = {
      Briefcase: Briefcase,
      Cpu: Cpu,
      Code: Code,
    };

    const JurusanPage = () => {
      const [jurusanList, setJurusanList] = useState([]);
      const { toast } = useToast();
      const [isAdmin, setIsAdmin] = useState(false);

      useEffect(() => {
        const storedJurusan = localStorage.getItem('jurusanData');
        if (storedJurusan) {
          const parsedJurusan = JSON.parse(storedJurusan);
          setJurusanList(parsedJurusan.map(j => ({...j, icon: iconComponents[j.icon] || Briefcase })));
        } else {
          setJurusanList(initialJurusanData.map(j => ({...j, icon: j.icon || Briefcase }))); // Ensure icon is component
          localStorage.setItem('jurusanData', JSON.stringify(initialJurusanData.map(j => ({...j, icon: Object.keys(iconComponents).find(key => iconComponents[key] === j.icon) || 'Briefcase' }))));
        }
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
      }, []);

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

      const handleAddJurusan = () => {
        toast({ title: "Info", description: "Fitur tambah jurusan akan tersedia di halaman Admin." });
      };

      const handleEditJurusan = (id) => {
        toast({ title: "Info", description: `Fitur edit jurusan (ID: ${id}) akan tersedia di halaman Admin.` });
      };

      const handleDeleteJurusan = (id) => {
         toast({
          variant: "destructive",
          title: "Konfirmasi Hapus",
          description: `Fitur hapus jurusan (ID: ${id}) akan tersedia di halaman Admin.`,
        });
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
            {jurusanList.length === 0 && (
              <Card className="md:col-span-2 lg:col-span-3 glassmorphic">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Belum ada data jurusan.</p>
                  <p className="text-gray-500 dark:text-gray-400">Silakan tambahkan jurusan baru melalui halaman Admin.</p>
                </CardContent>
              </Card>
            )}
            {jurusanList.map((jurusan) => {
              const IconComponent = jurusan.icon;
              return (
              <motion.div key={jurusan.id} variants={fadeInUp} className="h-full">
                <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 glassmorphic dark:bg-gray-800/60 border-transparent hover:border-purple-500">
                  <div className="relative h-56 w-full overflow-hidden">
                    <img   
                      alt={jurusan.image || `Ilustrasi ${jurusan.name}`} 
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src="https://images.unsplash.com/photo-1696041757866-f19a8e46fab1" />
                    <div className={`absolute top-4 right-4 p-3 rounded-full bg-white/80 dark:bg-gray-900/80 shadow-md ${jurusan.color}`}>
                     {IconComponent && <IconComponent className="w-8 h-8" />}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">{jurusan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      {jurusan.description}
                    </CardDescription>
                  </CardContent>
                 
                </Card>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      );
    };

    export default JurusanPage;