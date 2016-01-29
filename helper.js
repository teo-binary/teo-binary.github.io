function login() {
  if ($("#user_name").val().length == 0 || $("#client_email").val().length == 0) {
    alert('Staff E-mail and Client Email field must be present!');
  }
  else {
    $("#status").text("Waiting for Duo security approval...");
    $.ajax({
        type: "POST",
        url: "https://5cle1zylhj.execute-api.us-east-1.amazonaws.com/production/check_email_status",
        data: JSON.stringify({
          login: $("#user_name").val(),
          duo_code: $("#duo_code").val(),
          client_email: $("#client_email").val()
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function(response) {
          if (response['data'] != undefined) {
            $("#status").text("Search returned " + response['data'].length + ' result(s)');
            if (response['data'].length > 0) {
              $('#result').attr('border', '1');
              buildHtmlTable($("#result"), response['data'])
            }
          }
          else {
            $("#status").text(response['status']);
          }
        },

        failure: function(error) {
          $("#status").text("Duo authentication failed");
          console.log(error);
        }
    });
  }
}

function buildHtmlTable(selector, myList) {
  var columns = addAllColumnHeaders(myList, selector);

  for (var i = 0 ; i < myList.length ; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
      var cellValue = myList[i][columns[colIndex]];
      if (cellValue == null) { cellValue = ""; }
      row$.append($('<td/>').html(cellValue));
    }
    $(selector).append(row$);
  }
}

function addAllColumnHeaders(myList, selector)
{
  var columnSet = [];
  var headerTr$ = $('<tr/>');

  for (var i = 0 ; i < myList.length ; i++) {
    var rowHash = myList[i];
    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {
        columnSet.push(key);
        headerTr$.append($('<th/>').html(key));
      }
    }
  }
  $(selector).append(headerTr$);
  return columnSet;
}
