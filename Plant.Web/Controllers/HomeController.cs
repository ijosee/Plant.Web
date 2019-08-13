using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Plant.Web.Entities.Model;
using Plant.Web.Entities.Rs.Higrometer;
using Plant.Web.Entities.Rs.Humidity;
using Plant.Web.Entities.Rs.Light;
using Plant.Web.Entities.Rs.Temperature;
using Plant.Web.Entities.Rs.WatterPump;
using Plant.Web.Models;

namespace Plant.Web.Controllers {
    public class HomeController : Controller {

        ILogger _logger;
        IConfiguration _configuration;
        IHttpClientFactory _clientFactory;

        public HomeController (ILogger<HomeController> logger,
            IConfiguration configuration, IHttpClientFactory clientFactory
        ) {
            _logger = logger;
            _configuration = configuration;
            _clientFactory = clientFactory;
        }

        public IActionResult Index () {
            return View ();
        }

        public IActionResult Privacy () {
            return View ();
        }

        [HttpGet]
        public async Task<List<ChartModel>> GetChartData (string from, string to, string sensorType) {
            var result = new List<ChartModel> ();
            try {

                _logger.LogDebug ("Getting sensor data from api");
                var baseUrl = _configuration.GetSection ("PlantApi").GetSection ("BaseUrl").Value.ToString ();
                _logger.LogInformation ($"ApiBaseUrl -> {baseUrl}");
                var request = new HttpRequestMessage (HttpMethod.Get,
                    $"{baseUrl}api/{sensorType}/GetChart?from={from}&to={to}");

                var client = _clientFactory.CreateClient ();
                var response = await client.SendAsync (request);

                if (response.IsSuccessStatusCode) {
                    result = await response.Content.ReadAsAsync<List<ChartModel>> ();
                } else {
                    result = null;
                }

                _logger.LogDebug ($"Datta getted . Total results {result?.Count}");
            } catch (System.Exception ex) {
                _logger.LogError (ex.Message);
                throw;
            }
            return result;
        }

        [HttpGet]
        public async Task<string> GetLastWatering () {
            var result = string.Empty;
            try {

                _logger.LogDebug ("Getting sensor data from api");
                var baseUrl = _configuration.GetSection ("PlantApi").GetSection ("BaseUrl").Value.ToString ();
                _logger.LogInformation ($"ApiBaseUrl -> {baseUrl}");
                var request = new HttpRequestMessage (HttpMethod.Get,
                    $"{baseUrl}api/WatterPump/");

                var client = _clientFactory.CreateClient ();
                var watterPumpResponse = await client.SendAsync (request);

                if (watterPumpResponse.IsSuccessStatusCode) {
                    var httpResultWatterPumTotal = await watterPumpResponse.Content.ReadAsAsync<List<int>> ();
                    var lastId = httpResultWatterPumTotal.Last ();

                    _logger.LogDebug ("Getting sensor data from api");
                    _logger.LogInformation ($"ApiBaseUrl -> {baseUrl}");
                    request = new HttpRequestMessage (HttpMethod.Get,
                        $"{baseUrl}api/WatterPump/{lastId}");

                    var httpResultWatterPum = await client.SendAsync (request);
                    if (httpResultWatterPum.IsSuccessStatusCode) {
                        var httpResult = await httpResultWatterPum.Content.ReadAsAsync<WatterPumpLogRs> ();

                        var dayDiffs = (httpResult.Timestamp - DateTime.Now).Days;

                        result = $"Last plant watering {httpResult.Timestamp.ToString("yyyy-MM-dd")} at {httpResult.Timestamp.ToString("HH:mm:ss")} with [{httpResult.Value}] ml. {-dayDiffs} day(s) ago.";
                    } else {
                        result = null;
                    }

                } else {
                    result = null;
                }

            } catch (System.Exception ex) {
                _logger.LogError (ex.Message);
                throw;
            }
            return result;
        }

        [HttpGet]
        public async Task<string> GetLastRowData (string sensorType) {

            string result = string.Empty;
            try {

                _logger.LogDebug ("Getting sensor data from api");
                var baseUrl = _configuration.GetSection ("PlantApi").GetSection ("BaseUrl").Value.ToString ();
                _logger.LogInformation ($"ApiBaseUrl -> {baseUrl}");
                var request = new HttpRequestMessage (HttpMethod.Get,
                    $"{baseUrl}api/{sensorType}");

                var client = _clientFactory.CreateClient ();
                var response = await client.SendAsync (request);

                if (response.IsSuccessStatusCode) {
                    var httpResultValue = await response.Content.ReadAsAsync<List<object>> ();
                    // get last value
                    var lastId = httpResultValue.Last ();
                    // show base
                    _logger.LogInformation ($"ApiBaseUrl -> {baseUrl}");
                    // prepare request
                    request = new HttpRequestMessage (HttpMethod.Get,
                        $"{baseUrl}api/{sensorType}/{lastId}");

                    var httpResult = await client.SendAsync (request);
                    if (httpResult.IsSuccessStatusCode) {
                        var httpResultWithValue = await httpResult.Content.ReadAsAsync<object> ();

                        if (sensorType.Equals ("Higrometer")) {
                            var objectResult = JsonConvert.DeserializeObject<HigrometerLogRs> ($"{httpResultWithValue}");
                            result = $"{objectResult.Value} % ";
                        }
                        if (sensorType.Equals ("Humidity")) {
                            var objectResult = JsonConvert.DeserializeObject<HumidityLogRs> ($"{httpResultWithValue}");
                            result = $" { objectResult.Value } % ";
                        }
                        if (sensorType.Equals ("Light")) {
                            var objectResult = JsonConvert.DeserializeObject<LightLogRs> ($"{httpResultWithValue}");
                            result = $"{objectResult.Value} blinks ";
                        }
                        if (sensorType.Equals ("Temperature")) {
                            var objectResult = JsonConvert.DeserializeObject<TemperatureLogRs> ($"{httpResultWithValue}");
                            result = $" { objectResult.Value } Cª ";
                        }
                        if (sensorType.Equals ("WatterPump")) {
                            var objectResult = JsonConvert.DeserializeObject<WatterPumpLogRs> ($"{httpResultWithValue}");
                            result = $"{objectResult.Value} ml ";
                        }

                    } else {
                        result = null;
                    }

                } else {
                    result = null;
                }

            } catch (System.Exception ex) {
                _logger.LogError (ex.Message);
                throw;
            }
            return result;
        }

        #region error
        [ResponseCache (Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error () {
            return View (new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        #endregion
    }
}