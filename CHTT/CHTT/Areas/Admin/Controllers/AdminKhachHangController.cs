using CHTT.AdditionalFeature;
using Model;
using Model.Framework;
using Model.Library;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHTT.Areas.Admin.Controllers
{
    [Authorize]
    public class AdminKhachHangController : Controller
    {
        private CHTTDbContext _context;

        public AdminKhachHangController()
        {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }
        // GET: Admin/AdminKhachHang
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadIndexData() {
            var data = _context.KhachHangs.Select(x => new { x.MaKH, x.HoTen, x.Phai, x.NgaySinh, x.DiaChi, x.SoDienThoai,x.KichHoat }).ToList();
            return Json(new
            {
                data = data,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AOEModal() {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public JsonResult GetNextCustomerID()
        {
            string strCurID = _context.KhachHangs.OrderByDescending(x => x.MaKH).Select(x => new { x.MaKH }).FirstOrDefault().MaKH;
            int intLength = 8;
            int intNextIDNumber = int.Parse(strCurID.Substring(2)) + 1;
            string strNextID = "KH" + intNextIDNumber;
            while (strNextID.Length < intLength)
            {
                strNextID = strNextID.Insert(2, "0");
            }
            return Json(new
            {
                strMaKH = strNextID,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetEditData(string strMaKH)
        {
            try
            {
                var data = _context.KhachHangs.Find(strMaKH);
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
                    return Json(new
                    {
                        status = true,
                        data = data
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

        [HttpPost]
        [AllowAnonymous]
        public JsonResult AddOrEdit(KhachHang model, bool isAdd)
        {
            try
            {
                if (isAdd)
                {
                    if (_context.KhachHangs.Where(x => x.TaiKhoan == model.TaiKhoan).Count() == 0)
                    {
                        model.MatKhau = Encryptor.ComputeSHA256Hash(model.MatKhau);
                        _context.KhachHangs.Add(model);
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
                            message = "Tài khoản này đã tồn tại"
                        });
                    }
                }
                else
                {
                    var data = _context.KhachHangs.Find(model.MaKH);
                    data.HoTen = model.HoTen;
                    data.NgaySinh = model.NgaySinh;
                    data.Phai = model.Phai;
                    data.SoDienThoai = model.SoDienThoai;
                    data.DiaChi = model.DiaChi;
                    data.Email = model.Email;
                    if (data.MatKhau != model.MatKhau)
                    {
                        data.MatKhau = Encryptor.ComputeSHA256Hash(model.MatKhau);
                    }
                    data.KichHoat = model.KichHoat;
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
        public JsonResult Delete(string strMaKH)
        {
            try
            {
                var data = _context.KhachHangs.Find(strMaKH);
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
                    _context.KhachHangs.Remove(data);
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã xóa"
                    }
                    , JsonRequestBehavior.AllowGet);
                }
            }
            catch (DbUpdateException) {
                return Json(new
                {
                    status = false,
                    message = "Không thể xóa khách hàng này do ràng buộc dữ liệu"
                });
            }
            catch (Exception e)
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