<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PlatformController extends Controller
{
    public function detectAndRedirect(Request $request)
    {
        $userAgent = $request->header('User-Agent');

        if ($this->isAndroid($userAgent)) {
            return redirect('https://lex-one.online');
        } elseif ($this->isIOS($userAgent)) {
            return redirect('https://lex-one.online');
        } else {
            return redirect('/');
        }
    }

    private function isAndroid($userAgent)
    {
        return strpos(strtolower($userAgent), 'android') !== false;
    }

    private function isIOS($userAgent)
    {
        return preg_match('/(iPhone|iPad|iPod)/i', $userAgent);
    }
}
