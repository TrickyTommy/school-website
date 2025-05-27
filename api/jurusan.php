<?php
ob_start();

error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    if (!file_exists('config.php')) {
        throw new Exception('Configuration file not found');
    }

    require_once 'config.php';

    if (!isset($host) || !isset($dbname) || !isset($username)) {
        throw new Exception('Invalid database configuration');
    }

    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            $stmt = $db->prepare("SELECT * FROM jurusan ORDER BY name");
            $stmt->execute();
            $jurusan = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'data' => $jurusan
            ]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data');
            }
            
            $stmt = $db->prepare("INSERT INTO jurusan (name, description, icon, image, video_url, color) VALUES (?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                $data['name'] ?? null,
                $data['description'] ?? null,
                $data['icon'] ?? null,
                $data['image'] ?? null,
                $data['videoUrl'] ?? null,
                $data['color'] ?? null
            ]);
            
            echo json_encode(['status' => 'success', 'message' => 'Jurusan berhasil ditambahkan']);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data');
            }
            
            if (!isset($data['id'])) {
                throw new Exception('ID is required');
            }
            
            $stmt = $db->prepare("UPDATE jurusan SET name=?, description=?, icon=?, image=?, video_url=?, color=? WHERE id=?");
            
            $stmt->execute([
                $data['name'] ?? null,
                $data['description'] ?? null,
                $data['icon'] ?? null,
                $data['image'] ?? null,
                $data['videoUrl'] ?? null,
                $data['color'] ?? null,
                $data['id']
            ]);
            
            echo json_encode(['status' => 'success', 'message' => 'Jurusan berhasil diperbarui']);
            break;

        case 'DELETE':
            $id = $_GET['id'];
            
            $stmt = $db->prepare("DELETE FROM jurusan WHERE id=?");
            $stmt->execute([$id]);
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Jurusan berhasil dihapus'
            ]);
            break;
    }
} catch(PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    ob_end_flush();
}
