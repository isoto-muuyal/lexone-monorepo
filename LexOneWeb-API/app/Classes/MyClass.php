<?php
namespace App\Classes;

use Session;
use App\Models\Accounts;
use App\Models\Setting;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Kreait\Firebase\Messaging\AndroidConfig;
use Kreait\Firebase\Messaging\ApnsConfig;
use \Firebase\JWT\JWT;
class MyClass
{
    private $messaging;
    public static function site_settings()
    {
        $siteSettings = Setting::first();
        return $siteSettings;
    }

    public static function default_userimage()
    {
        $siteSettings = Setting::first();
        return $siteSettings->default_usr_img;

    }
    public function __construct()
        {
            $serviceAccountKeyFilePath = '/var/www/html/public/admin_assets/modular-bucksaw-421523-firebase-adminsdk-w7ii6-50674802f4.json';
        
            $factory = (new Factory)
                ->withServiceAccount($serviceAccountKeyFilePath);
    
            $this->messaging = $factory->createMessaging();
        }
    
        // public function android_push_notification($deviceTokens, $title, $to = 'one', $scope = "admin")
        // {
        //     $siteSettings = Setting::first();
            
           
        //     $notification = Notification::create($siteSettings->siteName . " Team", $title);
    
        //     $data = [
        //         'title' => $siteSettings->siteName . " Team",
        //         'message' => json_encode(["message" => $title, "type" => "text"]),
        //         'scope' => $scope
        //     ];
    
            
        //     $androidConfig = AndroidConfig::fromArray([
        //         'priority' => 'high',
        //     ]);
            
        //     if ($to == 'one') {
        //         $message = CloudMessage::withTarget('token', $deviceTokens)
        //             ->withNotification($notification)
        //             ->withData($data)
        //             ->withAndroidConfig($androidConfig);
    
        //         $this->messaging->send($message); 
               
        //     } else {
        //         $messages = [];
                
        //         foreach ($deviceTokens as $token) {
        //             $messages[] = CloudMessage::withTarget('token', $token)
        //                 ->withNotification($notification)
        //                 ->withData($data)
        //                 ->withAndroidConfig($androidConfig);
                        
        //         }
    
        //         $responses = $this->messaging->sendAll($messages); 
                
        //         foreach ($responses->failures()->getItems() as $failure) {
                    
        //             error_log($failure->error()->getMessage());
        //         }
        //     }
    
