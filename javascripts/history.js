var rowsToDownload = [];
var array_of_properties = [];
var array_of_promises = [];

function saveHistory()
{

  var box = $('.active.tab-pane');
  var panel =  box.attr('id');

  if (panel == 'panel5') {
    // this is for last hours
    var hours = $('#inputHisPanel5').val();
    lastHours(hours)
  }

  if (panel == 'panel6') {
    lastHours(72)
  }

  if (panel == 'panel7') {
    // this is for last hours
    var records = $('#inputHisPanel7').val();
    lastRecords(records)
  }
}


function lastRecords(records) {
  rowsToDownload = [];

  rowsToDownload.push(["Showing", "Last -" + records + "- records"]);
  rowsToDownload.push([" ", " "]);

  array_of_properties = [];
  for (property in current_thing.properties) {
    array_of_properties.push(property);
    CLOUD.property.history_records(records, property, appendToRows);
  }

  setTimeout(function(){ downloadCSV(); }, 2000);
}


function lastHours(hours) {
  rowsToDownload = [];

  rowsToDownload.push(["Showing", "Last -" + hours + "- hours"]);
  rowsToDownload.push([" ", " "]);

  array_of_properties = [];
  for (property in current_thing.properties) {
    array_of_properties.push(property);
    CLOUD.property.history_last(hours, property, appendToRows);
  }

  // downloadCSV();
  setTimeout(function(){ downloadCSV(); }, 2000);
}


function appendToRows(data, property) {

  console.log(data);

  rowsToDownload.push(["Timestamp", property]);


  if (data.history.success == true) {
    if (data.history.params.values != null) {
      console.log('Should Build: ' + property);
      console.log(data.history.params.values);
      for (var i = 0; i < data.history.params.values.length; i++) {
        var ts = data.history.params.values[i]["ts"];
        var vl = data.history.params.values[i]["value"];
        rowsToDownload.push([ts, vl]);
      }
    } else {
      rowsToDownload.push([" ", "(no values)"]);
    }
  }

  rowsToDownload.push([" ", " "]);

}

function downloadCSV() {
  const rows = rowsToDownload;
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach(function(rowArray){
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Habitate_026_data.csv");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the data file named "my_data.csv".
}
;
