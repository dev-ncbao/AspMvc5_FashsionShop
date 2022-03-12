using CHTT.Areas.Admin.Models;
using Model.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHTT.Areas.Admin.Controllers
{
    [Authorize]
    public class AdminThongKeController : Controller
    {
        private CHTTDbContext _context = null;

        public AdminThongKeController() {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetReport(string dateType, string date)
        {
            string strDate = "";
            DateTime dateTime = DateTime.Parse(date);
            if (dateType == "day")
            {
                strDate = "where DAY(hd.NgayXuatHD) = " + dateTime.Day + " and MONTH(hd.NgayXuatHD) = " + dateTime.Month + " and YEAR(hd.NgayXuatHD) = " + dateTime.Year;
            }
            else if (dateType == "month")
            {
                strDate = "where MONTH(hd.NgayXuatHD) = " + dateTime.Month + " and YEAR(hd.NgayXuatHD) = " + dateTime.Year;
            }
            else if(dateType == "year") {
                strDate = "where YEAR(hd.NgayXuatHD) = " + dateTime.Year;
            }

            string strSqlProduct = "select hdct.MaSP, sp.TenSP, hdct.Size, hdct.Gia, sum(hdct.SoLuong) as SoLuong from HoaDon hd join HoaDonCT hdct on hd.MaHD = hdct.MaHD join SanPham sp on sp.MaSP = hdct.MaSP"
                                    +" "+strDate
                                    +" group by hdct.MaSP, hdct.Size, hdct.Gia, sp.TenSP"
                                    +" order by SoLuong desc";

            string strSqlTotal = "select count(*) as SoHoaDon, sum(SoLuong * Gia) as DoanhThu from HoaDon hd join HoaDonCT hdct on hd.MaHD = hdct.MaHD"
                                + " "+ strDate;

            List<ReportProductModel> rpListProduct = _context.Database.SqlQuery<ReportProductModel>(strSqlProduct).ToList();
            ReportTotalModel rpTotal = _context.Database.SqlQuery<ReportTotalModel>(strSqlTotal).FirstOrDefault();

            return Json(new
            {
                status = true,
                products = rpListProduct,
                total = rpTotal
            }, JsonRequestBehavior.AllowGet);
        }

    }
}