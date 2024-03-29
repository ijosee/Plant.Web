
$(document).ready(function () {

    // var data = {};

    // data.from = moment().add(-1, 'hour').format('MM/DD/YYYY HH:mm:ss');
    // data.to = moment().add(1, 'hour').format('MM/DD/YYYY HH:mm:ss');

    // data.sensorType = "Temperature";
    // getSensorData(data);

   // did the trick !
    $.noConflict();
    $('#dataTable').DataTable({ 
        processing: true,
        serverSide: true,
        order: [[0, 'desc']],
        ajax: { 
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "Temperature/GetDataTable"
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

                data.sensorType = "Temperature";
                getSensorData(data);    
           }
        }
    });

});

function renderTemperatureChart(data) {

    var labels;
    var data ;
    // parse labels and data
    if(data !== undefined && data !== null){
        labels = data.map(e => moment(e.x, 'DD-MM-YYYY HH:mm:ss'));
        data = data.map(e => +e.y);
    }

    var ctx = document.getElementById("myChartTemperature").getContext('2d');
    new Chart(ctx, {
       type: 'line',
       data: {
          labels: labels,
          datasets: [{
            label: 'Sensor measures',
            data: data,
            backgroundColor: "rgba(238,50,49, 0.05)",
            borderColor: "rgba(238,50,49,1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(238,50,49, 1)",
            pointBorderColor: "rgba(238,50,49, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(238,50,49, 1)",
            pointHoverBorderColor: "rgba(238,50,49, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
          }]
       },
       options: {
        scales: {
            xAxes: [{
            type: 'time',
            time: {
                unit: 'minute'
            },
            distribution: 'linear'
            }],
            yAxes: [{
            ticks: {
                beginAtZero: true
            }}]
        },
        legend: {
            display: true
        },
        animation: false,
       }
    });

}

function getSensorData(data){

    if (data.from !== undefined && data.to !== undefined) {
        $.get('Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + data.sensorType, function (data) {
            var sensorData = data;
            if(sensorData !== undefined){
                renderTemperatureChart(sensorData);
            }
        });
    } else {
        $.get('Home/GetChartData',function(data){
            var sensorData = data;
            if(sensorData !== undefined){
                renderTemperatureChart(sensorData);
            }
        });
    }
}

// $('#daterangeTemperature').daterangepicker({
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

//    $('#daterangeTemperature').on('apply.daterangepicker', function(ev, picker) {

//        var data = {};

//        data.from = picker.startDate.format('MM-DD-YYYY HH:mm:ss');
//        data.to = picker.endDate.format('MM-DD-YYYY HH:mm:ss'); 
       
//        data.sensorType = "Temperature";
//        getSensorData(data);

//    });