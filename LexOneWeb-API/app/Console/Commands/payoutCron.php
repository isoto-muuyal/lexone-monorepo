<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Setting;
use App\Models\Booking;
use App\Models\Settlement;
use App\Models\Currency;
use Stripe\Stripe;
use App\Models\User;
use App\Models\Log;
use App\Classes\MyClass;
use App\Http\Controllers\Admin\DashboardController;
use App\Models\Bookingdetail;
use Carbon\Carbon;

class payoutCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payout:cron';
    protected $DashboardController;

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(DashboardController $DashboardController)
    {
        parent::__construct();
        $this->DashboardController = $DashboardController;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(){
        echo "Running settlement job\n";

        $setting = Setting::first();

        Stripe::setApiKey($setting->stripePrivateKey);

        $stripe = new \Stripe\StripeClient(
            $setting->stripePrivateKey
        );

        $currencyCode = $setting->currencyCode;
        $taskers = User::where('role', 'tasker')->where('verified', 1)->where('accountId', '!=', null)->get();


        $start =  Carbon::now()->toDateTimeString();
        $start =  new \MongoDB\BSON\UTCDateTime(new \DateTime($start));

        $taskersCount = count($taskers);

        echo "Running for {$taskersCount} taskers\n";

        foreach ($taskers as $tasker) {

            echo "Running for tasker with id: {$tasker->accountId}\n";
            if($tasker->accountId == '')
                continue;

            if(empty($tasker))
            {
                echo 'empty';
                print_r($tasker); die;
            }

            $val = $stripe->accounts->retrieve(
                $tasker->accountId,
                []
            );

            Stripe::setApiKey($setting->stripePrivateKey);
            $stripe = new \Stripe\StripeClient(
                $setting->stripePrivateKey
            );

            // with checking payout date
            $bookings = Booking::where('status', 'completed')->where('settlement', 0)->where('taskerId', new \MongoDB\BSON\ObjectID($tasker->id))->get();

            if (count($bookings) > 0) {
                $price = 0;
                $tax = 0;
                $commission = 0;
                $total = 0;
                $reward = 0;
                $currencySymbol = $setting->currencySymbol;
                $bookingIds = null;
                foreach ($bookings as $booking) {
                    $price += $booking->price;
                    $tax += $booking->tax;
                    $commission += $booking->commission;
                    $total += $booking->total;
                    $reward += $booking->reward;
                    $bookingIds[] = $booking->id;
                }
                if ($price != 0) {
                    // Calculate tasker payout: service price + tips only
                    // (commission and tax stay with platform)
                    $amount = $price + $reward;
                    echo "Processing payout for tasker: " . $tasker->name . "\n";
                    echo "Lawyer payout amount: $amount (price: $price + reward: $reward)\n";
                    echo "Platform keeps: commission: $commission + tax: $tax\n";

                    $accountStatus = $stripe->accounts->retrieve(
                        $tasker->accountId,
                        []
                    );

                    if ($accountStatus->charges_enabled == true) {
                        $val = $stripe->accounts->retrieve(
                            $tasker->accountId,
                            []
                        );

                        // Get tasker's account currency for proper conversion
                        $taskerCurrency = strtoupper(str_replace(' ', '', $val['default_currency']));
                        $platformCurrency = strtoupper(str_replace(' ', '', $setting->currencyCode));

                        // Handle currency conversion if needed
                        $stripetaskerfee = $amount;
                        if($taskerCurrency != $platformCurrency){
                            $getTaskerCurrencyRate = Currency::where(['currencycode' => $taskerCurrency])->first();
                            $getPlatformCurrencyRate = Currency::where(['currencycode' => $platformCurrency])->first();

                            if($getTaskerCurrencyRate && $getPlatformCurrencyRate) {
                                $stripetaskerfee = round($getTaskerCurrencyRate['price'] * ($amount / $getPlatformCurrencyRate['price']), 2);
                            }
                        }

                        // Handle zero-decimal currencies
                        $currencyIndex = array("BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF");
                        if(in_array($taskerCurrency, $currencyIndex)){
                            $finalAmount = round($stripetaskerfee);
                        }else{
                            $finalAmount = round($stripetaskerfee * 100);
                        }

                        try {

                            // Use Stripe Transfer instead of unsafe PaymentIntent with raw card data
                            $transferData = [
                                "amount" => $finalAmount,
                                "currency" => $taskerCurrency,
                                "destination" => $tasker->accountId,
                                "description" => "Payout for completed bookings: " . implode(', ', $bookingIds)
                            ];
                            echo "Transfer to apply:\n";
                            print_r($transferData);
                            echo "\n";
                            $transfer = \Stripe\Transfer::create($transferData);

                            $settlement = Settlement::create([
                                'bookingId' =>  $bookingIds,
                                'transactionId' =>  $transfer->id,
                                'amount' =>  $amount,
                                'description' =>  'payment done'
                            ]);
                            foreach ($bookingIds as $bookingId) {
                                $booking = Booking::where('_id', new \MongoDB\BSON\ObjectID($bookingId))->first();
                                $booking->settlement = 1;
                                $booking->save();
                            }

                            $response = $this->settlementNotification($tasker);

                            $email = $setting->smtpEmail;
                            $subject = 'Payment Settled';
                            \Mail::to($tasker->email)->send(new \App\Mail\SettlementMail($email, $bookings, $amount));

                            $log = new Log();
                            $log->messageType = "Settlement Amount";
                            $log->serviceId = ["Approval"];
                            $log->isAdmin = 1;
                            $log->type = "approval";
                            $log->senderId =  new \MongoDB\BSON\ObjectID($tasker->id);
                            $log->receiverId = new \MongoDB\BSON\ObjectID($tasker->id);
                            $log->createdAt = $start;
                            $log->messageTxt = "Your amount has been settled by admin";
                            $log->save();

                            \Log::info("✅ Settlement completed for tasker: {$tasker->name}, Amount: $amount, Transfer ID: {$transfer->id}");
                            echo "Settlement completed for {$tasker->name}: $amount\n";

                        } catch (\Stripe\Exception\CardException $e) {
                            \Log::error("❌ Stripe CardException for tasker {$tasker->name}: " . $e->getMessage());
                            echo "Error processing payout for {$tasker->name}: {$e->getMessage()}\n";
                        } catch (\Exception $e) {
                            \Log::error("❌ General error processing payout for tasker {$tasker->name}: " . $e->getMessage());
                            echo "Error processing payout for {$tasker->name}: {$e->getMessage()}\n";
                        }
                    }
                }
            }else{
                \Log::info("ℹ️ No pending bookings for tasker: {$tasker->name}");
                echo "No bookings for {$tasker->name}\n";
            }
        }

    }

    public function settlementNotification($tasker)
    {
        $myClass = new MyClass();
        $devicetoken = array();
        array_push($devicetoken, $tasker->deviceToken);
        $msg = "Tu pago a sido liquidado por el administrador";
        $scope = 'settlement';
        if ($tasker->deviceActive == 1) {
            if ($tasker->devicePlatform == 'ios') {
                try {
                    $usernotification = $myClass->ios_push_notification($devicetoken, $msg, 'all', $scope);
                }
                catch (\Throwable $th) {
                    throw $th;
                }
            }
            else
            {
                try {
                    $usernotification = $myClass->android_push_notification($devicetoken, $msg, 'all', $scope);
                    // echo '<pre>'; print_r($usernotification); die;
                }
                catch (\Throwable $th) {
                    throw $th;
                }
            }
        }
        return 'completed';
    }
}