        //     return true;
        // }
    

    
    
    

    
        public function ios_push_notification($tokens, $title, $to='one',$scope = "admin")
{
    $fcmUrl = 'https://fcm.googleapis.com/v1/projects/modular-bucksaw-421523/messages:send';
    $siteSettings = Setting::first();

    // Load the service account key file
    $serviceAccountKeyFilePath = '/var/www/html/public/admin_assets/modular-bucksaw-421523-firebase-adminsdk-w7ii6-50674802f4.json';
    $serviceAccountKey = json_decode(file_get_contents($serviceAccountKeyFilePath), true);

    // Generate JWT for authorization
    $now_seconds = time();
    $claims = [
        "iss" => $serviceAccountKey['client_email'],
        "scope" => "https://www.googleapis.com/auth/firebase.messaging",
        "aud" => "https://oauth2.googleapis.com/token",
        "iat" => $now_seconds,
        "exp" => $now_seconds + 3600
    ];

    $jwt = JWT::encode($claims, $serviceAccountKey['private_key'], 'RS256');

    // Get OAuth 2.0 access token using the JWT
    $oauth2Url = "https://oauth2.googleapis.com/token";
    $oauth2Payload = json_encode([
        "grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion" => $jwt
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $oauth2Url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $oauth2Payload);
    $oauth2Response = curl_exec($ch);
    curl_close($ch);

    if ($oauth2Response === false) {
        error_log("OAuth2 request failed: " . curl_error($ch));
        return false;
    }

    $oauth2ResponseData = json_decode($oauth2Response, true);
    if (!isset($oauth2ResponseData['access_token'])) {
        error_log("Access token not found in OAuth2 response");
        return false;
    }

    $accessToken = $oauth2ResponseData['access_token'];
    if ($scope = "admin") {
        $notification = [
            'message' => json_encode(["message"=>$title,"type"=>"text"]),
            'scope' => 'admin'
        ];
    }
    else{
        $notification = [
            'message' => json_encode(["message"=>$title,"type"=>"text"]),
            'scope' => 'admin'
        ];
    }
    
    $notification_data = array('notification_data' =>json_encode($notification) );
    
    // Construct the message payload template
    $messagePayloadTemplate = [
        'message' => [
            'data' => $notification_data,
            'notification' => [
                'title' =>  $siteSettings->siteName." "."Team",
                'body' => $title
            ],
           
            'apns' => [
                'headers' => [
                    'apns-priority' => '10'
                ],
                'payload' => [
                    'aps' => [
                        'alert' => [
                            'title' => $siteSettings->siteName." "."Team",
                            'body' => $title
                        ],
                        'sound' => 'default'
                    ]
                ]
            ]
            
        ]
    ];

    // Initialize a new cURL session for FCM request
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fcmUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // Handle the tokens array
    foreach ($tokens as $token) {
        $messagePayload = $messagePayloadTemplate;
        $messagePayload['message']['token'] = $token;
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messagePayload));
        $result = curl_exec($ch);
        
        if ($result === false) {
            error_log("FCM request failed for token $token: " . curl_error($ch));
            continue;  // Log error or handle failure for individual tokens as needed
        }
        
        $response = json_decode($result, true);
        if (isset($response['error'])) {
            if ($response['error']['message'] == 'UNREGISTERED') {
                error_log("Token $token is unregistered");
                // Optionally, remove the token from your database here
            } else {
                error_log("Error sending message to token $token: " . $response['error']['message']);
            }
            continue;
        }

        if (!isset($response['name'])) {
            error_log("FCM response for token $token did not contain a name");
            continue;
        }
    }

