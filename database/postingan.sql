CREATE TABLE IF NOT EXISTS postingan (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image LONGTEXT,
    type VARCHAR(50) DEFAULT 'berita',
    category VARCHAR(100),
    author VARCHAR(100),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
