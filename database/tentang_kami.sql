CREATE TABLE IF NOT EXISTS tentang_kami (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image LONGTEXT,
    video_url VARCHAR(500),
    video_file LONGTEXT,
    icon_type VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jika tabel sudah ada, tambahkan kolom yang belum ada:
ALTER TABLE tentang_kami ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);
ALTER TABLE tentang_kami ADD COLUMN IF NOT EXISTS video_file LONGTEXT;
ALTER TABLE tentang_kami ADD COLUMN IF NOT EXISTS icon_type VARCHAR(50);
ALTER TABLE tentang_kami ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE tentang_kami ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE tentang_kami ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Insert data default jika belum ada
INSERT INTO tentang_kami (id, title, description, icon_type, display_order, is_active) VALUES 
  ('sejarah', 'Sejarah Singkat', 'SMK Budi Mulia Karawang didirikan pada tahun 2013 dengan komitmen untuk menyediakan pendidikan kejuruan berkualitas yang relevan dengan kebutuhan industri. Sejak awal pendiriannya, sekolah kami terus berkembang dan berinovasi untuk mencetak lulusan yang siap kerja dan berkarakter.', 'History', 1, TRUE) ON DUPLICATE KEY UPDATE updated_at = NOW(),
  ('fasilitas', 'Fasilitas Sekolah', 'Kami memiliki fasilitas lengkap untuk mendukung proses belajar mengajar, termasuk ruang kelas yang nyaman, laboratorium komputer modern, bengkel praktik sesuai jurusan, perpustakaan dengan koleksi buku lengkap, lapangan olahraga, dan kantin yang bersih.', 'Building', 2, TRUE) ON DUPLICATE KEY UPDATE updated_at = NOW(),
  ('prestasi', 'Prestasi Sekolah', 'SMK Budi Mulia Karawang telah meraih berbagai prestasi baik di bidang akademik maupun non-akademik, mulai dari tingkat kabupaten, provinsi, hingga nasional. Prestasi ini merupakan bukti komitmen kami terhadap kualitas pendidikan.', 'Award', 3, TRUE) ON DUPLICATE KEY UPDATE updated_at = NOW(),
  ('komunitas', 'Komunitas Sekolah', 'Kami bangga memiliki komunitas sekolah yang solid dan suportif, terdiri dari siswa-siswi yang antusias, guru-guru yang berdedikasi, staf yang profesional, serta orang tua dan alumni yang peduli terhadap kemajuan sekolah.', 'Users', 4, TRUE) ON DUPLICATE KEY UPDATE updated_at = NOW();
