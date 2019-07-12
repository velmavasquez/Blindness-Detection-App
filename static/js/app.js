// Add test image
$(".imgAdd").click(function () {
    $(this).closest(".row").find('.imgAdd').before(
        '<div class="col-lg-3 col-sm-3 imgUp">\
                      <figcaption class="figure-caption" id="image-name" placeholder="Image name here.">Upload to Predict</figcaption>\
                      <br>\
                      <div class="form-group"> \
                      <div class="imagePreview"></div> \
                      <div class="upload-options"> \
                      <label><i class="fas fa-upload"></i><input type="file" name="file" class="image-upload" accept="image/*;capture=camera" /></label> \
                      </div></div> \
                      <i class="fa fa-times del"></i></div>');
});

//Scrol the view when show me how clicked
$("#how").click(function () {
    document.getElementById('how').scrollIntoView();
});
