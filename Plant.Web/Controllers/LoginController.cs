using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Plant.Web.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Plant.Web.Controllers {
    public class LoginController : Controller {
        // GET: /<controller>/
        public IActionResult Index () {
            return View ();
        }

        // GET: /<controller>/
        public IActionResult GrantAccess () {

            return View ("Views/Home/Index.cshtml");
        }

        #region error
        [ResponseCache (Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error () {
            return View (new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        #endregion
    }
}