
$(document).ready(function () {

    var data = {};

    data.from = moment().add(-1, 'hour').format('MM/DD/YYYY HH:mm:ss');
    data.to = moment().add(1, 'hour').format('MM/DD/YYYY HH:mm:ss');

    data.sensorType = "Humidity";
    getSensorData(data);

   // did the trick !
    $.noConflict();
    $('#dataTable').DataTable({ 
        processing: true,
        serverSide: true,
        order: [[0, 'desc']],
        ajax: { 
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "Humidity/GetDataTable"
        }, 
        "columns": [ 
        { "data": "id" }, 
        { "data": "value" }, 
        { "data": "timestamp" }],
        drawCallback: function( settings ) {
           var api = this.api();
           currentDatatableData = api.rows( {page:'current'} ).data() ;
           if(currentDatatableData != undefined && currentDatatableData.length > 0){
                var data = {};

                var firstElement = currentDatatableData[0];
                var lastElement = currentDatatableData[currentDatatableData.length - 1];

                data.from = moment(lastElement.timestamp).format('MM-DD-YYYY HH:mm:ss');
                data.to = moment(firstElement.timestamp).format('MM-DD-YYYY HH:mm:ss');

                data.sensorType = "Humidity";
                getSensorData(data);    
           }
        }
    });
});

function renderHumidityChart(data) {

    var labels;
    var data ;
    // parse labels and data
    if(data !== undefined && data !== null){
        labels = data.map(e => moment(e.x, 'DD-MM-YYYY HH:mm:ss'));
        data = data.map(e => +e.y);
    }

    var ctx = document.getElementById("myChartHumidity").getContext('2d');
    new Chart(ctx, {
       type: 'line',
       data: {
          labels: labels,
          datasets: [{
            label: 'Humidity measures',
            data: data,
            backgroundColor: "rgba(255, 150, 0, 0.05)",
            borderColor: "rgba(255, 150, 0,1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(255, 150, 0, 1)",
            pointBorderColor: "rgba(255, 150, 0, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(255, 150, 0, 1)",
            pointHoverBorderColor: "rgba(255, 150, 0, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
          }]
       },
       options: {
          scales: {
             xAxes: [{
                type: 'time',
                time: {
                   unit: 'minute',
                   displayFormats: {
                      hour: 'HH:mm'
                   }
                }
             }]
          },legend: {
            display: true
        }
       }
    });

}

function getSensorData(data){

    if (data.from !== undefined && data.to !== undefined) {
        $.get('Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + data.sensorType, function (data) {
            var sensorData = data;
            if(sensorData !== undefined){
                renderHumidityChart(sensorData);
            }
        });
    } else {
        $.get('Home/GetChartData',function(data){
            var sensorData = data;
            if(sensorData !== undefined){
                renderHumidityChart(sensorData);
            }
        });
    }
}

// $('#daterangeHumidity').daterangepicker({
//         opens: 'left',
//         timePicker: true,
//         startDate: moment().startOf('hour'),
//         endDate: moment().startOf('hour').add(32, 'hour'),
//         locale: {
//           format: 'M/DD hh:mm A'
//         }
//       }, function(start, end, label) {
//         console.log("A new date selection was made: " + start.format('MM-DD-YYYY HH:mm:ss') + ' to ' + end.format('MM-DD-YYYY HH:mm:ss'));
//         });

//    $('#daterangeHumidity').on('apply.daterangepicker', function(ev, picker) {

//        var data = {};

//        data.from = picker.startDate.format('MM-DD-YYYY HH:mm:ss');
//        data.to = picker.endDate.format('MM-DD-YYYY HH:mm:ss'); 
       
//        data.sensorType = "Humidity";
//        getSensorData(data);

//    });