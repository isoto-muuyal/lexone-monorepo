<?php $__env->startSection('title', 'Category Create'); ?>

<?php $__env->startSection('content'); ?>
  <script src="<?php echo e(URL::asset('public/admin_assets/js/ckeditor.js')); ?>"></script>
  <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="<?php echo e(route('category.store')); ?>" method="POST"  enctype="multipart/form-data">
      <?php echo csrf_field(); ?>
      <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Add')); ?> <?php echo e(trans('messages.Category')); ?></h4>
      <div class="form-group">
          <label><?php echo e(trans('messages.Name')); ?> </label> <span class="text-danger">*</span>
          <input type="text" class="form-control" name="category_name" maxlength="30" placeholder="<?php echo e(trans('messages.Category')); ?> <?php echo e(trans('messages.Name')); ?>" value="<?php echo e(old('category_name')); ?>" required>
          <?php if($errors->has('category_name')): ?><p class="text-danger"><?php echo e($errors->first('category_name')); ?></p><?php endif; ?>
      </div>
      <a href="#" id="RTL"><u><?php echo e(__('messages.Add Names In Other Languages')); ?></u></a>
      <div id="morecategories">
        <?php $__currentLoopData = $languages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $language): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="form-group">
              <label><?php echo e($language['language']); ?> <?php echo e(__('messages.Name')); ?> </label> <span class="text-danger">*</span>  
              <input type="text" class ="form-control" name="<?php echo e($language['langcode']); ?>" maxlength="30" placeholder="<?php echo e(__('messages.Category')); ?> <?php echo e(__('messages.Name')); ?>" value="<?php echo e(old($language['langcode'])); ?>">
              <?php if($errors->has($language['langcode'])): ?><p class="text-danger"><?php echo e($errors->first($language['langcode'])); ?></p><?php endif; ?>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </div>
      <div class="form-group">
          <label><?php echo e(trans('messages.Type')); ?></label>
          <div class="m-b20 d-flex">
              <div class="m-r50">
                  <div class="custom-control custom-radio">
                      <input type="radio" class="custom-control-input" id="professional" name="category_type" value="professional" checked>
                      <label class="custom-control-label" for="professional"><?php echo e(trans('messages.Professional')); ?>

                          <i class="fa fa-info-circle" aria-hidden="true" data-toggle="modal" data-target="#pro"></i>
                      </label>
                  </div>
              </div>
              <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" id="marketplace" name="category_type" value="marketplace">
                  <label class="custom-control-label" for="marketplace"><?php echo e(trans('messages.Marketplace')); ?>


                  </label>
                  <i class="fa fa-info-circle" aria-hidden="true" data-toggle="modal" data-target="#mar"></i>
              </div>
          </div>
      </div>
      <div class="form-group">
        <label class="control-label" for="location-type"><?php echo e(__('messages.Location Type')); ?></label>
        <span class="text-danger">*</span>
        <select id="location-type" class="form-control" name="locationType" required>
          <option value=""><?php echo e(trans('messages.Select')); ?></option>
          <option value="transport" <?php echo e(old('locationType') == "transport" ? 'selected' : ''); ?>><?php echo e(__('messages.Transport')); ?></option>
          <option value="remote" <?php echo e(old('locationType') == "remote" ? 'selected' : ''); ?>><?php echo e(__('messages.Remote')); ?></option>
          <option value="home" <?php echo e(old('locationType') == "home" ? 'selected' : ''); ?>><?php echo e(__('messages.Home')); ?></option>
        </select>
        <?php if($errors->has('locationType')): ?><p class="text-danger"><?php echo e($errors->first('locationType')); ?></p><?php endif; ?>
      </div>
      <div class="m-b20">
          <div class="profile picture">
              <label><?php echo e(trans('messages.Image')); ?></label> <span class="text-danger">*</span>
              <input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="category_image" class="m-b15 p-2 borderGrey w-100" required><br>
              <img src="" class="borderCurve borderGradient picture-src dnone" id="wizardPicturePreview"
              style="width:100px;height:100px;object-fit: cover;">
          </div>
          <?php if($errors->has('category_image')): ?><p class="text-danger"><?php echo e($errors->first('category_image')); ?></p><?php endif; ?>
      </div>
      <div class="form-group">
          <label><?php echo e(trans('messages.Status')); ?></label><span class="text-danger">*</span>
          <div class="m-b20 d-flex">
              <div class="m-r50">
                  <div class="custom-control custom-radio">
                      <input type="radio" class="custom-control-input" id="enable" name="category_status" value="1" checked>
                      <label class="custom-control-label" for="enable"><?php echo e(trans('messages.Enable')); ?></label>
                  </div>
              </div>
              <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" id="disable" name="category_status" value="0">
                  <label class="custom-control-label" for="disable"><?php echo e(trans('messages.Disable')); ?></label>
              </div>
          </div>
      </div>
      <div class="form-group">
          <label><?php echo e(trans('messages.Featured')); ?></label><span class="text-danger">*</span>
          <div class="m-b20 d-flex">
              <div class="m-r50">
                  <div class="custom-control custom-radio">
                      <input type="radio" class="custom-control-input" id="Yes" name="category_feature" value="1" checked>
                      <label class="custom-control-label" for="Yes"><?php echo e(trans('messages.Yes')); ?></label>
                  </div>
              </div>
              <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" id="No" name="category_feature" value="0">
                  <label class="custom-control-label" for="No"><?php echo e(trans('messages.No')); ?></label>
              </div>
          </div>
      </div>
      <div class="form-group" >
        <label><?php echo e(__('messages.How It Works')); ?></label>
        <textarea class="form-control" name="description" id="editor1" cols="30" rows="6" maxlength="1200" >
          <?php echo e(Request::old('description')); ?>

        </textarea>
        <?php if($errors->has('description')): ?><p class="text-danger"><?php echo e($errors->first('description')); ?></p><?php endif; ?>
      </div>
      <div class="form-group" >
        <label><?php echo e(__('messages.FAQ')); ?></label>
        <textarea class="form-control" name="faq" id="editor2" cols="30" rows="6" maxlength="1200" >
          <?php echo e(Request::old('faq')); ?>

        </textarea>
        <?php if($errors->has('faq')): ?><p class="text-danger"><?php echo e($errors->first('faq')); ?></p><?php endif; ?>
      </div>
      <div class="form-group" >
        <label><?php echo e(__('messages.Description')); ?></label>
        <textarea class="form-control" name="about" id="editor3" cols="30" rows="6" maxlength="1200" >
          <?php echo e(Request::old('about')); ?>

        </textarea>
        <?php if($errors->has('about')): ?><p class="text-danger"><?php echo e($errors->first('about')); ?></p><?php endif; ?>
      </div>
      <?php $__currentLoopData = $languages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $language): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div >
          <a href="#" id="collapse<?php echo e($language['code']); ?>"><u><?php echo e($language['language']); ?> Language</u></a><br>
          
          <div id="expand<?php echo e($language['code']); ?>">
            <label><?php echo e(__('messages.About')); ?></label>
            <textarea class="form-control" name="about<?php echo e($language['language']); ?>" id="count<?php echo e($language['language']); ?>" cols="30" rows="6" maxlength="1200" >
              <?php echo e(old('about' . $language['language'])); ?>

            </textarea>
            <?php if($errors->has('about' . $language['language'])): ?><p class="text-danger"><?php echo e($errors->first('about' . $language['language'])); ?></p><?php endif; ?>
            <label><?php echo e(__('messages.FAQ')); ?></label>
            <textarea class="form-control" name="faq<?php echo e($language['language']); ?>" id="about<?php echo e($language['language']); ?>" cols="30" rows="6" maxlength="1200" >
              <?php echo e(old('faq' . $language['language'])); ?>

            </textarea>
            <?php if($errors->has('faq' . $language['language'])): ?><p class="text-danger"><?php echo e($errors->first('faq' . $language['language'])); ?></p><?php endif; ?>
            <label><?php echo e(__('messages.Description')); ?></label>
            <textarea class="form-control" name="description<?php echo e($language['language']); ?>" id="Description<?php echo e($language['language']); ?>" cols="30" rows="6" maxlength="1200" >
              <?php echo e(old('description' . $language['language'])); ?>

            </textarea>
            <?php if($errors->has('description' . $language['language'])): ?><p class="text-danger"><?php echo e($errors->first('description' . $language['language'])); ?></p><?php endif; ?>
          </div>
         
        </div>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      <div class="m-t20">
          <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(__('messages.Save')); ?></button>
      </div>
  </form>
  <!-- Modal -->
  <div class="modal fade" id="pro" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Professional</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Professional category has fixed price which cannot be changed by the tasker.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="mar" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Market Place</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Marketplace category does not have fixed price which can be given by the tasker.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <?php $__currentLoopData = $languages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $language): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <script>
      var errors = <?php echo json_encode($errors->any()); ?>;

      $(document).ready(function () {
        if(errors == true){
          $("#morecategories").show();
        }else{
          $("#morecategories").hide();
        }
    

        var collapse =<?php echo json_encode($language['code']); ?>;
        var expand =<?php echo json_encode($language['code']); ?>;
        var more = "#expand"+expand;
        var collapse2 = "#collapse"+collapse;
        if(errors == true){
          $(more).show();
        }else{
          $(more).hide();
        }
        $(collapse2).click(function(){
          $(more).slideToggle(250);
        });
      });
        var count =<?php echo json_encode($language['language'] ); ?>;
        var id = "#count"+count;
        if($(id).length )  {
        ClassicEditor
        .create(document.querySelector(id), {
          toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
        })
        .then(editor => {
          window.editor = editor;
        })
        .catch(err => {
            // console.error(err.stack);
          });
        }

        var count2 =<?php echo json_encode($language['language'] ); ?>;
        var id2 = "#about"+count2
        if($(id2).length )  {
        ClassicEditor
        .create(document.querySelector(id2), {
          toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
        })
        .then(editor => {
          window.editor = editor;
        })
        .catch(err => {
            // console.error(err.stack);
          });
        }
        var count3 =<?php echo json_encode($language['language'] ); ?>;
        var id3 = "#Description"+count3
        if($(id3).length )  {
        ClassicEditor
        .create(document.querySelector(id3), {
          toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
        })
        .then(editor => {
          window.editor = editor;
        })
        .catch(err => {
            // console.error(err.stack);
          });
        }
    </script>
  <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/categories/create.blade.php ENDPATH**/ ?>