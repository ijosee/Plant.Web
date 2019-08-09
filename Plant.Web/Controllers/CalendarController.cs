using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Plant.Web.Entities.Model;
using Plant.Web.Entities.Rq.DataTable;
using Plant.Web.Entities.Rs.Calendar;
using Plant.Web.Entities.Rs.DataTable;
using Plant.Web.Entities.Rs.Light;
using Plant.Web.Models;

namespace Plant.Web.Controllers {
    public class CalendarController : Controller {

        ILogger _logger;
        IConfiguration _configuration;
        IHttpClientFactory _clientFactory;

        public CalendarController (ILogger<LightController> logger,
            IConfiguration configuration, IHttpClientFactory clientFactory
        ) {
            _logger = logger;
            _configuration = configuration;
            _clientFactory = clientFactory;
        }

        public IActionResult Index () {
            return View ();
        }

        [HttpGet]
        public async Task<List<FullCalendarRs>> GetFullCalendar (DateTime from, DateTime to) {
            var result = new List<FullCalendarRs> ();
            try {
                _logger.LogDebug ("Getting sensor data from api");
                var baseUrl = _configuration.GetSection ("PlantApi").GetSection ("BaseUrl").Value.ToString ();
                _logger.LogInformation ($"ApiBaseUrl -> {baseUrl}");
                var request = new HttpRequestMessage (HttpMethod.Get,
                    $"{baseUrl}api/Calendar/GetFullCalendar?from={from}&to={to}");

                var client = _clientFactory.CreateClient ();
                var response = await client.SendAsync (request);

                if (response.IsSuccessStatusCode) {
                    result = await response.Content.ReadAsAsync<List<FullCalendarRs>> ();
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
        public async Task<DataTableRs<LightLogRs>> GetDataTable (DataTableRq request) {
            var result = new DataTableRs<LightLogRs> ();
            try {
                _logger.LogDebug ("Getting sensor data from api");
                var baseUrl = _configuration.GetSection ("PlantApi").GetSection ("BaseUrl").Value.ToString ();
                _logger.LogInformation ($"ApiBaseUrl -> {baseUrl}");
                var httpRequest = new HttpRequestMessage (HttpMethod.Post,
                    $"{baseUrl}api/Calendar/GetDataTable");
                httpRequest.Content = new StringContent (JsonConvert.SerializeObject (request), Encoding.UTF8, "application/json");

                var client = _clientFactory.CreateClient ();
                var response = await client.SendAsync (httpRequest);

                if (response.IsSuccessStatusCode) {
                    result = await response.Content.ReadAsAsync<DataTableRs<LightLogRs>> ();
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