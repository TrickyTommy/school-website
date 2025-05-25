CREATE TABLE guru_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('principal', 'vice_principal', 'teacher', 'staff') NOT NULL,
    type VARCHAR(50),
    subject VARCHAR(255),
    expertise VARCHAR(255),
    position VARCHAR(255),
    image LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);