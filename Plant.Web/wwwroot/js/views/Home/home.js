var yLabels = {
     0 : 'MODE_0',1 : 'MODE_1', 2 : 'MODE_2', 3 : 'MODE_3', 4 : 'MODE_4', 
}


document.addEventListener("DOMContentLoaded", function(event) { 

    var data = {};

    data.from = moment().add(-6, 'hour').format('MM/DD/YYYY HH:mm:ss');
    data.to = moment().add(6, 'hour').format('MM/DD/YYYY HH:mm:ss');

    data.sensorType = "Higrometer";
    getSensorData(data);
    // data.sensorType = "Servo";
    // getSensorData(data);
    // data.sensorType = "Light";
    // getSensorData(data);


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
    // $('#daterangeServo').daterangepicker({
    //     opens: 'left',
    //     timePicker: true,
    //     startDate: moment().startOf('hour'),
    //     endDate: moment().startOf('hour').add(32, 'hour'),
    //     locale: {
    //       format: 'M/DD hh:mm A'
    //     }
    //   }, function(start, end, label) {
    //     console.log("A new date selection was made: " + start.format('MM-DD-YYYY HH:mm:ss') + ' to ' + end.format('MM-DD-YYYY HH:mm:ss'));
    //     });
    // $('#daterangeLight').daterangepicker({
    //     opens: 'left',
    //     timePicker: true,
    //     startDate: moment().startOf('hour'),
    //     endDate: moment().startOf('hour').add(32, 'hour'),
    //     locale: {
    //       format: 'M/DD hh:mm A'
    //     }
    //   }, function(start, end, label) {
    //     console.log("A new date selection was made: " + start.format('MM-DD-YYYY HH:mm:ss') + ' to ' + end.format('MM-DD-YYYY HH:mm:ss'));
    //     });


   $('#daterangeHigrometer').on('apply.daterangepicker', function(ev, picker) {

       var data = {};

       data.from = picker.startDate.format('MM-DD-YYYY HH:mm:ss');
       data.to = picker.endDate.format('MM-DD-YYYY HH:mm:ss'); 
       
       data.sensorType = "Higrometer";
       getSensorData(data);

   });

    // $('#daterangeServo').on('apply.daterangepicker', function (ev, picker) {

    //    var data = {};

    //    data.from = picker.startDate.format('MM-DD-YYYY HH:mm:ss');
    //    data.to = picker.endDate.format('MM-DD-YYYY HH:mm:ss'); 
       
    //    data.sensorType = "Servo";
    //    getSensorData(data);
    
    //  });

    // $('#daterangeLight').on('apply.daterangepicker', function (ev, picker) {

    //    var data = {};

    //    data.from = picker.startDate.format('MM-DD-YYYY HH:mm:ss');
    //    data.to = picker.endDate.format('MM-DD-YYYY HH:mm:ss'); 
       
    //    data.sensorType = "Light";
    //    getSensorData(data);
    // });
});

function renderSensorChart(data) {
    // parse labels and data
    var labels = data.map(e => moment(e.x, 'MM-DD-YYYY HH:mm:ss'));
    var data = data.map(e => +e.y);

    var ctx = document.getElementById("myChartSensor").getContext('2d');
    var chart = new Chart(ctx, {
       type: 'line',
       data: {
          labels: labels,
          datasets: [{
            label: 'Sensor measures',
            data: data,
            fill: false,
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
                   unit: 'hour',
                   displayFormats: {
                      hour: 'HH:mm'
                   }
                }
             }]
          }
       }
    });

}

// function renderServoChart(data) {
//     // parse labels and data
//     var labels = data.map(e => moment(e.x, 'MM-DD-YYYY HH:mm:ss'));
//     var data = data.map(e => +e.mode);

//     var ctx = document.getElementById("myChartServo").getContext('2d');
//     var chart = new Chart(ctx, {
//        type: 'line',
//        data: {
//           labels: labels,
//           datasets: [{
//              label: 'Servo measures',
//              data: data,
//              borderWidth: 1
//           }]
//        },
//        options: {
//           scales: {
//              xAxes: [{
//                 type: 'time',
//                 time: {
//                    unit: 'hour',
//                    displayFormats: {
//                       hour: 'HH:mm'
//                    }
//                 }
//               }],
//               yAxes: [{
//                     ticks: {
//                         callback: function(value, index, values) {
//                             // for a value (tick) equals to 8
//                             var val = value;
//                             return yLabels[val];
//                         },
//                         beginAtZero: true
//                     }
//                 }]
//           },
//        }
//     });

// }

// function renderLightChart(data) {
//     // parse labels and data
//     var labels = data.map(e => moment(e.x, 'MM-DD-YYYY HH:mm:ss'));
//     var data = data.map(e => +e.mode);

//     var ctx = document.getElementById("myChartLight").getContext('2d');
//     var chart = new Chart(ctx, {
//        type: 'line',
//        data: {
//           labels: labels,
//           datasets: [{
//             label: 'Light measures',
//             data: data,
//             borderWidth: 1,
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//           }]
//        },
//        options: {
//           scales: {
//               xAxes: [{
//                 barPercentage: 0.5,
//                 barThickness: 6,
//                 maxBarThickness: 8,
//                 minBarLength: 2,
//                 gridLines: {
//                     offsetGridLines: true
//                 },
//                 type: 'time',
//                 time: {
//                    unit: 'hour',
//                    displayFormats: {
//                       hour: 'HH:mm'
//                    }
//                 }
//              }],
//               yAxes: [{
//                     ticks: {
//                         callback: function(value, index, values) {
//                             // for a value (tick) equals to 8
//                             var val = value;
//                             return yLabels[val];
//                         }
//                     }
//               }],
//                beginAtZero: true
//           },
//        }
//     });

// }


function getSensorData(data){

    var sensorType = data.sensorType;
    if (data.from !== undefined && data.to !== undefined) {
        $.get('Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + data.sensorType, function (data) {
            var sensorData = data;
            switch (sensorType) {
                case "Higrometer":
                    renderSensorChart(sensorData);
                    break;
                    case "Servo":
                    renderServoChart(sensorData);
                    break;
                    case "Light":
                    renderLightChart(sensorData);
                    break;
                default:
                    break;
            }
        });
    } else {
        $.get('Home/GetChartData',function(data){
        var sensorData = data;
            switch (sensorType) {
                case "Higrometer":
                    renderSensorChart(sensorData);
                    break;
                    case "Servo":
                    renderServoChart(sensorData);
                    break;
                    case "Light":
                    renderLightChart(sensorData);
                    break;
                default:
                    break;
            }
        });
    }
}