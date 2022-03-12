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
    public class AdminNhanVienController : Controller
    {
        private CHTTDbContext _context;

        public AdminNhanVienController() {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }
        // GET: Admin/AdminNhanVien
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadIndexData() {
            var data = _context.NhanViens.Join(_context.ChucVus,
                nv => nv.MaChucVu,
                cv => cv.MaChucVu,
                (nv,cv) => new {
                    nv.MaNV,
                    nv.HoTen,
                    nv.Phai,
                    nv.NgaySinh,
                    nv.Luong,
                    nv.SoDienThoai,
                    cv.TenChucVu,
                    nv.KichHoat
                }
                ).ToList();
            return Json(new { 
                data = data,
                status = true
            },JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult AOEModal(string MaNV) {
            ViewBag.ChucVu = _context.ChucVus.Select(x => new { x.MaChucVu, x.TenChucVu }).ToList();
            return View();
        }

        [HttpGet]
        public JsonResult GetNextEmployeeID() {
            string strCurID = _context.NhanViens.OrderByDescending(x => x.MaNV).Select(x => new { x.MaNV }).FirstOrDefault().MaNV;
            int intLength = 5;
            int intNextIDNumber = int.Parse(strCurID.Substring(2)) + 1;
            string strNextID = "NV" + intNextIDNumber;
            while (strNextID.Length < intLength) {
                strNextID = strNextID.Insert(2, "0");
            }
            return Json(new
            {
                strMaNV = strNextID,
                status = true
            },JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult AddOrEdit(NhanVien model, bool isAdd) {
            try
            {
                if (isAdd)
                {
                    if (_context.NhanViens.Where(x => x.HoTen == model.HoTen && x.SoDienThoai == model.SoDienThoai).Count() == 0)
                    {
                        model.MatKhau = Encryptor.ComputeSHA256Hash(model.MatKhau);
                        _context.NhanViens.Add(model);
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
                            message = "Nhân viên này đã tồn tại"
                        });
                    }
                }
                else
                {
                    var data = _context.NhanViens.Find(model.MaNV);
                    data.HoTen = model.HoTen;
                    data.NgaySinh = model.NgaySinh;
                    data.Phai = model.Phai;
                    data.Luong = model.Luong;
                    data.SoDienThoai = model.SoDienThoai;
                    data.QueQuan = model.QueQuan;
                    data.DiaChi = model.DiaChi;
                    data.MaChucVu = model.MaChucVu;
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
            catch (Exception) {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi ở phía Server"
                });
            }
        }

        [HttpGet]
        public JsonResult GetEditData(string strMaNV) {
            try {
                var data = _context.NhanViens.Find(strMaNV);
                if (data == null) {
                    return Json(new
                    {
                        status = false,
                        message = "Lỗi không tìm thấy dữ liệu"
                    },JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { 
                        status = true,
                        data = data
                    }
                    , JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception) {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi ở phía Server"
                });
            }
        }

        [HttpPost]
        public JsonResult Delete(string strMaNV) {
            try
            {
                var data = _context.NhanViens.Find(strMaNV);
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
                    _context.NhanViens.Remove(data);
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message ="Đã xóa"
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
    }
}