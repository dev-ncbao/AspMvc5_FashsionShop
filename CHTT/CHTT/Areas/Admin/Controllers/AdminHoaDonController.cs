using CHTT.Areas.Admin.Models;
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
    public class AdminHoaDonController : Controller
    {
        private CHTTDbContext _context;

        public AdminHoaDonController()
        {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }
        // GET: Admin/AdminHoaDon
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadIndexData()
        {
            var strSql = "select hd.MaHD, HoTen as HoTenKH, NgayXuatHD, Sum(SoLuong) as TongSoLuong, sum(Gia*SoLuong) as TongGiaTri, MaDD from HoaDon hd join HoaDonCT hdct on hd.MaHD = hdct.MaHD join KhachHang kh on kh.MaKH = hd.MaKH group by hd.MaHD, Hoten, NgayXuatHD, hd.MaDD";
            var data = _context.Database.SqlQuery<HoaDonModel>(strSql).ToList();
            return Json(new
            {
                data = data,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Detail(string strMaHD)
        {
            if (strMaHD == null)
            {
                return HttpNotFound();
            }
            else
            {
                var strSql = "  select hd.MaHD,hd.MaDD, NgayXuatHD, sum(Gia*SoLuong) as TongGiaTri, hd.GhiChu,kh.MaKH,HoTen as HoTenKH,Phai,SoDienThoai,Email,DiaChi,MaNV from HoaDon hd join HoaDonCT hdct on hd.MaHD = hdct.MaHD join KhachHang kh on kh.MaKH = hd.MaKH where hd.MaHD ='" + strMaHD+"' group by hd.MaHD,hd.MaDD, NgayXuatHD, hd.GhiChu,kh.MaKH,HoTen,Phai,SoDienThoai,Email,DiaChi,MaNV";
                var data = _context.Database.SqlQuery<HoaDonChiTietModel>(strSql).FirstOrDefault();
                return View(data);
            }
        }
    }
}