    curl_close($ch);
    return true;
}

        
    
 
public function web_push_notification($tokens, $title, $scope = "admin")
{
    $fcmUrl = 'https://fcm.googleapis.com/v1/projects/modular-bucksaw-421523/messages:send';

    // Load the service account key file
    $serviceAccountKeyFilePath = '/var/www/html/public/admin_assets/modular-bucksaw-421523-firebase-adminsdk-w7ii6-50674802f4.json';
    $serviceAccountKey = json_decode(file_get_contents($serviceAccountKeyFilePath), true);

    // Generate JWT for authorization
    $now_seconds = time();
    $claims = [
        "iss" => $serviceAccountKey['client_email'],
        "scope" => "https://www.googleapis.com/auth/firebase.messaging",
        "aud" => "https://oauth2.googleapis.com/token",
        "iat" => $now_seconds,
        "exp" => $now_seconds + 3600
    ];

    $jwt = JWT::encode($claims, $serviceAccountKey['private_key'], 'RS256');

    // Get OAuth 2.0 access token using the JWT
    $oauth2Url = "https://oauth2.googleapis.com/token";
    $oauth2Payload = json_encode([
        "grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion" => $jwt
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $oauth2Url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $oauth2Payload);
    $oauth2Response = curl_exec($ch);
    curl_close($ch);

    if ($oauth2Response === false) {
        error_log("OAuth2 request failed: " . curl_error($ch));
        return false;
    }

    $oauth2ResponseData = json_decode($oauth2Response, true);
    if (!isset($oauth2ResponseData['access_token'])) {
        error_log("Access token not found in OAuth2 response");
        return false;
    }

    $accessToken = $oauth2ResponseData['access_token'];

    // Construct the message payload template
    $messagePayloadTemplate = [
        'message' => [
            'notification' => [
                'title' => $title,
                'body' => $title
            ],
            'webpush' => [
                'headers' => [
                    'Urgency' => 'high'
                ],
                'notification' => [
                    'title' => $title,
                    'body' => $title,
                    'icon' => 'icon_url',  // Replace 'icon_url' with the actual icon URL
                    'click_action' => 'https://yourwebsite.com'  // Replace with the actual URL
                ]
            ],
            'data' => [
                'title' => $title,
                'body' => $title,
                'scope' => $scope
            ]
        ]
    ];

    // Initialize a new cURL session for FCM request
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fcmUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // Handle the tokens array
    foreach ($tokens as $token) {
        if (!is_string($token) || empty($token)) {
            error_log("Invalid token: " . var_export($token, true));
            continue;
        }

        $messagePayload = $messagePayloadTemplate;
        $messagePayload['message']['token'] = $token;
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messagePayload));
        $result = curl_exec($ch);
     
        if ($result === false) {
            error_log("FCM request failed for token $token: " . curl_error($ch));
            continue;  // Log error or handle failure for individual tokens as needed
        }

        $response = json_decode($result, true);
        if (isset($response['error'])) {
            if ($response['error']['status'] == 'INVALID_ARGUMENT') {
                error_log("Token $token is invalid: " . $response['error']['message']);
                // Optionally, remove the token from your database here
            } else {
                error_log("Error sending message to token $token: " . $response['error']['message']);
            }
            continue;
        }

        if (!isset($response['name'])) {
            error_log("FCM response for token $token did not contain a name");
            continue;
        }
    }

    curl_close($ch);
    return true;
}



        public function android_push_notification($tokens, $title, $scope = "admin")
        {
            // FCM endpoint URL
            $fcmUrl = 'https://fcm.googleapis.com/v1/projects/modular-bucksaw-421523/messages:send';
            
            // Load the service account key file
            $serviceAccountKeyFilePath = '/var/www/html/public/admin_assets/modular-bucksaw-421523-firebase-adminsdk-w7ii6-50674802f4.json';
            $serviceAccountKey = json_decode(file_get_contents($serviceAccountKeyFilePath), true);
        
            // Generate JWT for authorization
            $now_seconds = time();
            $claims = [
                "iss" => $serviceAccountKey['client_email'],
                "scope" => "https://www.googleapis.com/auth/firebase.messaging",
                "aud" => "https://oauth2.googleapis.com/token",
                "iat" => $now_seconds,
                "exp" => $now_seconds + 3600
            ];
        
            $jwt = JWT::encode($claims, $serviceAccountKey['private_key'], 'RS256');
        
            // Get OAuth 2.0 access token using the JWT
            $oauth2Url = "https://oauth2.googleapis.com/token";
            $oauth2Payload = json_encode([
                "grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
                "assertion" => $jwt
            ]);
        
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $oauth2Url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $oauth2Payload);
            $oauth2Response = curl_exec($ch);
            curl_close($ch);
        
            if ($oauth2Response === false) {
                return false;
            }
        
            $oauth2ResponseData = json_decode($oauth2Response, true);
            if (!isset($oauth2ResponseData['access_token'])) {
                return false;
            }
        
            $accessToken = $oauth2ResponseData['access_token'];
        
            // Construct the message payload template
            $messagePayloadTemplate = [
                'message' => [
                    'notification' => [
                        'title' => 'Tudoayuda Team',
                        'body' => $title
                    ],
                    'android' => [
                        'priority' => 'high'
                    ],
                    'data' => [
                        'title' => $title,
                        'body' => $title,
                        'scope' => $scope
                    ]
                ]
            ];
        
            // Initialize a new cURL session for FCM request
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $fcmUrl);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $accessToken,
                'Content-Type: application/json',
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
            // Handle the tokens array
            foreach ($tokens as $token) {
                $messagePayload = $messagePayloadTemplate;
                $messagePayload['message']['token'] = $token;
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messagePayload));
                $result = curl_exec($ch);
        
                if ($result === false) {
                    continue;  // Log error or handle failure for individual tokens as needed
                }
        
                $response = json_decode($result, true);
                if (!isset($response['name'])) {
                    curl_close($ch);
                    return false;
                }
            }
        
            curl_close($ch);
            return true;
        }
          
        
        
        

        
        
        
        
        

        

    
    
}

?>
