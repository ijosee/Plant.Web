var datahigrometer ;
var datawatterpump ;
var datalight ;

var datahumidity ;
var datatemperature ;

var yLabels = {
     0 : 'MODE_0',1 : 'MODE_1', 2 : 'MODE_2', 3 : 'MODE_3', 4 : 'MODE_4', 
}

document.addEventListener("DOMContentLoaded", function(event) { 

    inicializeEvents();
    
    getBlocksData();
    getChartData();

    setInterval(function() {
        getBlocksData();
        getChartData();
    }, 30000);

});

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

async function getBlocksData(){

    var data = {};

    data.sensorType = "Higrometer";
    $.get('Home/GetLastRowData?sensorType=' + data.sensorType, function (data) {
            $('#higrometer_total_data_number').html(data);
        });

    data.sensorType = "WatterPump";
    $.get('Home/GetLastRowData?sensorType=' + data.sensorType, function (data) {
            $('#watterpump_total_data_number').html(data);
        });

    data.sensorType = "Light";
    $.get('Home/GetLastRowData?sensorType=' + data.sensorType, function (data) {
            $('#light_total_data_number').html(data);
        });

    data.sensorType = "Temperature";
    $.get('Home/GetLastRowData?sensorType=' + data.sensorType, function (data) {
            $('#temperature_total_data_number').html(data);
        });

    data.sensorType = "Humidity";
    $.get('Home/GetLastRowData?sensorType=' + data.sensorType, function (data) {
            $('#humidity_total_data_number').html(data);
        });

     $.get('Home/GetLastWatering', function (data) {
            $('#last_wattering_date').html(data);
        });
}

function getChartData(){

        var data = {};
        data.from = moment().add(-0.5, 'hour').format('MM/DD/YYYY HH:mm:ss');
        data.to = moment().add(0.5, 'hour').format('MM/DD/YYYY HH:mm:ss');

        data.sensorType = "Higrometer";
        getSensorData(data);
}

function getSensorData(data){

    var url = "";
    if (data.from !== undefined && data.to !== undefined) {
        url ='Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + data.sensorType;
    } else{
        url = 'Home/GetChartData?sensorType=' + data.sensorType;
    }

    $.get(url, function () {
        console.log("calling :"+url);
    }).done(function(HigrometerData){

        datahigrometer =  HigrometerData;

        data.sensorType = "Watterpump";
        url = "";
        if (data.from !== undefined && data.to !== undefined) {
            url ='Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + data.sensorType;
        } else{
            url = 'Home/GetChartData?sensorType=' + data.sensorType;
        }

        $.get(url, function () {
            console.log("calling :"+url);
        }).done(function(WatterpumpData){

            datawatterpump =  WatterpumpData;

            data.sensorType = "Light";
            url = "";
            if (data.from !== undefined && data.to !== undefined) {
                url ='Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + data.sensorType;
            } else{
                url = 'Home/GetChartData?sensorType=' + data.sensorType;
            }

            $.get(url, function () {
                console.log("calling :"+url);
            }).done(function(LightData){

                datalight=  LightData;
                
                data.sensorType = "Humidity";
                url = "";
                var sensorType = data.sensorType;
                if (data.from !== undefined && data.to !== undefined) {
                    url ='Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + sensorType;
                } else{
                    url = 'Home/GetChartData?sensorType=' + sensorType;
                }
                            
                $.get(url, function () {
                    console.log("calling :"+url);
                }).done(function(HumidityData){

                    datahumidity =  HumidityData;

                    data.sensorType = "Temperature";
                    url = "";
                    var sensorType = data.sensorType;
                    if (data.from !== undefined && data.to !== undefined) {
                        url ='Home/GetChartData?from=' + data.from + '&to=' + data.to + '&sensorType=' + sensorType;
                    } else{
                        url = 'Home/GetChartData?sensorType=' + sensorType;
                    }

                    $.get(url, function () {
                        console.log("calling :"+url);
                    }).done(function(TemperatureData){

                        datatemperature=  TemperatureData;
                        renderChart();
                    });
                });
             });
        });
    });
}

function renderChart() {

    var dataYHigrometer ;
    var labels;
    if(datahigrometer !== undefined && datahigrometer !== null){
     labels = datahigrometer.map(e => moment(e.x, 'DD-MM-YYYY HH:mm:ssZ'));
     dataYHigrometer= datahigrometer.map(e => +e.y);
    }

    var dataYWatterpump ;
    if(datawatterpump !== undefined && datawatterpump !== null)
        dataYWatterpump = datawatterpump.map(e => +e.y);
    
    var dataYLight ;
    if(datalight !== undefined && datalight !== null)
        dataYLight = datalight.map(e => +e.y);

    var dataYHumidity ;
    if(datahumidity !== undefined && datahumidity !== null)
        dataYHumidity = datahumidity.map(e => +e.y);

    var dataYTemperature ;
    if(datatemperature !== undefined && datatemperature !== null)
        dataYTemperature  = datatemperature.map(e => +e.y);

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
                label: 'WATTER PUMP',
                data: dataYWatterpump,
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
            },
            {
                label: 'HUMIDITY',
                data: dataYHumidity,
                fill: false,
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
            },
            {
                label: 'TEMPERATURE',
                data: dataYTemperature,
                fill: false,
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
