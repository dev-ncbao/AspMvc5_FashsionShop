using Model;
using Model.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CHTT.Areas.Admin.Controllers
{
    [Authorize]
    public class AdminNhaCungCapController : Controller
    {
        private CHTTDbContext _context;

        public AdminNhaCungCapController() {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadIndexData() {
            var model = _context.NhaCCs.ToList();
            return Json(new
            {
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult AOEModal() {
            return View(new NhaCC());
        }

        [HttpGet]
        public JsonResult AddOrEdit(string strID, int par = 0) {
            string message = "";
            bool success = false;
            try
            {
                var model = _context.NhaCCs.Find(strID);
                message = "get data success";
                return Json(new
                {
                    data = model,
                    status = success,
                    message = message
                },JsonRequestBehavior.AllowGet);
            }
            catch (Exception e) {
                message = "getting is not successfully";
                return Json(new
                {

                    status = success,
                    message = message
                },JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AddOrEdit(string strData)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var model = serializer.Deserialize<NhaCC>(strData);
            bool success = false;
            string message = "";
            if (string.IsNullOrEmpty(model.MaNCC))
            {
                try
                {
                    NhaCC prevModel = _context.NhaCCs.OrderByDescending(x => x.MaNCC).FirstOrDefault();
                    int nextModelIDNum = int.Parse(prevModel.MaNCC.Substring(3));
                    nextModelIDNum += 1;
                    string nextModelID = "NCC" + nextModelIDNum;
                    if (nextModelID.Length != 5)
                    {
                        nextModelID = nextModelID.Insert(3, "0");
                    }
                    model.MaNCC = nextModelID;
                    _context.NhaCCs.Add(model);
                    _context.SaveChanges();
                    success = true;
                    message = "Thêm NCC \"" + model.TenNCC + "\" thành công";
                }
                catch (Exception e) {
                    success = false;
                    message = "Thêm NCC \"" + model.TenNCC + "\" thất bại";
                }
            }
            else {
                var editModel = _context.NhaCCs.Find(model.MaNCC);
                try
                {
                    editModel.TenNCC = model.TenNCC;
                    editModel.DiaChi = model.DiaChi;
                    editModel.SoDienThoai = model.SoDienThoai;
                    _context.SaveChanges();
                    success = true;
                    message = "Chỉnh sửa NCC \"" + editModel.TenNCC + "\" thành công";
                }
                catch (Exception e) {
                    success = false;
                    message = "Chỉnh sửa NCC \"" + editModel.TenNCC + "\" thất bại";
                }
            }
            return Json(new
            {
                status = success,
                message = message
            });
        }

        [HttpPost]
        public JsonResult Delete(string strID)
        {
            bool status = false;
            string message = "";
            var model = _context.NhaCCs.Find(strID);
            try
            {
                _context.NhaCCs.Remove(model);
                _context.SaveChanges();
                status = true;
                message = "Đã xóa nhà cung cấp \"" + model.TenNCC + "\"";
            }
            catch (Exception e) {
                message = "Lỗi! Chưa thể xóa nhà cung cấp \"" + model.TenNCC + "\"";
            }
            return Json(new
            {
                status = status,
                message = message
            });
        }
    }
}