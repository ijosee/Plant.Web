var datahigrometer ;
var dataservo ;
var datalight ;

var yLabels = {
     0 : 'MODE_0',1 : 'MODE_1', 2 : 'MODE_2', 3 : 'MODE_3', 4 : 'MODE_4', 
}

document.addEventListener("DOMContentLoaded", function(event) { 

    inicializeEvents();

    setInterval(function() {
        getBlocksData();
        getChartData();
    }, 2000);

});

// inicialize
function inicializeEvents(){
    $('#daterangeHigrometer').daterangepicker({
        opens: 'left',
        timePicker: true,
        startDate: moment().add(-2.5,'minute'),
        endDate: moment().add(2.5, 'minute'),
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
       
       data.sensorType = "Higrometer";
       getSensorData(data);

   });
}

function getBlocksData(){

    var data = {};

    data.sensorType = "Higrometer";
    $.get('Home/GetTotalData?sensorType=' + data.sensorType, function (data) {
            $('#higrometer_total_data_number').html(data);
        });
    data.sensorType = "Servo";
    $.get('Home/GetTotalData?sensorType=' + data.sensorType, function (data) {
            $('#servo_total_data_number').html(data);
        });
    data.sensorType = "Light";
    $.get('Home/GetTotalData?sensorType=' + data.sensorType, function (data) {
            $('#light_total_data_number').html(data);
        });
}

function getChartData(){

        var data = {};
        data.from = moment().add(-2.5, 'minute').format('MM/DD/YYYY HH:mm:ss');
        data.to = moment().add(2.5, 'minute').format('MM/DD/YYYY HH:mm:ss');

        data.sensorType = "Higrometer";
        getSensorData(data);
}

function renderChart(datahigrometer, dataservo, datalight) {
    var labels = datahigrometer.map(e => moment(e.x, 'MM-DD-YYYY HH:mm:ss'));

    var dataYHigrometer ;
    if(datahigrometer !== undefined && datahigrometer !== null)
        dataYHigrometer= datahigrometer.map(e => +e.y);

    var dataYServo ;
    if(dataservo !== undefined && dataservo !== null)
        dataYServo = dataservo.map(e => +e.y);
    
    var dataYLight ;
    if(datalight !== undefined && datalight !== null)
        dataYLight = datalight.map(e => +e.y);

    var ctx = document.getElementById("myChartSensor").getContext('2d');
    new Chart(ctx, {
       type: 'line',
       data: {
          labels: labels,
          datasets: [
            {
                label: 'HIGROMETER',
                data: dataYHigrometer,
                fill: false,
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
            },
            {
                label: 'SERVO',
                data: dataYServo,
                fill: false,
                backgroundColor: "rgba(78, 223, 115, 0.05)",
                borderColor: "rgba(78, 223, 115, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 223, 115, 1)",
                pointBorderColor: "rgba(78, 223, 115, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 223, 115, 1)",
                pointHoverBorderColor: "rgba(78, 223, 115, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
            },
            {
                label: 'LIGHT',
                data: dataYLight,
                fill: false,
                backgroundColor: "rgba(255, 255, 0, 0.05)",
                borderColor: "rgba(255, 255, 0,1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(255, 255, 0, 1)",
                pointBorderColor: "rgba(255, 255, 0, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(255, 255, 0, 1)",
                pointHoverBorderColor: "rgba(255, 255, 0, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
            }
        ]
        },
       options: {
          scales: {
             xAxes: [{
                type: 'time',
                time: {
                   unit: 'minute'
                },
                distribution: 'linear'
             }]
          },legend: {
            display: true
        },
        animation: false,
        //Boolean - If we want to override with a hard coded scale
        scaleOverride: true,
        //** Required if scaleOverride is true **
        //Number - The number of steps in a hard coded scale
        scaleSteps: 10,
        //Number - The value jump in the hard coded scale
        scaleStepWidth: 10,
        //Number - The scale starting value
        scaleStartValue: 0
       }
    });
}

function getSensorData(data){

    var url = "";
    var sensorType = data.sensorType;
    if (data.from !== undefined && data.to !== undefined) {
        url ='Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + sensorType;
    } else{
        url = 'Home/GetChartData?sensorType=' + sensorType;
    }

    $.get(url, function () {
        console.log("calling :"+url);
        }).done(function(HigrometerData){

            console.log("done , datahigrometer ! ");
            datahigrometer =  HigrometerData;

            var data = {};
            data.from = moment().add(-0.5, 'hour').format('MM/DD/YYYY HH:mm:ss');
            data.to = moment().add(0.5, 'hour').format('MM/DD/YYYY HH:mm:ss');

            data.sensorType = "Servo";
            url = "";
            var sensorType = data.sensorType;
            if (data.from !== undefined && data.to !== undefined) {
                url ='Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + sensorType;
            } else{
                url = 'Home/GetChartData?sensorType=' + sensorType;
            }

            $.get(url, function () {
                console.log("calling :"+url);
                }).done(function(ServoData){

                    console.log("done , datahservo ! ");
                    dataservo =  ServoData;

                    var data = {};
                    data.from = moment().add(-0.5, 'hour').format('MM/DD/YYYY HH:mm:ss');
                    data.to = moment().add(0.5, 'hour').format('MM/DD/YYYY HH:mm:ss');

                    data.sensorType = "Light";
                    url = "";
                    var sensorType = data.sensorType;
                    if (data.from !== undefined && data.to !== undefined) {
                        url ='Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + sensorType;
                    } else{
                        url = 'Home/GetChartData?sensorType=' + sensorType;
                    }

                    $.get(url, function () {
                        console.log("calling :"+url);
                        }).done(function(LightData){

                            console.log("done , datalight ! ");
                            datalight=  LightData;

                            renderChart(datahigrometer, dataservo, datalight);

                        });
                });
        });
  }