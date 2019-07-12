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

//delete the image box
$(document).on("click", "i.del", function () {
    $(this).parent().remove();
});

/////////Image upload function 

$(function () {
    $(document).on("change", ".image-upload", function () {
        var uploadFile = $(this);
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

        var captions = document.getElementsByClassName("figure-caption");
        //Show message while predicting
        for (i = 0; i < captions.length; i++) {
            captions[i].textContent = "Predicting ... ";
            console.log(captions[i].textContent)
        }

        if (/^image/.test(files[0].type)) { // only image file
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file

            reader.onloadend = function () { // set image data as background of div
                //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                uploadFile.closest(".imgUp").find('.imagePreview').css("background-image", "url(" + this.result + ")");
                var form_data = new FormData();
                $.each($(".image-upload"), function (i, obj) {
                    $.each(obj.files, function (j, file) {
                        form_data.append('file', file); // is the var i against the var j, because the i is incremental the j is ever 0
                        console.log(file);
                    });
                });

                // form_data.append('file', $('.image-upload').prop('files')[0]);
                // console.log(form_data);

                req = $.ajax({
                    url: '/',
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    cache: false,
                    data: form_data,
                    success: function (data) {
                        console.log('------------------------------');
                        console.log(data)

                        let image_ids = document.getElementsByClassName("image-upload");
                        let captions = document.getElementsByClassName("figure-caption");
                        for (i = 0; i < captions.length; i++) {
                            let name = data.predictions[i][1];
                            console.log(name);
                            if (name == "") {
                                captions[i].textContent = "Please try again"
                                $('.recipeButton').prop('disabled', true);
                                $('.cuisines').prop('disabled', true);
                                $('.note').hide();
                            }
                            else {
                                captions[i].textContent = name
                                $('.recipeButton').prop('disabled', false)
                                $('.cuisines').prop('disabled', false);
                                $('.note').show();
                            }
                        }
                    },
                });
            }
        }
    });
});
