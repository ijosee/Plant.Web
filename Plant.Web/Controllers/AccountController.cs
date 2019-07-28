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
using Plant.Web.Entities.Chart;
using Plant.Web.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Plant.Web.Controllers {
    public class AccountController : Controller {
        // GET: /<controller>/
        public IActionResult ForgotPassword () {
            return View ("Views/ForgotPassword/Index.cshtml");
        }

        // GET: /<controller>/
        public IActionResult Register () {
            return View ("Views/Register/Index.cshtml");
        }

        #region error
        [ResponseCache (Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error () {
            return View (new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        #endregion
    }
}