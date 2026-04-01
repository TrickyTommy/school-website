CREATE TABLE IF NOT EXISTS postingan (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image LONGTEXT,
    video_url VARCHAR(500),
    video_file LONGTEXT,
    type VARCHAR(50) DEFAULT 'berita',
    category VARCHAR(100),
    author VARCHAR(100),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jika tabel sudah ada, tambahkan kolom yang belum ada:
ALTER TABLE postingan ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);
ALTER TABLE postingan ADD COLUMN IF NOT EXISTS video_file LONGTEXT;
