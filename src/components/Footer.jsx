
    import React from 'react';
    import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

    const Footer = () => {
      const currentYear = new Date().getFullYear();

      return (
        <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-300 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <p className="text-xl font-semibold text-white mb-4">SMK Budi Mulia Karawang</p>
                <p className="text-sm mb-2 flex items-start">
                  <MapPin className="w-5 h-5 mr-2 mt-1 text-purple-400 flex-shrink-0" />
                  Jl. Contoh Alamat No. 123, Karawang, Jawa Barat, Indonesia
                </p>
                <p className="text-sm mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-purple-400" />
                  (0267) 123-4567
                </p>
                <p className="text-sm flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-purple-400" />
                  info@smkbudimuliakrw.sch.id
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold text-white mb-4">Tautan Cepat</p>
                <ul className="space-y-2">
                  <li><a href="/" className="hover:text-purple-400 transition-colors">Beranda</a></li>
                  <li><a href="/jurusan" className="hover:text-purple-400 transition-colors">Jurusan</a></li>
                  <li><a href="/postingan" className="hover:text-purple-400 transition-colors">Postingan</a></li>
                  <li><a href="/kontak" className="hover:text-purple-400 transition-colors">Kontak</a></li>
                </ul>
              </div>

              <div>
                <p className="text-lg font-semibold text-white mb-4">Informasi</p>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Visi & Misi</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Sejarah Sekolah</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Fasilitas</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Ekstrakurikuler</a></li>
                </ul>
              </div>

              <div>
                <p className="text-lg font-semibold text-white mb-4">Ikuti Kami</p>
                <div className="flex space-x-4">
                  <a href="#" aria-label="Facebook SMK Budi Mulia Karawang" className="text-gray-400 hover:text-purple-400 transition-colors">
                    <Facebook size={24} />
                  </a>
                  <a href="#" aria-label="Instagram SMK Budi Mulia Karawang" className="text-gray-400 hover:text-purple-400 transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href="#" aria-label="Twitter SMK Budi Mulia Karawang" className="text-gray-400 hover:text-purple-400 transition-colors">
                    <Twitter size={24} />
                  </a>
                  <a href="#" aria-label="Youtube SMK Budi Mulia Karawang" className="text-gray-400 hover:text-purple-400 transition-colors">
                    <Youtube size={24} />
                  </a>
                </div>
                <div className="mt-6">
                  <img  alt="Peta Lokasi SMK Budi Mulia Karawang" class="w-full h-32 object-cover rounded-lg shadow-md border border-gray-700" src="https://images.unsplash.com/photo-1676905505142-c6bb852c40cf" />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-sm">
                &copy; {currentYear} SMK Budi Mulia Karawang. Semua Hak Dilindungi.
              </p>
              <p className="text-xs mt-1">
                Didesain dan Dikembangkan dengan ❤️ oleh Tim IT SMK Budi Mulia Karawang.
              </p>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;
  