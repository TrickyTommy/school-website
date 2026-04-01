import React from 'react';
import { motion } from 'framer-motion';

const PendaftaranPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          Informasi Pendaftaran
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
          Untuk pendaftaran SMK dapat diakses dalam website berikut:
        </p>
        <a
          href="https://sumberbarokah.ponpes.id/registrasi/index.php?page=SMK"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        >
          DAFTAR DISINI
        </a>
      </motion.div>
    </div>
  );
};

export default PendaftaranPage;
