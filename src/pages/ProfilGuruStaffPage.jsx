import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCircle, Briefcase, Mail } from 'lucide-react';

const ProfilGuruStaffPage = () => {
  const [leadership, setLeadership] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const storedData = localStorage.getItem('teacherStaffData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setLeadership(data.filter(member => 
        member.role === 'principal' || member.role === 'vice_principal'
      ));
      setTeachers(data.filter(member => member.role === 'teacher'));
      setStaff(data.filter(member => member.role === 'staff'));
    }
    setIsLoading(false);
  }, []);

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

      {leadership.length > 0 && (
        <motion.section variants={fadeInUp} initial="initial" animate="animate">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Kepemimpinan Sekolah
          </h2>
          <motion.div className="max-w-3xl mx-auto space-y-8" variants={staggerContainer}>
            {leadership.map((leader) => (
              <motion.div key={leader.id} variants={fadeInUp}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/50 overflow-hidden border-2 border-primary">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-56 md:h-auto bg-gray-200 dark:bg-gray-700">
                      {leader.image ? (
                        <img   
                          alt={leader.name} 
                          className="w-full h-full object-cover" 
                          src={leader.image}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <UserCircle className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow p-6">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {leader.name}
                      </h3>
                      <p className="text-lg text-primary dark:text-primary-light mt-1">
                        {leader.role === 'principal' ? 'Kepala Sekolah' : 
                         `Wakil Kepala Sekolah Bidang ${leader.expertise}`}
                      </p>
                      <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" /> 
                          Email: {leader.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      <motion.section variants={fadeInUp} initial="initial" animate="animate">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Tenaga Pendidik (Guru)
        </h2>
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {teachers.map((teacher, index) => (
            <motion.div key={teacher.id} variants={fadeInUp}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic dark:bg-gray-800/50 overflow-hidden">
                <div className="relative h-56 bg-gray-200 dark:bg-gray-700">
                  {teacher.image ? (
                    <img   
                      alt={teacher.name} 
                      className="w-full h-full object-cover" 
                      src={teacher.image}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <UserCircle className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardHeader className="pt-4">
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                    {teacher.name}
                  </CardTitle>
                  <CardDescription className="text-primary dark:text-primary-light">
                    {teacher.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-500" /> 
                    Keahlian: {teacher.expertise}
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" /> 
                    Email: {teacher.email}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      <motion.section variants={fadeInUp} initial="initial" animate="animate">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Tenaga Kependidikan (Staff)
        </h2>
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
                    className="w-full h-full object-cover" 
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