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
            // Check if requesting full data (for detail view)
            $fullData = !empty($_GET['full']) || !empty($_GET['id']);
            
            if (!empty($_GET['id'])) {
                // Get single item with full media data
                $stmt = $pdo->prepare("SELECT * FROM tentang_kami WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                $item = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$item) {
                    throw new Exception('Item tidak ditemukan');
                }

                $mediaStmt = $pdo->prepare("SELECT * FROM tentang_kami_media WHERE tentang_kami_id = ? ORDER BY display_order ASC");
                $mediaStmt->execute([$item['id']]);
                $item['media'] = $mediaStmt->fetchAll(PDO::FETCH_ASSOC);
                
                ob_clean();
                echo json_encode(['status' => 'success', 'data' => $item]);
            } else {
                // Get all items - exclude heavy base64 data by default
                $stmt = $pdo->query("SELECT * FROM tentang_kami WHERE is_active = TRUE ORDER BY display_order ASC");
                $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($items as &$item) {
                    $mediaStmt = $pdo->prepare("SELECT * FROM tentang_kami_media WHERE tentang_kami_id = ? ORDER BY display_order ASC");
                    $mediaStmt->execute([$item['id']]);
                    $allMedia = $mediaStmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    // Process media: keep first one fully intact, strip file from others
                    $processedMedia = [];
                    foreach ($allMedia as $index => $media) {
                        if ($index === 0) {
                            // Keep first media fully intact (with base64 for thumbnail)
                            $processedMedia[] = $media;
                        } else {
                            // Remove file field from other media to save bandwidth
                            unset($media['file']);
                            $processedMedia[] = $media;
                        }
                    }
                    $item['media'] = $processedMedia;
                }
                
                ob_clean();
                echo json_encode([
                    'status' => 'success',
                    'data'   => $items
                ]);
            }
            break;

        case 'POST':
            if (!$data || empty($data['title'])) {
                throw new Exception('Data tidak valid: title wajib diisi');
            }

            $itemId = $data['id'] ?? uniqid('tentang_');
            
            $sql = "INSERT INTO tentang_kami
                        (id, title, description, icon_type, display_order, is_active)
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $itemId,
                $data['title'],
                $data['description']  ?? '',
                $data['icon_type']    ?? null,
                $data['display_order'] ?? 0,
                $data['is_active']    ?? true
            ]);

            // Insert media items
            if (!empty($data['media']) && is_array($data['media'])) {
                $mediaStmt = $pdo->prepare("INSERT INTO tentang_kami_media (id, tentang_kami_id, type, url, file, display_order) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($data['media'] as $index => $mediaItem) {
                    $mediaStmt->execute([
                        uniqid('media_'),
                        $itemId,
                        $mediaItem['type'] ?? 'image',
                        $mediaItem['url'] ?? null,
                        $mediaItem['file'] ?? null,
                        $mediaItem['display_order'] ?? $index
                    ]);
                }
            }

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
                        icon_type      = ?,
                        display_order  = ?,
                        is_active      = ?
                    WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['title'],
                $data['description']  ?? '',
                $data['icon_type']    ?? null,
                $data['display_order'] ?? 0,
                $data['is_active']    ?? true,
                $data['id']
            ]);

            // Process media intelligently
            if (!empty($data['media']) && is_array($data['media'])) {
                // Collect IDs of submitted media items
                $submittedMediaIds = [];
                foreach ($data['media'] as $mediaItem) {
                    if (!empty($mediaItem['id'])) {
                        $submittedMediaIds[] = $mediaItem['id'];
                    }
                }

                // Delete media items that are NOT in the submitted list (these are deleted items)
                if (!empty($submittedMediaIds)) {
                    $placeholders = implode(',', array_fill(0, count($submittedMediaIds), '?'));
                    $deleteStmt = $pdo->prepare("DELETE FROM tentang_kami_media WHERE tentang_kami_id = ? AND id NOT IN ($placeholders)");
                    $deleteStmt->execute(array_merge([$data['id']], $submittedMediaIds));
                } else {
                    // If no existing IDs submitted, delete all old media
                    $deleteStmt = $pdo->prepare("DELETE FROM tentang_kami_media WHERE tentang_kami_id = ?");
                    $deleteStmt->execute([$data['id']]);
                }

                // Now update/insert media items
                $updateStmt = $pdo->prepare("UPDATE tentang_kami_media SET type = ?, url = ?, file = ?, display_order = ? WHERE id = ?");
                $insertStmt = $pdo->prepare("INSERT INTO tentang_kami_media (id, tentang_kami_id, type, url, file, display_order) VALUES (?, ?, ?, ?, ?, ?)");

                foreach ($data['media'] as $index => $mediaItem) {
                    if (!empty($mediaItem['id'])) {
                        // Update existing media
                        $updateStmt->execute([
                            $mediaItem['type'] ?? 'image',
                            $mediaItem['url'] ?? null,
                            $mediaItem['file'] ?? null,
                            $mediaItem['display_order'] ?? $index,
                            $mediaItem['id']
                        ]);
                    } else {
                        // Insert new media
                        $insertStmt->execute([
                            uniqid('media_'),
                            $data['id'],
                            $mediaItem['type'] ?? 'image',
                            $mediaItem['url'] ?? null,
                            $mediaItem['file'] ?? null,
                            $mediaItem['display_order'] ?? $index
                        ]);
                    }
                }
            } else {
                // If no media submitted, delete all old media
                $deleteStmt = $pdo->prepare("DELETE FROM tentang_kami_media WHERE tentang_kami_id = ?");
                $deleteStmt->execute([$data['id']]);
            }

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
