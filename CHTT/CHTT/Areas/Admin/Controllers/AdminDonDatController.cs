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
    public class AdminDonDatController : Controller
    {
        private CHTTDbContext _context;

        public AdminDonDatController()
        {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }
        // GET: Admin/AdminDonDat

        [HttpGet]
        public JsonResult GetMaHD(string strMaDD)
        {
            var data = _context.HoaDons.Where(x => x.MaDD == strMaDD).FirstOrDefault();
            return Json(new { data = data.MaHD,status=true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadIndexData()
        {
            var strSql = "  select dd.MaDD, HoTen as HoTenKH, NgayDat, Sum(SoLuong) as TongSoLuong,TrangThai from DonDat dd join DonDatCT ddct on dd.MaDD = ddct.MaDD join KhachHang kh on kh.MaKH = dd.MaKH group by dd.MaDD, HoTen, NgayDat,TrangThai ";
            var data = _context.Database.SqlQuery<DonDatCTModel>(strSql).ToList();
            return Json(new
            {
                data = data,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AOEModal()
        {
            return View();
        }

        public ActionResult Detail(string strMaDD) {
            if (strMaDD == null)
            {
                return HttpNotFound();
            }
            else {
                ViewBag.MaDD = strMaDD;
                var strMaKH = _context.DonDats.Find(strMaDD).MaKH;
                var data = _context.KhachHangs.Where(x => x.MaKH == strMaKH).FirstOrDefault();
                return View(data);
            }
        }

        [HttpGet]
        public JsonResult LoadTableData(string strMaDD)
        {
            var strSql = "  select ddct.MaSP, (select Link from vw_spanhdaidien where MaSP = ddct.MaSP) as Link,sp.TenSP, ddct.SoLuong, sps.Gia, sps.Size from DonDatCT ddct join SanPham sp on sp.MaSP = ddct.MaSP join SPSize sps on sps.Size = ddct.Size and ddct.MaSP = sps.MaSP where ddct.MaDD = '"+strMaDD+"'";
            var data = _context.Database.SqlQuery<DonDatChiTietModel>(strSql).ToList();
            return Json(new
            {
                data = data,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetSizeOfProduct(string strMaSP)
        {
            var data = _context.SPSizes.Where(x=>x.MaSP == strMaSP).Select(x=>x.Size).ToList();
            return Json(new
            {
                data = data,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult DetailAdditionalData(string strMaDD)
        {
            var data = _context.DonDats.Where(x=>x.MaDD == strMaDD).Select(x=>new { x.NgayDat,x.GhiChu,x.TrangThai}).FirstOrDefault();
            return Json(new
            {
                data = data,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateDetailInformation(DonDatCT model)
        {
            try
            {
                var data = _context.DonDatCTs.Where(x=>x.MaDD == model.MaDD && x.MaSP == model.MaSP && x.Size == model.Size).FirstOrDefault();
                if (data == null)
                {
                    _context.DonDatCTs.Add(model);
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã thêm Size mới. Vui lòng xóa Size cũ"
                    });
                }
                else {
                    if (data.SoLuong == model.SoLuong)
                    {
                        return Json(new
                        {
                            status = false,
                            message = "Đã có trong đơn đặt"
                        });
                    }
                    else {
                        _context.DonDatCTs.Remove(data);
                        _context.DonDatCTs.Add(model);
                        _context.SaveChanges();
                        return Json(new
                        {
                            status = true,
                            message = "Đã cập nhật"
                        });
                    }
                }
            }
            catch (Exception)
            {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi ở phía Server"
                });
            }
        }

        [HttpPost]
        public JsonResult DeleteProduct(DonDatCT model)
        {
            try
            {
                var data = _context.DonDatCTs.Where(x => x.MaDD == model.MaDD && x.MaSP == model.MaSP && x.Size == model.Size).FirstOrDefault();
                _context.DonDatCTs.Remove(data);
                _context.SaveChanges();
                return Json(new
                {
                    status = true,
                    message = "Đã cập nhật"
                });
            }
            catch (Exception)
            {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi ở phía Server"
                });
            }
        }

        [HttpPost]
        public JsonResult CancelOrder(string strMaDD)
        {
            try
            {
                var data = _context.DonDats.Find(strMaDD);
                data.TrangThai = 2;
                _context.SaveChanges();
                return Json(new
                {
                    status = true,
                    message = "Đã hủy bỏ đơn hàng"
                });
            }
            catch (Exception)
            {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi ở phía Server"
                });
            }
        }

        [HttpPost]
        public JsonResult ConfirmOrder(DonDat model, List<DonDatChiTietModel> listDetail)
        {
            try
            {
                bool blnCheck = false;
                foreach (var item in listDetail)
                {
                    var product = _context.SPSizes.Where(x=>x.Size == item.Size && x.MaSP == item.MaSP).FirstOrDefault();
                    if (product.SoLuong - item.SoLuong < 0) {
                        blnCheck = true;
                        break;
                    }
                }

                if (blnCheck) {
                    return Json(new
                    {
                        status = false,
                        message = "Số lượng hàng trong kho không đủ. Vui lòng kiểm tra lại"
                    });
                }
                else {
                    var objLastHoaDon = _context.HoaDons.OrderByDescending(x => x.MaHD).FirstOrDefault();
                    var strNextHDID = "";
                    if (objLastHoaDon == null)
                    {
                        strNextHDID = "HD00000001";
                    }
                    else
                    {
                        int intNextHDID = int.Parse(objLastHoaDon.MaHD.Substring(2)) + 1;
                        strNextHDID = "HD" + intNextHDID;
                        while (strNextHDID.Length < 10)
                        {
                            strNextHDID = strNextHDID.Insert(2, "0");
                        }
                    }

                    var strMaNV = "NV001";
                    if (Session["UserID"] != null)
                    {
                        strMaNV = Session["UserID"].ToString();
                    }
                    var dtNgayXuat = DateTime.Now;
                    var newHD = new HoaDon();
                    newHD.MaHD = strNextHDID;
                    newHD.MaKH = model.MaKH;
                    newHD.MaDD = model.MaDD;
                    newHD.MaNV = strMaNV;
                    newHD.NgayXuatHD = dtNgayXuat;
                    newHD.GhiChu = model.GhiChu;
                    _context.HoaDons.Add(newHD);
                    _context.SaveChanges();
                    var etDonDat = _context.DonDats.Find(model.MaDD);
                    etDonDat.TrangThai = 1;
                    foreach (var item in listDetail)
                    {
                        var newCTHD = new HoaDonCT();
                        var product = _context.SPSizes.Where(x=>x.MaSP == item.MaSP && x.Size == item.Size).FirstOrDefault();
                        _context.SPSizes.Remove(product);
                        var replaceProduct = new SPSize()
                        {
                            MaSP = product.MaSP,
                            Gia = product.Gia,
                            Size = product.Size,
                            SoLuong = product.SoLuong - item.SoLuong
                        };
                        _context.SPSizes.Add(replaceProduct);
                        _context.SaveChanges();
                        newCTHD.MaHD = strNextHDID;
                        newCTHD.MaSP = item.MaSP;
                        newCTHD.SoLuong = item.SoLuong;
                        newCTHD.Size = item.Size;
                        newCTHD.Gia = item.Gia;
                        _context.HoaDonCTs.Add(newCTHD);
                    }
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã xử lý đơn hàng này"
                    });
                }
            }
            catch (Exception)
            {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi ở phía Server"
                });
            }


        }
    }

    
}