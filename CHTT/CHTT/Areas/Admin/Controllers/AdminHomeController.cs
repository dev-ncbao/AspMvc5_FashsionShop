using CHTT.AdditionalFeature;
using Model;
using Model.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHTT.Areas.Admin.Controllers
{
    [Authorize]
    public class AdminHomeController : Controller
    {
        private CHTTDbContext _context;

        public AdminHomeController()
        {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }
        // GET: Admin/AdminHome
        public ActionResult Index()
        {
            return View();
        }
        //
        [HttpGet]
        public JsonResult getData()
        {
            var countKH = _context.KhachHangs.Count();
            var countSP = _context.SanPhams.Count();
            var countDD = _context.DonDats.Where(x => x.TrangThai == 0).Count();
            var countPN = _context.PhieuNhaps.Count();
            return Json(new { 
                intKH = countKH,
                intSP = countSP,
                intDD = countDD,
                intPN = countPN,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountInformation()
        {
            return View();
        }

        [HttpGet]
        public JsonResult AccountInformationData()
        {
            var userID = Session["UserID"].ToString();
            var userData = _context.NhanViens.Join(_context.ChucVus, x => x.MaChucVu, y => y.MaChucVu, (x, y) => new {
                y.TenChucVu,
                x.MaNV,
                x.HoTen,
                x.Phai,
                x.NgaySinh,
                x.QueQuan,
                x.DiaChi,
                x.SoDienThoai,
                x.Email,
                x.Luong,
            }).Where(x => x.MaNV == userID).FirstOrDefault();
            string userBirthDay = userData.NgaySinh.Day.ToString("00") + '/' + userData.NgaySinh.Month.ToString("00") + '/' + userData.NgaySinh.Year.ToString("00");
            return Json(new { data = userData,userBirthDay = userBirthDay, status = true },JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UserChangePass(string strCurPass, string strNewPass)
        {
            var userID = Session["UserID"].ToString();
            var userData = _context.NhanViens.Find(userID);
            if(userData.MatKhau == Encryptor.ComputeSHA256Hash(strCurPass))
            {
                userData.MatKhau = Encryptor.ComputeSHA256Hash(strNewPass);
                _context.Entry(userData).State = System.Data.Entity.EntityState.Modified;
                _context.SaveChanges();
                return Json(new { status = true }, JsonRequestBehavior.AllowGet); 
            }
            else
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetUserPermission()
        {
            try
            {
                var data = Session["UserPermission"].ToString();
                return Json(new { data = data }, JsonRequestBehavior.AllowGet);
            }
            catch (NullReferenceException)
            {
                string datanull = null;
                return Json(new { data = datanull }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}