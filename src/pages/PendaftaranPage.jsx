import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const programs = [
  {
    name: 'Teknik Jaringan',
    cost: 4740000,
    items: ['Registrasi', 'Seragam', 'Kesiswaan', 'SPP', 'DSP']
  },
  {
    name: 'Akuntansi',
    cost: 4790000,
    items: ['Registrasi', 'Seragam', 'Kesiswaan', 'SPP', 'DSP']
  }
];

const PendaftaranPage = () => {
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Biaya Pendaftaran
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Tahun Ajaran 2024/2025 - SMK Budi Mulia Karawang
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {programs.map((program, index) => (
          <motion.div
            key={program.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50 opacity-50 dark:opacity-10" />
              
              <CardHeader className="relative">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                  {program.name}
                </h2>
                <div className="text-3xl font-bold text-center text-orange-600 mt-2">
                  {formatRupiah(program.cost)}
                </div>
              </CardHeader>

              <CardContent className="relative">
                <ul className="space-y-4">
                  {program.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="relative">
                    <a href=" https://wa.me/6289513356983?text=Assalamualaikum%20mohon%20maaf%20mengganggu%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20SMK%20Budi%20Mulia%20Karawang">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Daftar Sekarang

                  
                </Button>
                    </a>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PendaftaranPage;
