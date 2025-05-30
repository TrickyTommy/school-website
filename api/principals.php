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
                $stmt = $db->query("SELECT id, nama, tahun_jabatan, foto FROM principals ORDER BY created_at DESC");
                $principals = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['status' => 'success', 'data' => $principals]);
                break;

            case 'POST':
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (empty($data['nama']) || empty($data['tahun_jabatan'])) {
                    throw new Exception('Nama dan periode harus diisi');
                }

                $stmt = $db->prepare("INSERT INTO principals (nama, tahun_jabatan, foto) VALUES (?, ?, ?)");
                $stmt->execute([
                    $data['nama'],
                    $data['tahun_jabatan'],
                    $data['foto'] ?? null
                ]);
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Data kepala sekolah berhasil ditambahkan'
                ]);
                break;

            case 'PUT':
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (empty($data['nama']) || empty($data['tahun_jabatan'])) {
                    throw new Exception('Nama dan periode harus diisi');
                }

                $stmt = $db->prepare("UPDATE principals SET nama = ?, tahun_jabatan = ?, foto = ? WHERE id = ?");
                $stmt->execute([
                    $data['nama'],
                    $data['tahun_jabatan'],
                    $data['foto'] ?? null,
                    $data['id']
                ]);
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Data kepala sekolah berhasil diperbarui'
                ]);
                break;

            case 'DELETE':
                $id = $_GET['id'] ?? null;
                if (!$id) {
                    throw new Exception('ID tidak ditemukan');
                }
                
                $stmt = $db->prepare("DELETE FROM principals WHERE id = ?");
                $result = $stmt->execute([$id]);
                
                if ($result) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Data kepala sekolah berhasil dihapus'
                    ]);
                } else {
                    throw new Exception('Gagal menghapus data');
                }
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
    ?>
