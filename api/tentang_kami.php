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

    // Support method override via header atau field _method di body
    $method = $_SERVER['REQUEST_METHOD'];
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if ($method === 'POST') {
        $override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']
                 ?? ($data['_method'] ?? null);
        if ($override && in_array(strtoupper($override), ['PUT', 'DELETE'])) {
            $method = strtoupper($override);
        }
    }

    switch ($method) {
        case 'GET':
            // Get all tentang kami items, ordered by display_order
            $stmt = $pdo->query("SELECT * FROM tentang_kami WHERE is_active = TRUE ORDER BY display_order ASC");
            ob_clean();
            echo json_encode([
                'status' => 'success',
                'data'   => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ]);
            break;

        case 'POST':
            if (!$data || empty($data['title'])) {
                throw new Exception('Data tidak valid: title wajib diisi');
            }

            $sql = "INSERT INTO tentang_kami
                        (id, title, description, image, video_url, video_file, icon_type, display_order, is_active)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['id']           ?? uniqid('tentang_'),
                $data['title'],
                $data['description']  ?? '',
                $data['image']        ?? null,
                $data['video_url']    ?? null,
                $data['video_file']   ?? null,
                $data['icon_type']    ?? null,
                $data['display_order'] ?? 0,
                $data['is_active']    ?? true
            ]);

            ob_clean();
            echo json_encode(['status' => 'success', 'message' => 'Data tentang kami berhasil dibuat']);
            break;

        case 'PUT':
            if (!$data || empty($data['id'])) {
                throw new Exception('Data tidak valid: id wajib diisi untuk update');
            }

            $sql = "UPDATE tentang_kami SET
                        title          = ?,
                        description    = ?,
                        image          = ?,
                        video_url      = ?,
                        video_file     = ?,
                        icon_type      = ?,
                        display_order  = ?,
                        is_active      = ?
                    WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['title'],
                $data['description']  ?? '',
                $data['image']        ?? null,
                $data['video_url']    ?? null,
                $data['video_file']   ?? null,
                $data['icon_type']    ?? null,
                $data['display_order'] ?? 0,
                $data['is_active']    ?? true,
                $data['id']
            ]);

            ob_clean();
            echo json_encode(['status' => 'success', 'message' => 'Data tentang kami berhasil diperbarui']);
            break;

        case 'DELETE':
            if (empty($_GET['id'])) {
                throw new Exception('ID wajib disertakan untuk delete');
            }
            $stmt = $pdo->prepare("DELETE FROM tentang_kami WHERE id = ?");
            $stmt->execute([$_GET['id']]);

            ob_clean();
            echo json_encode(['status' => 'success', 'message' => 'Data tentang kami berhasil dihapus']);
            break;

        default:
            http_response_code(405);
            ob_clean();
            echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
            break;
    }

} catch (PDOException $e) {
    error_log('DB Error tentang_kami.php: ' . $e->getMessage());
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
