<?php $__env->startSection('title', 'Insights'); ?>
<?php $__env->startSection('content'); ?>
<div class="container-fluid ">
	<div class="row mt-5">
		<div class="col-12 col-lg-6">
			<div class="card">
				<div class="card-body">
					<h4 class="card-title blueTxtClr"><?php echo e(__('messages.Popular Services')); ?></h4>
					<!-- bar chart canvas element -->
					<div>
						<canvas id="pie-chart"></canvas>
					</div>
				</div>
			</div>
		</div>
		<div class="col-12 col-lg-6">
			<div class="card">
				<div class="card-body">
					<h4 class="card-title blueTxtClr"><?php echo e(__('messages.Bookings')); ?></h4>
					<!-- bar chart canvas element -->
					<div>
						<canvas id="doughnut-chart"></canvas>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-5">
		<div class="col-12">
			<div class="card">
				<div class="card-body">
					<h4 class="card-title blueTxtClr"><?php echo e(__('messages.Top Rated Categories')); ?></h4>
					<!-- bar chart canvas element -->
					<div>
						<canvas id="bar-chart-horizontal"></canvas>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20  mt-5">
		<div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
			<div>
				<h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Top Rated Taskers')); ?> </h4>
			</div>
		</div>

		<div class="table-responsive">
			<table id="example" class="table table-striped table-bordered w-100 mytable">
				<thead>
					<tr class="text-center">
						<th class="nosorting"><?php echo e(__('messages.Rank')); ?></th>
						<th class="nosorting"><?php echo e(__('messages.Name')); ?></th>
						<th class="nosorting"><?php echo e(__('messages.Location')); ?></th>
						<th class="nosorting"><?php echo e(__('messages.Rating')); ?> </th>
					</tr>
				</thead>
				<tbody>
					<?php $index =1; ?>
					<?php if(!empty($topTaskers)): ?>
						<?php $__currentLoopData = $topTaskers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tasker): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
							<?php if( $tasker['rating'] ): ?>
								<tr class="text-center">
									<td class="fontSize15"><?php echo e($index); ?></td>
									<td class="fontSize15"><a href="<?php echo e(route('tasker.show', ['id' => $tasker['_id']])); ?>" style="cursor: pointer;"><?php echo e($tasker['name']); ?></a></td>
									<td class="fontSize15"><?php echo e($tasker['location']); ?></td>
									<td class="fontSize15">
										<?php echo e($tasker['rating']); ?> <i class="fa fa-star" aria-hidden="true"></i>
									</td>
								</tr>
								<?php $index++; ?>
							<?php endif; ?>
					<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
					<?php else: ?>
					<tr>
						<td colspan="4"><?php echo e(__('messages.No records found')); ?></td>
					</tr>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
	</div>
	<?php
		// print_r($citynames);
		// print_r($citycount);
		// die;
	?>
	<script src="<?php echo e(URL::asset('public/admin_assets/charts/Chart.min.js')); ?>"></script>
	<script>
		var booking_status_type = <?php echo json_encode($booking_status_type); ?>;
		var booking_count_by_status = <?php echo json_encode($booking_count_by_status); ?>;
		var engagedService = <?php echo json_encode($engagedService); ?>;
		var serviceCount = <?php echo json_encode($serviceCount); ?>;
		var ratings = <?php echo json_encode($rating); ?>;
		var categoryName = <?php echo json_encode($categoryName); ?>;
		// pie chart
		new Chart(document.getElementById("pie-chart"), {
			type: 'pie',
			data: {
				labels: engagedService,
				datasets: [{
					label: "<?php echo e(__('messages.Services')); ?>",
					backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850",'#4dc9f6',
					'#f67019',
					'#f53794',
					'#537bc4',
					'#acc236',],
					data: serviceCount
				}]
			},
			options: {
				title: {
					display: true,
					text: "<?php echo e(__('messages.Based on bookings')); ?>"
				}
			}
		});
		// Doughnut chart
		new Chart(document.getElementById("doughnut-chart"), {
			type: 'doughnut',
			data: {
				labels: booking_status_type,
				 percentageInnerCutout: 40,
				datasets: [
				{
					label: "<?php echo e(__('messages.Cities')); ?>",
					backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850",'#4dc9f6',
					'#f67019',
					'#f53794',
					'#537bc4',
					'#acc236',],
					data: booking_count_by_status
				}
				]
			},
			options: {
				title: {
					display: true,
					text: "<?php echo e(__('messages.Based on bookings')); ?>"
				}
			}	
		});

        // horizontal chart
        new Chart(document.getElementById("bar-chart-horizontal"), {
        	type: 'horizontalBar',
        	data: {
        		labels: categoryName,
        		datasets: [
        		{
        			barPercentage: 0.25,
        			barThickness: 2,
        			label: "<?php echo e(__('messages.Based on user ratings')); ?>",
        			backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850",'#4dc9f6','#f67019','#f53794','#537bc4','#acc236'],
        			data: ratings
        		}
        		]
        	},
        });
    </script>
    <?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/insights.blade.php ENDPATH**/ ?>