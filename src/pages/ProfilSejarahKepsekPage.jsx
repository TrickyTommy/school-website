import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { principalsAPI } from '@/services/api';

const ProfilSejarahKepsekPage = () => {
  const [principals, setPrincipals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrincipals = async () => {
      try {
        const result = await principalsAPI.getAll();
        if (result.status === 'success') {
          setPrincipals(result.data);
        }
      } catch (error) {
        console.error('Failed to load principals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrincipals();
  }, []);

  const staggerAnimation = {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="space-y-12 px-4 max-w-7xl mx-auto pb-12">
      <motion.section
        className="py-16 text-center bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Sejarah Kepala Sekolah
          </h1>
          <p className="mt-4 text-lg md:text-xl text-orange-50 max-w-3xl mx-auto font-medium">
            Mengenal para pemimpin yang telah berkontribusi dalam membangun dan mengembangkan SMK Budi Mulia Karawang
          </p>
        </div>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-6">
        {principals.map((principal, index) => (
          <motion.div
            key={index}
            variants={staggerAnimation.item}
            initial="initial"
            animate="animate"
            className="relative group"
          >
            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-40 h-40 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={principal.foto}
                      alt={principal.nama}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                      {principal.nama}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center justify-center md:justify-start gap-2">
                      <History className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">Periode: {principal.tahun_jabatan}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfilSejarahKepsekPage;
