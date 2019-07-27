// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
var apiurl = "localhost";
// Write your JavaScript code.
var yLabelsServo = {
     0 : 'MODE_0',1 : 'MODE_1', 2 : 'MODE_2', 3 : 'MODE_3', 4 : 'MODE_4', 
}

// Write your JavaScript code.
var yLabelsLight = {
    0 : 'MODE_0',1 : 'MODE_1', 2 : 'MODE_2', 3 : 'MODE_3', 4 : 'MODE_4', 
}

$(document).ready(function () {

    var data = {};

    data.from = moment().add(-6, 'hour').format('MM-DD-YYYY HH:mm:ss');
    data.to = moment().add(6, 'hour').format('MM-DD-YYYY HH:mm:ss');

    getSensorData(data);
    getServoData(data);
    getLightData(data);


    $('#daterangeHigrometer').daterangepicker({
        opens: 'left',
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
          format: 'M/DD hh:mm A'
        }
      }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('MM-DD-YYYY HH:mm:ss') + ' to ' + end.format('MM-DD-YYYY HH:mm:ss'));
        });
    $('#daterangeServo').daterangepicker({
        opens: 'left',
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
          format: 'M/DD hh:mm A'
        }
      }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('MM-DD-YYYY HH:mm:ss') + ' to ' + end.format('MM-DD-YYYY HH:mm:ss'));
        });
    $('#daterangeLight').daterangepicker({
        opens: 'left',
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
          format: 'M/DD hh:mm A'
        }
      }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('MM-DD-YYYY HH:mm:ss') + ' to ' + end.format('MM-DD-YYYY HH:mm:ss'));
        });


   $('#daterangeHigrometer').on('apply.daterangepicker', function(ev, picker) {

       var data = {};

       data.from = picker.startDate.format('MM-DD-YYYY HH:mm:ss');
       data.to = picker.endDate.format('MM-DD-YYYY HH:mm:ss'); 
       
       getSensorData(data);

   });

    $('#daterangeServo').on('apply.daterangepicker', function (ev, picker) {

       var data = {};

       data.from = picker.startDate.format('MM-DD-YYYY HH:mm:ss');
       data.to = picker.endDate.format('MM-DD-YYYY HH:mm:ss'); 
       
       getServoData(data);
     });

    $('#daterangeLight').on('apply.daterangepicker', function (ev, picker) {

       var data = {};

       data.from = picker.startDate.format('MM-DD-YYYY HH:mm:ss');
       data.to = picker.endDate.format('MM-DD-YYYY HH:mm:ss'); 
       
       getLightData(data);
    });
});

function renderSensorChart(data) {
    // parse labels and data
    var labels = data.map(e => moment(e.x, 'HH:mm:ss'));
    var data = data.map(e => +e.y);


    var ctx = document.getElementById("myChartSensor").getContext('2d');
    var chart = new Chart(ctx, {
       type: 'line',
       data: {
          labels: labels,
          datasets: [{
            label: 'Sensor measures',
            data: data,
            borderWidth: 1,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
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
          },
       }
    });

}

function renderServoChart(data) {
    // parse labels and data
    var labels = data.map(e => moment(e.x, 'HH:mm:ss'));
    var data = data.map(e => +e.mode);

    var ctx = document.getElementById("myChartServo").getContext('2d');
    var chart = new Chart(ctx, {
       type: 'line',
       data: {
          labels: labels,
          datasets: [{
             label: 'Servo measures',
             data: data,
             borderWidth: 1
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
              }],
              yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            // for a value (tick) equals to 8
                            var val = value;
                            return yLabelsServo[val];
                        },
                        beginAtZero: true
                    }
                }]
          },
       }
    });

}

function renderLightChart(data) {
    // parse labels and data
    var labels = data.map(e => moment(e.x, 'HH:mm:ss'));
    var data = data.map(e => +e.mode);

    var ctx = document.getElementById("myChartLight").getContext('2d');
    var chart = new Chart(ctx, {
       type: 'line',
       data: {
          labels: labels,
          datasets: [{
            label: 'Light measures',
            data: data,
            borderWidth: 1,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
          }]
       },
       options: {
          scales: {
              xAxes: [{
                barPercentage: 0.5,
                barThickness: 6,
                maxBarThickness: 8,
                minBarLength: 2,
                gridLines: {
                    offsetGridLines: true
                },
                type: 'time',
                time: {
                   unit: 'minute',
                   displayFormats: {
                      hour: 'HH:mm'
                   }
                }
             }],
              yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            // for a value (tick) equals to 8
                            var val = value;
                            return yLabelsLight[val];
                        }
                    }
              }],
               beginAtZero: true
          },
       }
    });

}




function getSensorData(data){

    if (data.from !== undefined && data.to !== undefined) {
        $.get('http://'+apiurl+':5000/api/Higrometer/GetChart?from=' + data.from + '&to=' + data.to + '', function (data) {
            var sensorData = data;
            renderSensorChart(sensorData);
        });
    } else {
        $.get('http://'+apiurl+'5000/api/Higrometer/GetChart',function(data){
        var sensorData = data; 
        renderSensorChart(sensorData);
        });
    }

}

function getServoData(data){

    if (data.from !== undefined && data.to !== undefined) {
        $.get('http://'+apiurl+':5000/api/Servo/GetChart?from=' + data.from + '&to=' + data.to + '', function (data) {
            var sensorData = data;
            renderServoChart(sensorData);
        });
    } else {
        $.get('http://'+apiurl+':5000/api/Servo/GetChart',function(data){
        var sensorData = data; 
        renderServoChart(sensorData);
        });
    }

}

function getLightData(data){

    if (data.from !== undefined && data.to !== undefined) {
        $.get('http://'+apiurl+':5000/api/Light/GetChart?from=' + data.from + '&to=' + data.to + '', function (data) {
            var sensorData = data;
            renderLightChart(sensorData);
        });
    } else {
        $.get('http://'+apiurl+':5000/api/Light/GetChart',function(data){
        var sensorData = data; 
        renderLightChart(sensorData);
        });
    }

}