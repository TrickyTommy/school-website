import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCircle, Briefcase, Mail } from 'lucide-react';
import { guruStaffAPI } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ProfilGuruStaffPage = () => {
  const [leadership, setLeadership] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const result = await guruStaffAPI.getAll();
      
      if (result.status === 'success') {
        // Sort leadership with principal first, then vice principals
        const leadershipMembers = result.data
          .filter(member => 
            member.role === 'principal' || 
            member.role === 'vice_principal' || 
            member.role === 'program_head'
          )
          .sort((a, b) => {
            // Principal comes first
            if (a.role === 'principal') return -1;
            if (b.role === 'principal') return 1;
            // Then vice principals
            if (a.role === 'vice_principal') return -1;
            if (b.role === 'vice_principal') return 1;
            // Then program heads
            return 0;
          });

        setLeadership(leadershipMembers);
        setTeachers(result.data.filter(member => member.role === 'teacher'));
        setStaff(result.data.filter(member => member.role === 'staff'));
      } else {
        throw new Error(result.message || 'Failed to load data');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal memuat data guru & staff",
        variant: "destructive"
      });
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
        staggerChildren: 0.1,
      },
    },
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('data:image/')) return image;
    if (image.startsWith('http')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const renderMemberDetail = (member) => {
    return (
      <div className="space-y-6">
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center min-h-[400px]">
          {member.image ? (
            <img
              src={getImageUrl(member.image)}
              alt={member.name}
              className="max-w-full max-h-[60vh] object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          ) : (
            <UserCircle className="w-32 h-32 text-gray-400" />
          )}
        </div>
        
        {/* Member details */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {member.name}
          </h2>
          
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-xl text-primary dark:text-primary-light font-semibold">
              {member.role === 'staff' ? member.position : 
               member.role === 'principal' ? 'Kepala Sekolah' : 
               member.role === 'vice_principal' ? `Wakil Kepala Sekolah Bidang ${member.expertise}` :
               member.role === 'program_head' ? `Kepala Program ${member.expertise}` :
               'Guru'}
            </p>
          </div>
          
          <div className="grid gap-4 text-gray-600 dark:text-gray-300">
            {member.subject && (
              <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <Briefcase className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Mata Pelajaran</p>
                  <p className="font-medium">{member.subject}</p>
                </div>
              </div>
            )}
            
            {member.expertise && (
              <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <Briefcase className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Keahlian</p>
                  <p className="font-medium">{member.expertise}</p>
                </div>
              </div>
            )}

            <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <Mail className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{member.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <motion.section
        className="py-12 text-center bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Tim Manajemen</h1>
        <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
          Mengenal para pendidik dan tenaga kependidikan yang berdedikasi di SMK Budi Mulia Karawang.
        </p>
      </motion.section>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : (
        <>
          {/* Leadership Section */}
          <motion.section variants={fadeInUp} initial="initial" animate="animate" className="w-full">
            {/* Principal - Full Width */}
            <div className="mb-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-bold text-center mb-4"> Kepala Sekolah</h3>
              {leadership
                .filter(l => l.role === 'principal')
                .map((leader) => (
                  <motion.div key={leader.id} variants={fadeInUp} className="md:col-span-4">
                    <Card onClick={() => handleMemberClick(leader)} className="cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300 glassmorphic dark:bg-gray-800/50 overflow-hidden border border-primary">
                      <div className="flex flex-col">
                        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {leader.image ? (
                            <img   
                              alt={leader.name} 
                              className="max-w-full h-full object-contain" 
                              src={getImageUrl(leader.image)}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <UserCircle className="w-20 h-20 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {leader.name}
                          </h3>
                          <p className="text-lg text-primary dark:text-primary-light mt-1">
                            {leader.role === 'principal' ? 'Kepala Sekolah' : 
                             leader.role === 'vice_principal' ? `Wakil Kepala Sekolah Bidang ${leader.expertise}` :
                             leader.role === 'program_head' ? `Kepala Program ${leader.expertise}` : ''}
                          </p>
                          <p className="mt-2 text-gray-600 dark:text-primary-light">
                            {leader.subject && `Mata Pelajaran: ${leader.subject}`}
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
            </div>

            {/* Vice Principals - Horizontal Grid */}
            {leadership.some(l => l.role === 'vice_principal') && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-center mb-4">Wakil Kepala Sekolah</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                  {leadership
                    .filter(l => l.role === 'vice_principal')
                    .sort((a, b) => {
                      const order = ['kurikulum', 'kesiswaan', 'sarana', 'humas'];
                      return order.indexOf(a.expertise) - order.indexOf(b.expertise);
                    })
                    .map((leader) => (
                      <motion.div key={leader.id} variants={fadeInUp}>
                        <Card 
                          onClick={() => handleMemberClick(leader)} 
                          className="cursor-pointer h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="relative h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {leader.image ? (
                              <img   
                                alt={leader.name} 
                                className="max-w-full h-full object-contain" 
                                src={getImageUrl(leader.image)}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/150';
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <UserCircle className="w-20 h-20 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                              {leader.name}
                            </h3>
                            <p className="text-sm text-primary dark:text-primary-light mt-1">
                              Wakil Kepala Sekolah
                            </p>
                            <p className="text-xs text-gray-600 dark:text-primary-light">
                              Bidang {leader.expertise}
                            </p>
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                              <p className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" /> 
                                {leader.email}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {/* Program Heads - Below Vice Principals */}
            {leadership.some(l => l.role === 'program_head') && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-center mb-4">Kepala Program</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                  {leadership
                    .filter(l => l.role === 'program_head')
                    .map((leader) => (
                      <motion.div key={leader.id} variants={fadeInUp}>
                        <Card onClick={() => handleMemberClick(leader)} className="cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300 glassmorphic dark:bg-gray-800/50 overflow-hidden border border-primary">
                          <div className="flex flex-col">
                            <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              {leader.image ? (
                                <img   
                                  alt={leader.name} 
                                  className="max-w-full h-full object-contain" 
                                  src={getImageUrl(leader.image)}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150';
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <UserCircle className="w-20 h-20 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {leader.name}
                              </h3>
                              <p className="text-lg text-primary dark:text-primary-light mt-1">
                                {leader.role === 'principal' ? 'Kepala Sekolah' : 
                                 leader.role === 'vice_principal' ? `Wakil Kepala Sekolah Bidang ${leader.expertise}` :
                                 leader.role === 'program_head' ? `Kepala Program ${leader.expertise}` : ''}
                              </p>
                              <p className="mt-2 text-gray-600 dark:text-primary-light">
                                {leader.subject && `Mata Pelajaran: ${leader.subject}`}
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
                </div>
              </div>
            )}
          </motion.section>

          {/* Teachers Section - 4 Columns */}
          {teachers.length > 0 && (
            <motion.section variants={fadeInUp} initial="initial" animate="animate">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                Tenaga Pendidik (Guru)
              </h2>
              <motion.div 
                className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto"
                variants={staggerContainer}
              >
                {teachers.map((teacher) => (
                  <motion.div key={teacher.id} variants={fadeInUp}>
                    <Card onClick={() => handleMemberClick(teacher)} className="cursor-pointer h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {teacher.image ? (
                          <img   
                            alt={teacher.name} 
                            className="max-w-full h-full object-contain" 
                            src={getImageUrl(teacher.image)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <UserCircle className="w-20 h-20 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                          {teacher.name}
                        </CardTitle>
                        <CardDescription className="text-primary dark:text-primary-light">
                           {teacher.expertise && (
                          <p className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-500" /> 
                            Keahlian: {teacher.expertise}
                          </p>
                        )}
                          </CardDescription>
                        <CardDescription className="text-primary text-gray-600 dark:text-primary-light">
                          {teacher.subject && `Mata Pelajaran: ${teacher.subject}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                       
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" /> 
                          {teacher.email}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}
          
          {/* Staff Section - 4 Columns */}
          {staff.length > 0 && (
            <motion.section variants={fadeInUp} initial="initial" animate="animate">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                Tenaga Kependidikan (Staff)
              </h2>
              <motion.div 
                className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto"
                variants={staggerContainer}
              >
                {staff.map((person) => (
                  <motion.div key={person.id} variants={fadeInUp}>
                    <Card onClick={() => handleMemberClick(person)} className="cursor-pointer h-full shadow-md hover:shadow-lg transition-shadow duration-300 glassmorphic dark:bg-gray-800/50 overflow-hidden">
                       <div className="relative h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                         <img   
                          alt={person.name} 
                          className="max-w-full h-full object-contain" 
                          src={getImageUrl(person.image)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                      <CardHeader className="pt-4">
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">{person.name}</CardTitle>
                        <CardDescription className="text-primary dark:text-primary-light">{person.position}</CardDescription>
                      </CardHeader>
                       <CardContent className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <CardDescription className="text-primary dark:text-primary-light">
                           {person.expertise && (
                          <p className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-500" /> 
                            Keahlian: {person.expertise}
                          </p>
                        )}
                          </CardDescription>
                         <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-500" /> Email: {person.email}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedMember && renderMemberDetail(selectedMember)}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilGuruStaffPage;