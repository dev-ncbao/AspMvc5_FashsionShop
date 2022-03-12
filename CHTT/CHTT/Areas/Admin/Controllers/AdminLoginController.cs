using CHTT.AdditionalFeature;
using CHTT.Areas.Admin.Models;
using Model.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace CHTT.Areas.Admin.Controllers
{
    public class AdminLoginController : Controller
    {
        [HttpGet]
        public ActionResult Login() {
            return View();
        }
        //
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginModel model) {

            if (ModelState.IsValid && Membership.ValidateUser(model.Username, model.Password))
            {
                FormsAuthentication.SetAuthCookie(model.Username, model.RememberMe);
                var User = new AdminLogin().layDuLieuNhanVien(model.Username, Encryptor.ComputeSHA256Hash(model.Password));
                Session["UserID"] = User.MaNV;
                Session["Username"] = User.HoTen;
                Session["UserPermission"] = User.MaChucVu;
                return RedirectToAction("Index", "AdminHome");
            }
            else ModelState.AddModelError("", "Tài khoản hoặc mật khẩu không đúng.");
            return View();
        }
        //Logout
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            Session.Remove("UserID");
            Session.Remove("UserName");
            Session.Remove("MaChucVu");
            return RedirectToAction("Login", "AdminLogin");
        }

        public ActionResult ForgotPassword()
        {
            return View();
        }
    }
}