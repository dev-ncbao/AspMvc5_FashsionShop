using Model;
using Model.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHTT.Controllers
{
    public class ProductDetailController : Controller
    {
        private CHTTDbContext _context;
        public ProductDetailController() {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }

        [HttpGet]
        public ActionResult Index(string strMaSP)
        {
            ViewBag.MaSP = strMaSP;
            return View();
        }

        [HttpGet]
        public JsonResult LoadProductData(string strMaSP)
        {
            var information = _context.SanPhams.Where(x => x.MaSP == strMaSP).Select(x => new { x.TenSP, x.MoTa }).FirstOrDefault();
            var size = _context.SPSizes.Where(x => x.MaSP == strMaSP).Select(x => new { x.Size, x.Gia }).ToList();
            var picture = _context.SPHinhAnhs.Where(x => x.MaSP == strMaSP).Select(x => x.Link).ToList();
            return Json(new { 
                status = true,
                information = information,
                size = size,
                picture = picture
            },JsonRequestBehavior.AllowGet);
        }
    }
}