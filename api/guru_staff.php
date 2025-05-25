<?php
// Prevent any output
ob_start();

// Disable error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Check if config file exists
    if (!file_exists('config.php')) {
        throw new Exception('Configuration file not found');
    }

    require_once 'config.php';

    // Validate database configuration
    if (!isset($host) || !isset($dbname) || !isset($username)) {
        throw new Exception('Invalid database configuration');
    }

    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    switch($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Modified query to explicitly select all fields
            $stmt = $db->query('SELECT id, name, email, role, type, subject, expertise, position, image 
                              FROM guru_staff 
                              ORDER BY FIELD(role, "principal", "vice_principal", "program_head", "teacher", "staff")');
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Debug log
            error_log('Fetched data: ' . print_r($result, true));
            
            echo json_encode([
                'status' => 'success',
                'data' => $result,
                'count' => count($result)
            ]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare('INSERT INTO guru_staff (name, email, role, type, subject, expertise, position, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['role'],
                $data['type'] ?? null,
                $data['subject'] ?? null,
                $data['expertise'] ?? null,
                $data['position'] ?? null,
                $data['image'] ?? null
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Data berhasil ditambahkan']);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare('UPDATE guru_staff SET name=?, email=?, role=?, type=?, subject=?, expertise=?, position=?, image=? WHERE id=?');
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['role'],
                $data['type'] ?? null,
                $data['subject'] ?? null,
                $data['expertise'] ?? null,
                $data['position'] ?? null,
                $data['image'] ?? null,
                $data['id']
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Data berhasil diperbarui']);
            break;

        case 'DELETE':
            $id = $_GET['id'];
            $stmt = $db->prepare('DELETE FROM guru_staff WHERE id = ?');
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Data berhasil dihapus']);
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
    // Ensure all output is sent
    ob_end_flush();
}
