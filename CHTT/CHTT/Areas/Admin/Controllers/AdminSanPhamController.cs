using CHTT.Areas.Admin.Models;
using Model;
using Model.Framework;
using Model.Library;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHTT.Areas.Admin.Controllers
{
    [Authorize]
    public class AdminSanPhamController : Controller
    {
        private CHTTDbContext _context;

        public AdminSanPhamController() {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }
        // GET: Admin/AdminSanPham
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadIndexData() {
            /*try
            {
                string strQuery = "select distinct sp.MaSP, TenNCC,TenSP, Link, (select sum(SoLuong) from SPSize where MaSP = sp.MaSP) as SoLuong from SanPham sp left join (select top(1) * from SPHinhAnh order by Link asc) spha on spha.MaSP = sp.MaSP join NhaCC ncc on ncc.MaNCC = sp.MaNCC left join SPSize spz on spz.MaSP = sp.MaSP join SPDoiTuongData spdt on spdt.MaDoiTuong = sp.MaDoiTuong";
                var model = _context.Database.SqlQuery<AdminSanPhamIndexModel>(strQuery).ToList();
                return Json(new
                {
                    data = model,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            } catch (Exception) {
                return Json(new { 
                    status = false,
                    message="Đã xảy ra lỗi khi tải danh sách sản phẩm"
                }, JsonRequestBehavior.AllowGet);
            }*/
            string strQuery = "select distinct sp.MaSP, TenNCC,TenSP, Link, (select sum(SoLuong) from SPSize where MaSP = sp.MaSP) as SoLuong, TenDoiTuong "+
                "from SanPham sp left join (select * from vw_spanhdaidien) spha on spha.MaSP = sp.MaSP join NhaCC ncc on ncc.MaNCC = sp.MaNCC" +
                " left join SPSize spz on spz.MaSP = sp.MaSP left join SPDoiTuongData spdt on spdt.MaDoiTuong = sp.MaDoiTuong";
            var model = _context.Database.SqlQuery<AdminSanPhamIndexModel>(strQuery).ToList();
            return Json(new
            {
                data = model,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult AddOrEdit(string strID) {
            if (strID == null)
            {
                string lastMaSP;
                if (_context.SanPhams.Count() > 0)
                {
                    lastMaSP = _context.SanPhams.OrderByDescending(x => x.MaSP).FirstOrDefault().MaSP;
                }
                else
                {
                    lastMaSP = "0";
                }
                int nextID = int.Parse(lastMaSP.Substring(2)) + 1;
                string nextMaSP = "SP" + nextID;
                while (nextMaSP.Length < 8)
                {
                    nextMaSP = nextMaSP.Insert(2, "0");
                }
                ViewBag.addState = true;
                ViewBag.MSSP = nextMaSP;
                return View();
            }
            else
            {
                ViewBag.addState = false;
                ViewBag.MSSP = strID;
                return View();
            }
        }

        [HttpGet]
        public ActionResult Information(string strID) {
            ViewBag.DoiTuong = _context.SPDoiTuongDatas.ToList();
            ViewBag.Loai = _context.SPLoaiDatas.ToList();
            ViewBag.CTLoai = _context.SPCTLoaiDatas.ToList();
            /*ViewBag.TenNCC = _context.NhaCCs.Select(x => new { x.MaNCC, x.TenNCC }).ToList();*/
            if (_context.SanPhams.Count(x => x.MaSP == strID) > 0)
            {
                return View(new AdminSanPham().getInformation(strID));
            }
            else
            {
                return View();
            }
        }

        [HttpPost]
        public JsonResult AddOrEditInformation(AdminSanPhamInformationModel model) {
            try {
                if (_context.SanPhams.Count(x => x.MaSP == model.MaSP) == 0)
                {
                    var spPhanLoai = new SPPhanLoai();
                    spPhanLoai.MaSP = model.MaSP;
                    spPhanLoai.MaLoai = model.MaLoai;
                    spPhanLoai.MaCTLoai = model.MaCTLoai;
                    var sp = new SanPham();
                    sp.MaSP = model.MaSP;
                    sp.MaNCC = model.MaNCC;
                    sp.TenSP = model.TenSP;
                    sp.MaDoiTuong = model.MaDoiTuong;
                    sp.MoTa = model.MoTa;
                    _context.SanPhams.Add(sp);
                    _context.SPPhanLoais.Add(spPhanLoai);
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã lưu thông tin sản phẩm mới"
                    });
                }
                else
                {
                    var spPhanLoai = _context.SPPhanLoais.Where(x => x.MaSP == model.MaSP).SingleOrDefault();
                    var sp = _context.SanPhams.Find(model.MaSP);
                    if (spPhanLoai != null)
                    {
                        _context.SPPhanLoais.Remove(spPhanLoai);
                    }
                    spPhanLoai = new SPPhanLoai();
                    spPhanLoai.MaSP = model.MaSP;
                    spPhanLoai.MaLoai = model.MaLoai;
                    spPhanLoai.MaCTLoai = model.MaCTLoai;
                    _context.SPPhanLoais.Add(spPhanLoai);
                    sp.TenSP = model.TenSP;
                    sp.MaDoiTuong = model.MaDoiTuong;
                    sp.MoTa = model.MoTa;
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã lưu cập nhật"
                    });
                }
            }
            catch (Exception)
            {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi khi lưu"
                });
            }
        }

        [HttpGet]
        public JsonResult Size(string strID) {
            try
            {
                var model = _context.SPSizes.Where(x => x.MaSP == strID).ToList();
                return Json(new
                {
                    data = model,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception) {
                return Json(new
                {
                    status = true,
                    message="Đã xảy ra lỗi khi tải danh sách size"
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult ModalSize() {
            return View(new SPSize());
        }

        [HttpPost]
        public JsonResult AddOrEditSize(SPSize model, bool state) {
            string message = "";
            bool status = false;
            try
            {
                var data = _context.SPSizes.Where(x => x.MaSP == model.MaSP && x.Size == model.Size).SingleOrDefault();
                if (data != null && state == true)
                {
                    status = false;
                    message = "Size đã tồn tại";
                }
                else if (data != null && state == false)
                {
                    _context.SPSizes.Remove(data);
                    _context.SPSizes.Add(model);
                    _context.SaveChanges();
                    status = true;
                    message = "Đã lưu cập nhật";
                }
                else
                {
                    _context.SPSizes.Add(model);
                    _context.SaveChanges();
                    status = true;
                    message = "Đã lưu size mới";
                }
                return Json(new
                {
                    status = status,
                    message = message

                });
            }
            catch (Exception) {
                return Json(new
                {
                    status = status,
                    message = "Đã xảy ra lỗi khi lưu"

                });
            }
        }

        [HttpPost]
        public ActionResult DeleteSizeRecord(string strMaSP, string strSize) {
            string message = "";
            bool status = false;
            try
            {
                var model = _context.SPSizes.Where(x => x.MaSP == strMaSP && x.Size == strSize).FirstOrDefault();
                _context.SPSizes.Remove(model);
                _context.SaveChanges();
                status = true;
                message = "Đã xóa";
                return Json(new
                {
                    status = status,
                    message = message
                });
            }
            catch (Exception) {
                return Json(new
                {
                    status= status,
                    message = "Đã xảy ra lỗi khi xóa"
                });
            }
        }

        [HttpGet]
        public JsonResult GetSizeEditData(string strMaSP, string strSize) {
            bool status = false;
            try
            {
                var model = _context.SPSizes.Where(x => x.MaSP == strMaSP && x.Size == strSize).FirstOrDefault();
                status = true;
                return Json(new
                {
                    status = status,
                    data = model
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception) {
                return Json(new
                {
                    status = status,
                    message="Đã xảy ra lỗi tải dữ liệu"
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult Images(string strID)
        {
            try
            {
                var model = _context.SPHinhAnhs.Where(x => x.MaSP == strID).OrderBy(x => x.Link).ToList();
                return Json(new
                {
                    data = model,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new
                {
                    status = false,
                    message="Đã xảy ra lỗi khi tải danh sách hình ảnh"
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult getChangeDetailCategory(string idLoai) {
            var model = _context.SPCTLoaiDatas.Where(x => x.MaLoai == idLoai).ToList();
            return Json(new { 
                data = model,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeletePicture(string Link) {
            try
            {
                var serverLink = Path.Combine(Server.MapPath(Link));
                if (System.IO.File.Exists(serverLink))
                {
                    System.IO.File.Delete(serverLink);
                    var sqlData = _context.SPHinhAnhs.Where(x => x.Link == Link).FirstOrDefault();
                    _context.SPHinhAnhs.Remove(sqlData);
                    _context.SaveChanges();
                }
                return Json(new
                {
                    status = true,
                    message = "Đã xóa"
                });
            } catch (Exception)
            {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi khi xóa"
                });
            }
        }

        [HttpPost]
        public JsonResult AddPicture(HinhAnhModel model) {
            try
            {
                if (model.MaSP != null && model.file != null)
                {
                    var strImageName = model.MaSP.ToLower() + "_";
                    var lastIDImage = _context.SPHinhAnhs.Where(x => x.MaSP == model.MaSP).OrderByDescending(x => x.Link).FirstOrDefault();
                    var nextIDIndex = 1;
                    if (lastIDImage != null)
                    {
                        nextIDIndex = int.Parse(lastIDImage.Link.Substring(lastIDImage.Link.LastIndexOf(".") - 1, 1)) + 1;
                    }
                    var serverFolderPath = Path.Combine(Server.MapPath("/assets/client/img/"));
                    foreach (var file in model.file)
                    {
                        var imagePath = serverFolderPath + strImageName + nextIDIndex + file.FileName.Substring(file.FileName.LastIndexOf("."));
                        if (!System.IO.File.Exists(imagePath))
                        {
                            file.SaveAs(imagePath);
                            _context.SPHinhAnhs.Add(new SPHinhAnh()
                            {
                                MaSP = model.MaSP,
                                Link = "/assets/client/img/" + strImageName + nextIDIndex + file.FileName.Substring(file.FileName.LastIndexOf("."))
                            });

                        }
                        nextIDIndex++;
                    }
                    _context.SaveChanges();
                    return Json(new
                    {
                        status = true,
                        message = "Đã lưu hình ảnh mới"
                    });
                }
                else {
                    return Json(new
                    {
                        status = false,
                        message = "Lỗi không có hình ảnh nào được chọn"
                    });
                }
            }
            catch (Exception) {
                return Json(new
                {
                    status = false,
                    message = "Đã xảy ra lỗi khi lưu hình ảnh mới"
                });
            }
        }
    }
}