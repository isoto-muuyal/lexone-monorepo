<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = Setting::create([
        	'contactEmail' => 'sarvanan@hitasoft.com', 
        	'copyrightText' => 'Idemand.com @2020',
            'siteName' => 'IDemand',
            'siteIcon' => '3MAieW_1603526739.png',
            'siteLogo' => 'logo.png',
            'smtpEmail' => 'fantacykodes@gmail.com',
            'smtpHost' => 'smtp.gmail.com',
            'smtpPassword' => 'Hitasoft@2019$',
            'smtpPort' => '587', 
            'smtpStatus' => 0, 
            'currencyCode' => 'USD', 
            'currencySymbol' => '$', 
            'minimumAmount' => 1, 
            'tax' => 12, 
            'paymentType' => 'sandbox', 
            'stripePrivateKey' => 'sk_test_51HaL45Lm1VO21YvJNHxlnTAvWVhjLyT4RPKC3pIrm78irfAAXfldr8GwNs5vMuNJ36vzVzelwptTwvLu59TLvP7q00fd9lxrnh', 
            'stripePublicKey' => 'pk_test_51HaL45Lm1VO21YvJYqYNi01LKsnVwjtCjQXij4ipeJyJ7kNKHwSza787kYKxYAWDWBEDnFZggj9F5awOO3Hi6m1F00gFPUJjrX', 
            'commission' => 5.0, 
            'docsLimit' => 5, 
            'guideLine' => 'lllll',  
            'portfolioLimit' => 10,
            'pushNotification' => 'AAAAjgxNRsQ:APA91bEukbodOaExjQSYEAaH8D9OAQVmcDv5PlBh7XGiE55C-Rcukak8uSRdXNSNe1o90ltwfbFRfxtPdPxMng4Is5ojuEYOVwmzU886dhU-5Ams_Epw11x2gpjuP90N24DxMLN-XIT0',
            'appstoreLink' => 'https://facebook.com/',
            'fbLink' => 'https://facebook.coasdm/',
            'instagramLink' => 'https://facebook.com/',
            'playstoreLink' => 'asdhttps://facebook.com/',
            'twitterLink' => 'https://facebook.com/',
        ]);
  
    }
}
