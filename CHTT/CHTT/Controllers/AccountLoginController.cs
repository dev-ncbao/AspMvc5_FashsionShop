using CHTT.AdditionalFeature;
using CHTT.Models;
using Model;
using Model.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHTT.Controllers
{
    public class AccountLoginController : Controller
    {
        private CHTTDbContext _context;

        public AccountLoginController() {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }

        [HttpGet]
        public ActionResult LoginModal()
        {
            return View();
        }

        [HttpGet]
        public ActionResult RegisterModal()
        {
            return View();
        }

        [HttpGet]
        public ActionResult LostPassword()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ChangePassword(string strCurMK, string strNewMK)
        {
            var cusID = Session["CustomerID"].ToString();
            strCurMK = Encryptor.ComputeSHA256Hash(strCurMK);
            var data = _context.KhachHangs.Where(x => x.MaKH == cusID && x.MatKhau == strCurMK).FirstOrDefault();
            if (data != null)
            {
                data.MatKhau = Encryptor.ComputeSHA256Hash(strNewMK);
                _context.Entry(data).State = System.Data.Entity.EntityState.Modified;
                _context.SaveChanges();
                return Json(new
                {
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult UpdateInformation()
        {
            var strMaKH = Session["CustomerID"].ToString();
            var data = _context.KhachHangs.Where(x=>x.MaKH == strMaKH).FirstOrDefault();
            ViewBag.NgaySinhInput = data.NgaySinh.Year+"-"+data.NgaySinh.Month.ToString("00")+"-"+data.NgaySinh.Day.ToString("00");
            return View(data);
        }

        [HttpGet]
        public JsonResult GetShoppingCart()
        {
            var strMaKH = Session["CustomerID"].ToString();
            var strSql = "select gh.MaSP, sp.TenSP, gh.Size, sps.Gia as GiaBan, gh.SoLuong, (select Link from vw_spanhdaidien where MaSP = gh.MaSP) as LinkAnh from GioHang gh join SanPham sp on gh.MaSP=sp.MaSP join SPSize sps on gh.MaSP = sps.MaSP and gh.Size = sps.Size where MaKH = '"+ strMaKH +"'";
            var data = _context.Database.SqlQuery<ShoppingCartModel>(strSql).ToList();
            int total = data.Sum(x=>x.Soluong*x.GiaBan);
            int totalamount = data.Sum(x => x.Soluong);
            return Json(new { 
                data = data,
                total = total,
                totalamount = totalamount,
                status = true
            },JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateInformation(KhachHang model)
        {
            try
            {
                var cusID = Session["CustomerID"].ToString();
                var data = _context.KhachHangs.Where(x => x.MaKH == cusID && x.TaiKhoan == model.TaiKhoan).FirstOrDefault();
                data.HoTen = model.HoTen;
                data.NgaySinh = model.NgaySinh;
                data.Phai = model.Phai;
                data.DiaChi = model.DiaChi;
                data.Email = model.Email;
                data.SoDienThoai = model.SoDienThoai;
                _context.Entry(data).State = System.Data.Entity.EntityState.Modified;
                _context.SaveChanges();
                return Json(new
                {
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new
                {
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult LostPassword(string strTK, string strSDT)
        {
            return Json(new {
                status = true
            },JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Login(string strTK, string strMK)
        {
            if (string.IsNullOrEmpty(strMK)) {
                return Json(new
                {
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
            strMK = Encryptor.ComputeSHA256Hash(strMK);
            var data = _context.KhachHangs.Where(x => x.TaiKhoan == strTK && x.MatKhau == strMK && x.KichHoat == 1).FirstOrDefault();
            if (data != null)
            {
                Session["CustomerID"] = data.MaKH;
                Session["CustomerName"] = data.HoTen;
                return Json(new
                {
                    name = data.HoTen,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetCustomerName()
        {
            var data = Session["CustomerName"];
            return Json(new
            {
                data = data,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Logout()
        {
            if (Session["CustomerID"] != null && Session["CustomerName"] != null)
            {
                Session.Remove("CustomerID");
                Session.Remove("CustomerName");
                return Json(new
                {
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}