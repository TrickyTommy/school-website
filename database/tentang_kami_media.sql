-- Create media table for tentang_kami
CREATE TABLE IF NOT EXISTS tentang_kami_media (
    id VARCHAR(50) PRIMARY KEY,
    tentang_kami_id VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'image' or 'video'
    url VARCHAR(500),
    file LONGTEXT, -- Base64 encoded file
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tentang_kami_id) REFERENCES tentang_kami(id) ON DELETE CASCADE,
    INDEX idx_tentang_kami_id (tentang_kami_id)
);

-- Alter tentang_kami table to remove old media columns
ALTER TABLE tentang_kami DROP COLUMN IF EXISTS image;
ALTER TABLE tentang_kami DROP COLUMN IF EXISTS video_url;
ALTER TABLE tentang_kami DROP COLUMN IF EXISTS video_file;
