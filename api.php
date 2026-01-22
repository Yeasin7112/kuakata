<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$db_file = __DIR__ . '/database.sqlite';
try {
    $db = new PDO("sqlite:$db_file");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create Tables
    $db->exec("CREATE TABLE IF NOT EXISTS site_config (key_name TEXT PRIMARY KEY, data TEXT)");
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE, 
        password TEXT, 
        name TEXT, 
        role TEXT,
        data TEXT
    )");

    // Seed Data if empty
    $check = $db->query("SELECT COUNT(*) FROM site_config")->fetchColumn();
    if ($check == 0) {
        $defaults = [
            'hero' => ['bn' => 'Welcome to', 'subBn' => 'The largest sea beach in the world.'],
            'ticker' => ['bn' => 'কুয়াকাটা জেলা প্রশাসনের সকল ডিজিটাল সেবা এখন আপনার হাতের মুঠোয়। অনলাইনে বুকিং দিন, অভিযোগ জমা দিন।'],
            'features' => [
                ['id' => 'spots', 'label' => 'Tourist Spots', 'icon' => 'https://cdn-icons-png.flaticon.com/512/2560/2560421.png', 'path' => '/places'],
                ['id' => 'weather', 'label' => 'Weather Update', 'icon' => 'https://cdn-icons-png.flaticon.com/512/1163/1163763.png', 'path' => '/weather'],
                ['id' => 'hotel', 'label' => 'Find Your Accommodation', 'icon' => 'https://cdn-icons-png.flaticon.com/512/2316/2316041.png', 'path' => '/hotels'],
                ['id' => 'transport', 'label' => 'Transport Counter', 'icon' => 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', 'path' => '/transport'],
                ['id' => 'upcoming', 'label' => 'Upcoming', 'icon' => 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png', 'path' => '/upcoming'],
                ['id' => 'dc', 'label' => 'DC Initiatives', 'icon' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/1200px-Government_Seal_of_Bangladesh.svg.png', 'path' => '/dc'],
                ['id' => 'bank', 'label' => 'Bank/ATM', 'icon' => 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png', 'path' => '/bank'],
                ['id' => 'caution', 'label' => 'Caution Area', 'icon' => 'https://cdn-icons-png.flaticon.com/512/564/564619.png', 'path' => '/warning'],
                ['id' => 'bus', 'label' => 'Tourist Bus', 'icon' => 'https://cdn-icons-png.flaticon.com/512/3462/3462214.png', 'path' => '/tourist-bus'],
                ['id' => 'kitkat', 'label' => 'Kitkat Chair', 'icon' => 'https://cdn-icons-png.flaticon.com/512/2664/2664654.png', 'path' => '/kitkat'],
                ['id' => 'complaints', 'label' => 'Complaints & Advice', 'icon' => 'https://cdn-icons-png.flaticon.com/512/10312/10312384.png', 'path' => '/complaints'],
                ['id' => 'restaurant', 'label' => 'Restaurant', 'icon' => 'https://cdn-icons-png.flaticon.com/512/1046/1046782.png', 'path' => '/restaurant'],
                ['id' => 'ai', 'label' => 'AI Tour Planner', 'icon' => 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png', 'path' => '/ai-planner']
            ],
            'emergency' => [
                ['id' => 'e1', 'name' => 'জেলা প্রশাসন পর্যটন সেল', 'phone' => '01700-000000', 'icon' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/1200px-Government_Seal_of_Bangladesh.svg.png'],
                ['id' => 'e2', 'name' => 'টুরিস্ট পুলিশ', 'phone' => '01320-000000', 'icon' => 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Bangladesh_Police_Logo.svg/1200px-Bangladesh_Police_Logo.svg.png'],
                ['id' => 'e3', 'name' => 'ডাক্তার', 'phone' => '16263', 'icon' => 'https://cdn-icons-png.flaticon.com/512/2785/2785482.png'],
                ['id' => 'e4', 'name' => 'লাইফগার্ড', 'phone' => '01711-000000', 'icon' => 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png'],
                ['id' => 'e5', 'name' => 'বিচ কর্মী', 'phone' => '01700-111111', 'icon' => 'https://cdn-icons-png.flaticon.com/512/2721/2721115.png'],
                ['id' => 'e6', 'name' => 'বাংলাদেশ পর্যটন কর্পোরেশন', 'phone' => '02-0000000', 'icon' => 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Bangladesh_Parjatan_Corporation_logo.png']
            ],
            'announcements' => [
                ['id' => 'a1', 'date' => '১১ ডিসেম্বর, ২০২৪', 'content' => 'সমস্ত ভ্রমণকারীদের জানানো যাচ্ছে যে, রক্ষণাবেক্ষণ কাজের কারণে কিছু রুটে সাময়িক বিঘ্ন ঘটতে পারে। অনুগ্রহ করে আপডেট করা সময়সূচি পরীক্ষা করে ভ্রমণের পরিকল্পনা করুন।']
            ]
        ];
        foreach($defaults as $k => $v) {
            $db->prepare("INSERT INTO site_config (key_name, data) VALUES (?, ?)")->execute([$k, json_encode($v)]);
        }
    }

    // Seed Specific Admin
    $adminEmail = 'helloyeasin00@gmail.com';
    $adminCheck = $db->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $adminCheck->execute([$adminEmail]);
    if ($adminCheck->fetchColumn() == 0) {
        $db->prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)")
           ->execute([$adminEmail, 'Me@Yeasin007', 'Yeasin Admin', 'ADMIN']);
    }

} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? 'get_config';

if ($action === 'login') {
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
    $stmt->execute([$input['email'], $input['password']]);
    $user = $stmt->fetch(PDO::ATTR_ASSOC);
    echo json_encode($user ? ['status' => 'success', 'user' => $user] : ['status' => 'error']);
    exit;
}

if ($action === 'signup') {
    try {
        $stmt = $db->prepare("INSERT INTO users (email, password, name, role, data) VALUES (?, ?, ?, 'USER', ?)");
        $stmt->execute([$input['email'], $input['password'], $input['name'], json_encode($input)]);
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
    }
    exit;
}

if ($action === 'get_config') {
    $stmt = $db->query("SELECT * FROM site_config");
    $res = $stmt->fetchAll(PDO::ATTR_ASSOC);
    $out = [];
    foreach($res as $r) $out[$r['key_name']] = json_decode($r['data']);
    echo json_encode($out);
    exit;
}

if ($action === 'update_config') {
    $db->prepare("INSERT OR REPLACE INTO site_config (key_name, data) VALUES (?, ?)")
       ->execute([$input['key'], json_encode($input['data'])]);
    echo json_encode(['status' => 'success']);
    exit;
}