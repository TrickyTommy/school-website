<?php
// Prevent stray output that breaks JSON
ob_start();

// Suppress PHP errors from leaking into JSON response
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once 'config.php';

    // Support method override: jika POST dengan header/field X-HTTP-Method-Override atau _method
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'POST') {
        $input = file_get_contents('php://input');
        $data  = json_decode($input, true);
        $override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']
                 ?? ($data['_method'] ?? null);
        if ($override && in_array(strtoupper($override), ['PUT', 'DELETE'])) {
            $method = strtoupper($override);
        }
    }

    switch ($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT * FROM postingan ORDER BY date DESC");
            ob_clean();
            echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || empty($data['title'])) {
                throw new Exception('Data tidak valid: title wajib diisi');
            }

            $sql = "INSERT INTO postingan (id, title, content, image, type, category, author)
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['id'] ?? uniqid('post_'),
                $data['title'],
                $data['content'] ?? '',
                $data['image'] ?? null,
                $data['type'] ?? 'berita',
                $data['category'] ?? null,
                $data['author'] ?? 'Admin'
            ]);

            ob_clean();
            echo json_encode(['status' => 'success', 'message' => 'Postingan berhasil dibuat']);
            break;

        case 'PUT':
            $data = $data ?? json_decode(file_get_contents('php://input'), true);
            if (!$data || empty($data['id'])) {
                throw new Exception('Data tidak valid: id wajib diisi untuk update');
            }

            $sql = "UPDATE postingan SET
                        title    = ?,
                        content  = ?,
                        image    = ?,
                        type     = ?,
                        category = ?
                    WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['title'],
                $data['content'] ?? '',
                $data['image'] ?? null,
                $data['type'] ?? 'berita',
                $data['category'] ?? null,
                $data['id']
            ]);

            ob_clean();
            echo json_encode(['status' => 'success', 'message' => 'Postingan berhasil diperbarui']);
            break;

        case 'DELETE':
            if (empty($_GET['id'])) {
                throw new Exception('ID wajib disertakan untuk delete');
            }
            $stmt = $pdo->prepare("DELETE FROM postingan WHERE id = ?");
            $stmt->execute([$_GET['id']]);

            ob_clean();
            echo json_encode(['status' => 'success', 'message' => 'Postingan berhasil dihapus']);
            break;

        default:
            http_response_code(405);
            ob_clean();
            echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
            break;
    }
} catch (PDOException $e) {
    error_log('DB Error postingan.php: ' . $e->getMessage());
    ob_clean();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    ob_clean();
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    ob_end_flush();
}
