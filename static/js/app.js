// create a base64Image variable to hold the image so it can inlined into html 
let base64Image
// if an image is selected on the html
$('#image-selector').change(function () {
  let reader = new FileReader();
  reader.onload = function (e) {
    let dataURL = reader.result;
    $('#selected-image').attr('src', dataURL);
    // send image in base64 format
    base64Image = dataURL.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
  }
  // clean up tables if a new image is selected
  reader.readAsDataURL($("#image-selector")[0].files[0]);
  $("#no-prediction").text("");
  $("#mild-prediction").text("");
  $("#mod-prediction").text("");
  $("#sev-prediction").text("");
  $("#pro-prediction").text("");
  $("#row-chart").empty();
  $("#custom-table").css("display", "none");
});
//  on click of predict button
$('#predict-button').click(function (event) {
  let message = {
    image: base64Image
  }
  console.log(message);
  // get flask post response for predict to build charts
  $.post("/predict", JSON.stringify(message), function (response) {
    let predictions_array = Object.entries(response.prediction).map(function (entry) {
      return {
        category: entry[0],
        value: entry[1]
      };
    });
    let cf = crossfilter(predictions_array);
    let category = cf.dimension(p=>p.category);
    myRowChart = dc.rowChart('#row-chart').dimension(category).group(category.group().reduceSum(p=>p.value));
    myRowChart.ordering(function(d) {
        if(d.key == "NoDR") return 0;
        else if(d.key == "Mild") return 1;
        else if(d.key == "Moderate") return 2;
        else if(d.key == "Severe") return 3;
        else if(d.key == "ProliferativeDR") return 4;
    });
    dc.renderAll();
    // clean up percentages for display
    $("#no-prediction").text((response.prediction.NoDR * 100).toFixed(2) + '%');
    $("#mild-prediction").text((response.prediction.Mild * 100).toFixed(2) + '%');
    $("#mod-prediction").text((response.prediction.Moderate * 100).toFixed(2) + '%');
    $("#sev-prediction").text((response.prediction.Severe * 100).toFixed(2) + '%');
    $("#pro-prediction").text((response.prediction.ProliferativeDR * 100).toFixed(2) + '%');
    $("#custom-table").css("display", "block");
    console.log(response);
  });
});
// clear screen when clear button is clicked
$('#clear-button').click(function (event) {
  $("#no-prediction").text("");
  $("#mild-prediction").text("");
  $("#mod-prediction").text("");
  $("#sev-prediction").text("");
  $("#pro-prediction").text("");
  $("#row-chart").empty();
  $("#custom-table").css("display","none")
  $('#selected-image').attr('src', '');
  base64Image = null;
});
// when the html loads don't display the custom-table
function load(){
  $("#custom-table").css("display", "none");
}
