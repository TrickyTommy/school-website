import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Phone, Mail, MapPin, Send } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const KontakPage = () => {
      const { toast } = useToast();

      const handleSubmit = (e) => {
        e.preventDefault();
        toast({
          title: "Pesan Terkirim!",
          description: "Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.",
          variant: "default",
        });
        e.target.reset();
      };

      const fadeInUp = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
      };

      return (
        <div className="space-y-12">
          <motion.section
            className="py-12 text-center bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl shadow-xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Hubungi Kami</h1>
            <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
              Kami siap membantu Anda. Jangan ragu untuk menghubungi kami melalui informasi kontak di bawah ini atau kirimkan pesan melalui formulir.
            </p>
          </motion.section>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Card className="shadow-xl glassmorphic dark:bg-gray-800/60">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">Alamat Sekolah</p>
                      <p className="text-gray-600 dark:text-gray-300">Jl. Ciherang, Wadas, Telukjambe Timur, Karawang, Jawa Barat 41361, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">Telepon</p>
                      <p className="text-gray-600 dark:text-gray-300">(0267) 865-8659</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">info@smkbudimuliakrw.sch.id</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <motion.div className="mt-8" variants={fadeInUp}>
                 <Card className="shadow-xl glassmorphic dark:bg-gray-800/60">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Lokasi Kami</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                           <iframe 
                                src="https://www.openstreetmap.org/export/embed.html?bbox=107.2900%2C-6.3300%2C107.3100%2C-6.3100&layer=mapnik&marker=-6.3200,107.3000" 
                                style={{border:0, width: '100%', height: '100%'}} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Peta Lokasi SMK Budi Mulia Karawang"
                            ></iframe>
                        </div>
                    </CardContent>
                 </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Card className="shadow-xl glassmorphic dark:bg-gray-800/60">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Kirim Pesan</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">Nama Lengkap</Label>
                      <Input id="name" type="text" placeholder="Masukkan nama Anda" required className="mt-1 bg-white/70 dark:bg-gray-700/50" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Alamat Email</Label>
                      <Input id="email" type="email" placeholder="Masukkan email Anda" required className="mt-1 bg-white/70 dark:bg-gray-700/50" />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-gray-700 dark:text-gray-200">Subjek</Label>
                      <Input id="subject" type="text" placeholder="Masukkan subjek pesan" required className="mt-1 bg-white/70 dark:bg-gray-700/50" />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-gray-700 dark:text-gray-200">Pesan Anda</Label>
                      <Textarea id="message" placeholder="Tuliskan pesan Anda di sini..." rows={5} required className="mt-1 bg-white/70 dark:bg-gray-700/50" />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                      <Send className="mr-2 h-5 w-5" /> Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      );
    };

    export default KontakPage;