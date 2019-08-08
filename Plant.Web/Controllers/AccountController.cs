using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
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