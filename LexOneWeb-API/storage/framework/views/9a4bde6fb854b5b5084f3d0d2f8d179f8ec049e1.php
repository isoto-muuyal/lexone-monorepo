<?php $__env->startSection('title', 'Dashboard'); ?>
<?php $__env->startSection('content'); ?>
	<section class="row m-b20">
		<div class="col-lg-3 col-md-6 col-sm-6 col-12 m-b15">
			<a href="<?php echo e(route('booking.index')); ?>" class="whiteTxtClr">
				<div class="box1 whiteTxtClr rounded p-t10 p-b10 p-r20 p-l20">
					<div class="d-flex justify-content-between">
						<div class="align-self-center">
							<p class="mb-0"><?php echo e(__('messages.Bookings')); ?></p>
						</div>
						<div class="borderWhite text-center rounded-circle dashboard-icons">
							<i class="fa fa-calendar" aria-hidden="true"></i>
						</div>
					</div>
					<p class="mb-0 fontSize24 fontSb"><?php echo e($bookings); ?></p>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-md-6 col-sm-6 col-12 m-b15">
			<a href="<?php echo e(route('booking.index')); ?>" class="whiteTxtClr">
				<div class="box3 whiteTxtClr rounded p-t10 p-b10 p-r20 p-l20">
					<div class="d-flex justify-content-between">
						<div class="align-self-center">
							<p class="mb-0"><?php echo e(__('messages.Cancelled Bookings')); ?></p>
						</div>
						<div class="borderWhite text-center rounded-circle dashboard-icons">
							<i class="fa fa-calendar" aria-hidden="true"></i>
						</div>
					</div>
					<p class="mb-0 fontSize24 fontSb"><?php echo e($cancelledbookings); ?></p>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-md-6 col-sm-6 col-12 m-b15">
			<a href="<?php echo e(route('needs.index')); ?>" class="whiteTxtClr">
				<div class="box2 whiteTxtClr rounded p-t10 p-b10 p-r20 p-l20">
					<div class="d-flex justify-content-between">
						<div class="align-self-center">
							<p class="mb-0"><?php echo e(__('messages.Jobs')); ?></p>
						</div>
						<div class="borderWhite text-center rounded-circle dashboard-icons">
							<i class="fa fa-briefcase" aria-hidden="true"></i>
						</div>
					</div>
					<p class="mb-0 fontSize24 fontSb"><?php echo e($jobs); ?></p>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-md-6 col-sm-6 col-12 m-b15">
			<a href="<?php echo e(route('needs.index')); ?>" class="whiteTxtClr">
				<div class="box5 whiteTxtClr rounded p-t10 p-b10 p-r20 p-l20">
					<div class="d-flex justify-content-between">
						<div class="align-self-center">
							<p class="mb-0"><?php echo e(__('messages.Pending Jobs')); ?></p>
						</div>
						<div class="borderWhite text-center rounded-circle dashboard-icons">
							<i class="fa fa-briefcase" aria-hidden="true"></i>
						</div>
					</div>
					<p class="mb-0 fontSize24 fontSb"><?php echo e($pendingjobs); ?></p>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-md-6 col-sm-6 col-12 m-b15">
			<a href="<?php echo e(route('booking.index')); ?>" class="whiteTxtClr">
				<div class="box4 whiteTxtClr rounded p-t10 p-b10 p-r20 p-l20">
					<div class="d-flex justify-content-between">
						<div class="align-self-center">
							<p class="mb-0"><?php echo e(__('messages.Total Revenue')); ?></p>
						</div>
						<div class="borderWhite text-center rounded-circle dashboard-icons">
							<i class="fa fa-usd" aria-hidden="true"></i>
						</div>
					</div>
					<p class="mb-0 fontSize24 fontSb"><?php echo e($settings->currencySymbol); ?><?php echo e($totalrevenue); ?></p>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-md-6 col-sm-6 col-12 m-b15">
			<a href="<?php echo e(route('booking.index')); ?>" class="whiteTxtClr">
				<div class="box6 whiteTxtClr rounded p-t10 p-b10 p-r20 p-l20">
					<div class="d-flex justify-content-between">
						<div class="align-self-center">
							<p class="mb-0"><?php echo e(__("messages.Total Earnings")); ?></p>
						</div>
						<div class="borderWhite text-center rounded-circle dashboard-icons">
							<i class="fa fa-money" aria-hidden="true"></i>
						</div>
					</div>
					<p class="mb-0 fontSize24 fontSb"><?php echo e($settings->currencySymbol); ?><?php echo e($totalearnings); ?></p>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-md-6 col-sm-6 col-12 m-b15">
			<a href="<?php echo e(route('settlement.index')); ?>" class="whiteTxtClr">
				<div class="box1 whiteTxtClr rounded p-t10 p-b10 p-r20 p-l20">
					<div class="d-flex justify-content-between">
						<div class="align-self-center">
							<p class="mb-0"><?php echo e(__("messages.Total Settlement")); ?></p>
						</div>
						<div class="borderWhite text-center rounded-circle dashboard-icons">
							<i class="fa fa-handshake-o" aria-hidden="true"></i>
						</div>
					</div>
					<p class="mb-0 fontSize24 fontSb"><?php echo e($settings->currencySymbol); ?><?php echo e($totalsettlements); ?></p>
				</div>
			</a>
		</div>

		<div class="col-lg-3 col-md-6 col-sm-6 col-12 m-b15">
			<a href="<?php echo e(route('booking.index')); ?>" class="whiteTxtClr">
				<div class="box2 whiteTxtClr rounded p-t10 p-b10 p-r20 p-l20">
					<div class="d-flex justify-content-between">
						<div class="align-self-center">
							<p class="mb-0"><?php echo e(__("messages.Today's Earnings")); ?></p>
						</div>
						<div class="borderWhite text-center rounded-circle dashboard-icons">
							<i class="fa fa-money" aria-hidden="true"></i>
						</div>
					</div>
					<p class="mb-0 fontSize24 fontSb"><?php echo e($settings->currencySymbol); ?><?php echo e($todayearnings); ?></p>
				</div>
			</a>
		</div>
	</section>
	<div class="container-fluid">
		<div class="row mt-5">
			<div class="col-12 col-md-6">
				<div class="card">
					<div class="card-body">
						<h4 class="card-title"><?php echo e(__('messages.Users')); ?></h4>
						<!-- line chart canvas element -->
						<div>
							<canvas id="bar-chart"></canvas>
						</div>
					</div>
				</div>
			</div>
			<div class="col-12 col-md-6">
				<div class="card">
					<div class="card-body">
							<h4 class="card-title"><?php echo e(__('messages.Taskers')); ?></h4>
						<div>
							<canvas id="taskers"></canvas>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row mt-5">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<h4 class="card-title"><?php echo e(__('messages.Bookings')); ?></h4>
						<div>
							<canvas id="line-chart"></canvas>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script src="<?php echo e(URL::asset('public/admin_assets/charts/Chart.min.js')); ?>"></script>
	<script>
		var monthlylabels = <?php echo json_encode($monthlylabels); ?>;
		var usercount = <?php echo json_encode($usercount); ?>;
		var taskercount = <?php echo json_encode($taskercount); ?>;
		var bookingcount = <?php echo json_encode($bookingcount); ?>;
		// Bar chart
		new Chart(document.getElementById("bar-chart"), {
			type: 'bar',
			data: {
			labels: monthlylabels,
			datasets: [
				{
					label: "<?php echo e(__('messages.Users')); ?>",
					backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2"],
					data: usercount
				}
			]
			},
			options: {
			legend: { display: false },
			title: {
				display: true,
				text: "<?php echo e(__('messages.Users joined per month')); ?>"
			}
			}
		});
		new Chart(document.getElementById("taskers"), {
			type: 'bar',
			data: {
			labels: monthlylabels,
			datasets: [
				{
					label: "<?php echo e(__('messages.Taskers')); ?>",
					backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2"],
					data: taskercount
				}
			]
			},
			options: {
			legend: { display: false },
			title: {
				display: true,
				text: "<?php echo e(__('messages.Taskers joined per month')); ?>"
			}
			}
		});
		// line chart
		new Chart(document.getElementById("line-chart"), {
			type: 'line',
			data: {
				labels: monthlylabels,
					datasets: [{
						data: bookingcount,
						label: "<?php echo e(__('messages.Bookings')); ?>",
						borderColor: "#3e95cd",
						fill: true
					}
				]
			},
			options: {
				title: {
				display: true,
				text: "<?php echo e(__('messages.Bookings done per month')); ?>"
				}
			}
		});
	</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/dashboard.blade.php ENDPATH**/ ?>