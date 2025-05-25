<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT * FROM postingan ORDER BY date DESC");
            echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO postingan (id, title, content, image, type, category, author) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['id'] ?? uniqid('post_'),
                $data['title'],
                $data['content'],
                $data['image'] ?? null,
                $data['type'] ?? 'berita',
                $data['category'] ?? null,
                $data['author'] ?? 'Admin'
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Post created']);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                throw new Exception('ID is required');
            }
            $stmt = $pdo->prepare("DELETE FROM postingan WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(['status' => 'success', 'message' => 'Post deleted']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
