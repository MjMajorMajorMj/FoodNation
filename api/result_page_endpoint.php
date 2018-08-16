<?php
require '../backend/build_database/mysql_connect.php';

$output = [
    'success' => false,
    'error' => []
];

$countryCode = $_GET['countryCode'];

$query = "SELECT `name`, `food1`, `food2`, `food3`, `food4`, `food5` FROM `country` WHERE `abbreviation`='{$countryCode}'";
$result = mysqli_query($conn,$query);

$row = mysqli_fetch_row($result);
$countryName = $row[0];

//Pick a random foodId
$foodId = '0';
while($foodId === '0'){
    $foodId = $row[rand(1,5)];
}

$query = "SELECT `name`, `image`, `description`, `video1`, `video2`, `video3` FROM `food` WHERE `id`=$foodId";
$result = mysqli_query($conn,$query);

//Return image and videos
$resultAssocArr = mysqli_fetch_assoc($result);
$output['data'] = [
    'countryName' => $countryName,
    'name' => $resultAssocArr['name'],
    'image' => $resultAssocArr['image'],
    'description' => $resultAssocArr['description'],
    'videoIds' => [
        $resultAssocArr['video1'],
        $resultAssocArr['video2'],
        $resultAssocArr['video3']
        ]
];
$output['success'] = true;

function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}
// $output = json_encode(utf8ize($output));
$output = json_encode($output);
print($output);