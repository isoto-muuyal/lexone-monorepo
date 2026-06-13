<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<style type="text/css">
			p{color: #777}a{opacity: 0.8;}table{border-color: #F8F8F8;}
		</style>
	</head>
	<body>
		<table id="bgtable" align="center" border="1" cellpadding="0" cellspacing="0" height="100%" width="80%">
		    <tr>
		        <td align="center" valign="top">
		            <table border="0" cellpadding="0" cellspacing="0" width="100%">
						<tr>
							<td style="background-color: #000;padding: 10px;">
                                <img src="{{url('media/admin_assets/logo.png')}}" alt="iDemand-logo" class="height40">
							</td>
						</tr>
						<tr>
							<td style="padding: 20px 15px 30px 15px;">
								<p>
									<strong>
									 	Hi Tasker,
									</strong>
								</p>
								<p style="color: black">
									Thank you for completing the task.
								</p>
								<p style="color: black">
									Hi Tasker Your payment has been settled by the user for your booking.
                                </p>
						        <p style="color: black">Your payment has been settled successfully</p>
							</td>
						</tr>
					</table>
					<table align="center"  cellspacing="2" cellpadding="2" style="border:1px solid; width: 100%; margin: 0; padding: 0; border-collapse: collapse; border-spacing: 1;">
						<thead style="text-align:center;font-weight: bold;background-color:#DCDCDC; color: #000000;height:25px;line-height: 25px;">
							<tr style="height:25px;line-height: 25px;">
								<td>
									BookingId
								</td>
								<td>
									Price
								</td>
								<td>
									Reward
								</td>
							</tr>
						</thead>
						<tbody style="color: #000000;">
							@foreach ($bookings as $booking)
								<tr>
									<td style="text-align:center;line-height: 15px;">
										{{$booking->bookingId}}
									</td>
									<td style="text-align:center;line-height: 15px;">
										{{$booking->price}}
									</td>
									<td style="text-align:center;line-height: 15px;">
										{{$booking->reward}}
									</td>
								</tr>
							@endforeach
							<tr style="border:1px solid;text-align:center;line-height: 15px;">
								<th id="total" colspan="2" style="text-align:right; font-weight: normal;">Total:</th>
								<td>{{$amount}}</td>
							</tr>
						</tbody>
					</table>
		        </td>
		    </tr>
		</table>
	</body>
</html>