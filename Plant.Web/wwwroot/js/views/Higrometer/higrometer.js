
$(document).ready(function () {

   // did the trick !
    $.noConflict();
    $('#dataTable').DataTable({ 
        processing: true,
        serverSide: true,
        order: [[0, 'desc']],
        ajax: { 
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "Higrometer/GetDataTable"
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

                data.sensorType = "Higrometer";
                getSensorData(data);    
           }
        }
    });

});

function renderHigrometerChart(data) {
    
    var labels;
    var data ;
    // parse labels and data
    if(data !== undefined && data !== null){
        labels = data.map(e => moment(e.x, 'DD-MM-YYYY HH:mm:ss'));
        data = data.map(e => +e.y);
    }

    var ctx = document.getElementById("myChartHigrometer").getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Higrometer measures',
            data: data,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
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
                renderHigrometerChart(sensorData);
            }
        });
    } else {
        $.get('Home/GetChartData',function(data){
            var sensorData = data;
            if(sensorData !== undefined){
                renderHigrometerChart(sensorData);
            }
        });
    }
}