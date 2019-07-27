using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Plant.Web.Controllers
{
    public class AccountController : Controller
    {
        // GET: /<controller>/
        public IActionResult ForgotPassword()
        {
            return View("Views/ForgotPassword/Index.cshtml");
        }

        // GET: /<controller>/
        public IActionResult Register()
        {
            return View("Views/Register/Index.cshtml");
        }
    }
}
