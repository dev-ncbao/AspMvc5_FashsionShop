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
    public class AdminPhieuNhapController : Controller
    {
        private CHTTDbContext _context;

        public AdminPhieuNhapController()
        {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }

        public ActionResult Index()
        {
            ViewBag.NCC = _context.NhaCCs.Select(x=>new { x.MaNCC,x.TenNCC}).ToList();
            return View();
        }

        [HttpGet]
        public ActionResult AOEModal() {
            return View();
        }

        [HttpGet]
        public ActionResult AddOldModal()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetOldProduct() {
            var data = _context.SanPhams.OrderBy(x => x.TenSP).Select(x => new { x.MaSP, x.TenSP }).ToList();
            return Json(new
            {
                data = data
            },JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult AOEDetailModal()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetNextProductID() {
            string strCurID = _context.SanPhams.OrderByDescending(x => x.MaSP).Select(x => new { x.MaSP }).FirstOrDefault().MaSP;
            int intLength = 8;
            int intNextIDNumber = int.Parse(strCurID.Substring(2)) + 1;
            string strNextID = "SP" + intNextIDNumber;
            while (strNextID.Length < intLength)
            {
                strNextID = strNextID.Insert(2, "0");
            }
            return Json(new
            {
                strMaSP = strNextID,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDetailEditData(string strMaPN,string strMaSP)
        {
            try
            {
                var data = _context.PhieuNhapCTs.Join(_context.SanPhams,pn=>pn.MaSP,sp=>sp.MaSP,
                    (pn,sp) => new { 
                        pn.MaSP,
                        pn.MaPN,
                        sp.TenSP,
                        pn.SoLuong,
                        pn.GiaNhap
                    }
                    ).Where(x=>x.MaPN == strMaPN && x.MaSP == strMaSP).FirstOrDefault();
                return Json(new
                {
                    data = data,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new
                {
                    message = "Đã xảy ra lỗi ở Server",
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetNextPNID()
        {
            
            try
            {
                string strCurID = _context.PhieuNhaps.OrderByDescending(x => x.MaPN).Select(x => new { x.MaPN }).FirstOrDefault().MaPN;
            int intLength = 8;
            int intNextIDNumber = int.Parse(strCurID.Substring(2)) + 1;
            string strNextID = "PN" + intNextIDNumber;
            while (strNextID.Length < intLength)
            {
                strNextID = strNextID.Insert(2, "0");
            }
            return Json(new
            {
                strMaPN = strNextID,
                status = true
            }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new
                {
                    message = "Đã xảy ra lỗi ở Server",
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ReloadInformation(string strMaPN) {
            try
            {
                var model = _context.PhieuNhapCTs.Where(x => x.MaPN == strMaPN).GroupBy(g => new { g.MaPN }).Select(
                x => new {
                    MaPN = x.Key.MaPN,
                    SLTH = x.Select(p => p.MaSP).Count(),
                    SLCT = x.Select(p => p.SoLuong).Sum(),
                    TongGia = x.Select(p => new { p.SoLuong, p.GiaNhap }).Sum(p => p.SoLuong * p.GiaNhap)
                }).FirstOrDefault();
            return Json(new {
                data = model,
                status = true
            },JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new
                {
                    message = "Đã xảy ra lỗi ở Server",
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult LoadIndexData() {
            try
            {
                string strSql = "select pn.MaPN, ncc.TenNCC, NgayNhap, count(MaSP) as SLTH,sum(SoLuong) as SLCT,sum(GiaNhap*SoLuong) as TongGia from PhieuNhap pn left join PhieuNhapCT pnct on pn.MaPN = pnct.MaPN join NhaCC ncc on ncc.MaNCC = pn.MaNCC" + 
                                " group by pn.MaPN, pn.MaNCC,pn.NgayNhap,ncc.TenNCC";
                var data = _context.Database.SqlQuery<PhieuNhapModel>(strSql).ToList();
                return Json(new
                {
                    data = data,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception) {
                return Json(new
                {
                    message="Đã xảy ra lỗi ở Server",
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult LoadDetailTableData(string strMaPN)
        {
            try
            {
                var data = _context.PhieuNhapCTs.Where(x=>x.MaPN == strMaPN).ToList();
                return Json(new
                {
                    data = data,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new
                {
                    message = "Đã xảy ra lỗi ở Server",
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AddOrEdit(PhieuNhap model, bool isAdd)
        {
            try
            {
                if (isAdd)
                {
                    if (_context.PhieuNhaps.Where(x => x.MaPN == model.MaPN).Count() == 0)
                    {
                        _context.PhieuNhaps.Add(model);
                        _context.SaveChanges();
                        return Json(new
                        {
                            status = true,
                            message = "Đã thêm"
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            status = false,
                            message = "Phiếu này đã tồn tại"
                        });
                    }
                }
                else
                {
                    var data = _context.PhieuNhaps.Find(model.MaPN);
                    data.MaNCC = model.MaNCC;
                    data.NgayNhap = model.NgayNhap;
                    _context.Entry(data).State = System.Data.Entity.EntityState.Modified;
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã cập nhật"
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

        [HttpPost]
        public JsonResult DeleteDetailRecord(string strMaPN, string strMaSP)
        {
            var data = _context.PhieuNhapCTs.Where(x => x.MaPN == strMaPN && x.MaSP == strMaSP).FirstOrDefault();
            /*var spData = _context.SanPhams.Find(strMaSP);*/
            if (data != null) {
                _context.PhieuNhapCTs.Remove(data);
                _context.SaveChanges();
            }
            return Json(new
            {
                status = true,
                message = "Đã xóa"
            });
        }

        [HttpPost]
        public JsonResult AddOrEditDetail(PhieuNhapCT model,string strTenSP,string strMaNCC, bool isAdd)
        {
            try
            {
                if (isAdd)
                {
                    if (string.IsNullOrEmpty(strMaNCC) && string.IsNullOrEmpty(strTenSP) && _context.PhieuNhapCTs.Where(x=>x.MaSP == model.MaSP && x.MaPN == model.MaPN).Count() == 0)
                    {
                        _context.PhieuNhapCTs.Add(model);
                        _context.SaveChanges();
                        return Json(new
                        {
                            status = true,
                            message = "Đã thêm chi tiết phiếu"
                        });
                    }
                    else if(!(string.IsNullOrEmpty(strMaNCC) && string.IsNullOrEmpty(strTenSP))) 
                    {
                        _context.PhieuNhapCTs.Add(model);
                        _context.SanPhams.Add(new SanPham()
                        {
                            MaSP = model.MaSP,
                            TenSP = strTenSP,
                            MaNCC = strMaNCC
                        });
                        _context.SaveChanges();
                        return Json(new
                        {
                            status = true,
                            message = "Đã thêm chi tiết phiếu và sản phẩm mới"
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            status = false,
                            message = "Chi tiết phiếu đã tồn tại"
                        });
                    }
                }
                else
                {
                    var data = _context.PhieuNhapCTs.Where(x=>x.MaPN == model.MaPN && x.MaSP == model.MaSP).FirstOrDefault();
                    _context.PhieuNhapCTs.Remove(data);
                    _context.PhieuNhapCTs.Add(model);
                    var spData = _context.SanPhams.Find(model.MaSP);
                    spData.TenSP = strTenSP;
                    _context.Entry(spData).State = System.Data.Entity.EntityState.Modified;
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã cập nhật"
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

        [HttpPost]
        public JsonResult Delete(string strMaPN)
        {
            try
            {
                var data = _context.PhieuNhaps.Find(strMaPN);
                if (data == null)
                {
                    return Json(new
                    {
                        status = false,
                        message = "Lỗi không tìm thấy dữ liệu"
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    _context.PhieuNhaps.Remove(data);
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã xóa"
                    }
                    , JsonRequestBehavior.AllowGet);
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

        [HttpGet]
        public ActionResult Detail(string strMaPN) {
            ViewBag.NCC = _context.NhaCCs.Select(x => new { x.MaNCC, x.TenNCC }).ToList();
            var data = _context.PhieuNhaps.Find(strMaPN);
            if (data == null) {
                return HttpNotFound();
            }
            else
            {
                string strSql = "select pn.MaPN, ncc.TenNCC,ncc.MaNCC, NgayNhap, count(MaSP) as SLTH,sum(SoLuong) as SLCT,sum(GiaNhap*SoLuong) as TongGia from PhieuNhap pn left join PhieuNhapCT pnct on pn.MaPN = pnct.MaPN join NhaCC ncc on ncc.MaNCC = pn.MaNCC" +
                                " where pn.MaPN = '"+strMaPN+ "' group by pn.MaPN,pn.NgayNhap,ncc.TenNCC,ncc.MaNCC";
                var model = _context.Database.SqlQuery<PhieuNhapModel>(strSql).FirstOrDefault();
                ViewBag.NgayNhapConvert = model.NgayNhap.ToString("yyyy-MM-ddThh:mm");
                return View(model);
            }
        }
    }
}

/*var data = _context.PhieuNhaps.Join(_context.PhieuNhapCTs,
                            pn => pn.MaPN, pnct => pnct.MaPN,
                            (pn, pnct) => new
                            {
                                pn.MaPN,
                                pn.MaNCC,
                                pn.NgayNhap,
                                pnct.MaSP,
                                pnct.SoLuong,
                                pnct.GiaNhap
                            }).GroupBy(x => new { x.MaPN, x.NgayNhap, x.MaNCC }
                            ).Select(
                                g => new
                                {
                                    MaPN = g.Key.MaPN,
                                    MaNCC = g.Key.MaNCC,
                                    NgayNhap = g.Key.NgayNhap,
                                    SLTH = g.Select(x => x.MaSP).Count(),
                                    SLCT = g.Select(x => x.SoLuong).Sum(),
                                    TongGia = g.Select(x => new { x.GiaNhap, x.SoLuong }).Sum(x => x.GiaNhap * x.SoLuong)
                                }
                            ).Join(_context.NhaCCs,
                            p => p.MaNCC, ncc => ncc.MaNCC,
                            (p, ncc) => new
                            {
                                p.MaPN,
                                ncc.TenNCC,
                                p.NgayNhap,
                                p.SLCT,
                                p.SLTH,
                                p.TongGia
                            }).ToList();*/