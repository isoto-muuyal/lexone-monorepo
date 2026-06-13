<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Setting extends Eloquent
{
    
    protected $connection = 'mongodb';
    protected $collection = 'settings';
    protected $fillable = [
        'siteName', 
        'siteIcon',
        "siteLogo",
        "contactEmail",
        "copyrightText",
        "contactEmail",
        "instantLocation",
        "rideDistance",
        "maxDistance",
        "stripeChange",
    // payment module
        "stripePublicKey",
        "stripePrivateKey",
        "paymentType",
    // notification module
        "pushNotification",
    // email module
        "port",
        "host",
        "email",
        "status",
        "password",
        "enableSmtp",
        "youtubeTitle",
        "youtubeLink",
        "youtubeDescription",
        "supportPhone"
    ];
    
}
