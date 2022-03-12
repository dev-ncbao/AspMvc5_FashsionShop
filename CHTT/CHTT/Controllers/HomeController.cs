using CHTT.Models;
using Model;
using Model.Library;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;

namespace CHTT.Controllers
{
    public class HomeController : Controller
    {
        private CHTTDbContext _context;

        public HomeController()
        {
            _context = new CHTTDbContext();
            _context.Configuration.ProxyCreationEnabled = false;
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadProductDropdown()
        {
            var data = _context.SPLoaiDatas.OrderBy(x=>x.TenLoai).ToList();
            return Json(new
            {
                status = true,
                data = data
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LoadNewProductList(int skip)
        {
            var strSql = "select MaSP, TenSP, (select min(Gia) from SPSize where MaSP = sp.MaSP) as GiaBan, (select sum(SoLuong) from HoaDonCT where MaSP = sp.MaSP) as DaBan, (select Link from vw_spanhdaidien where MaSP = sp.MaSP) as LinkAnh from SanPham sp order by MaSP desc";
            var data = new List<HomeProductModel>();
            var total = _context.SanPhams.Count();
            if (total > 15)
            {
                data = _context.Database.SqlQuery<HomeProductModel>(strSql).Skip(skip).Take(15).ToList();
            }
            else
            {
                data = _context.Database.SqlQuery<HomeProductModel>(strSql).ToList();
            }
            skip += data.Count();
            return Json(new
            {
                total = total,
                skip = skip,
                data = data,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LoadHotProductList(int skip)
        {
            var strSql = "select MaSP, TenSP, (select min(Gia) from SPSize where MaSP = sp.MaSP) as GiaBan, (select sum(SoLuong) from HoaDonCT where MaSP = sp.MaSP) as DaBan, (select Link from vw_spanhdaidien where MaSP = sp.MaSP) as LinkAnh from SanPham sp order by DaBan desc";
            var data = new List<HomeProductModel>();
            var total = _context.SanPhams.Count();
            if (total > 15)
            {
                data = _context.Database.SqlQuery<HomeProductModel>(strSql).Skip(skip).Take(15).ToList();
            }
            else
            {
                data = _context.Database.SqlQuery<HomeProductModel>(strSql).ToList();
            }
            skip += data.Count();
            return Json(new
            {
                data = data,
                total = total,
                skip = skip,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public ActionResult AddToCartModal()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ShoppingCartModal()
        {
            return View();
        }


        [HttpGet]
        public ActionResult ProductByCategory(string strMaLoai)
        {
            ViewBag.MaLoai = strMaLoai;
            ViewBag.TenLoai = _context.SPLoaiDatas.Where(x => x.MaLoai == strMaLoai).Select(x => x.TenLoai).FirstOrDefault();
            return View();
        }

        [HttpGet]
        public JsonResult LoadListProductByCategory(string strMaLoai, int skip)
        {
            string strSql = "select sp.MaSP, TenSP, (select min(Gia) from SPSize where MaSP = sp.MaSP) as GiaBan, (select sum(SoLuong) from HoaDonCT where MaSP = sp.MaSP) as DaBan, (select Link from vw_spanhdaidien where MaSP = sp.MaSP) as LinkAnh from SanPham sp join SPPhanLoai spl on sp.MaSP = spl.MaSP where spl.MaLoai = '" + strMaLoai + "' order by sp.MaSP desc";
            var data = _context.Database.SqlQuery<HomeProductModel>(strSql).ToList();
            var total = data.Count();
            if (_context.SanPhams.Count() > 15)
            {
                data = data.Skip(skip).Take(15).ToList();
            }
            else
            {
                data = _context.Database.SqlQuery<HomeProductModel>(strSql).ToList();
            }
            skip += data.Count();
            return Json(new
            {
                data = data,
                skip = skip,
                total = total,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult ProductBySearch(string strSearchString)
        {
            ViewBag.SearchString = strSearchString;
            return View();
        }

        [HttpGet]
        public JsonResult LoadListProductBySearch(string strSearchString, int skip)
        {
            var data = new List<HomeProductModel>();
            int total = 0;
            if (!string.IsNullOrEmpty(strSearchString))
            {
                string strSql = "select sp.MaSP, TenSP, (select min(Gia) from SPSize where MaSP = sp.MaSP) as GiaBan, (select sum(SoLuong) from HoaDonCT where MaSP = sp.MaSP) as DaBan, (select Link from vw_spanhdaidien where MaSP = sp.MaSP) as LinkAnh from SanPham sp where TenSP like N'%"+ strSearchString +"%' order by sp.MaSP desc";
                data = _context.Database.SqlQuery<HomeProductModel>(strSql).ToList();
                total = data.Count();
                if (total > 15)
                {
                    data = _context.Database.SqlQuery<HomeProductModel>(strSql).Skip(skip).Take(15).ToList();
                }
                skip += data.Count();
            }
            return Json(new
            {
                searchString = strSearchString,
                data = data,
                total = total,
                skip = skip,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetListSizeOfSelectProduct(string strMaSP)
        {
            var size = _context.SPSizes.Where(x => x.MaSP == strMaSP).Select(x=> new { x.Size,x.Gia}).ToList();
            var name = _context.SanPhams.Where(x => x.MaSP == strMaSP).Select(x => x.TenSP).FirstOrDefault();
            return Json(new
            {
                status = true,
                size = size,
                name=name
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddToCart(GioHang model)
        {
            var cusID = Session["CustomerID"].ToString();
            var data = _context.GioHangs.Where(x => x.MaKH == cusID && x.MaSP == model.MaSP && x.Size == model.Size).FirstOrDefault();
            if(data != null)
            {
                return Json(new
                {
                    status = false,
                    exists = true
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                model.MaKH = cusID;
                _context.GioHangs.Add(model);
                _context.SaveChanges();
                return Json(new
                {
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DeleteProductOnSPC(string strSize, string strMaSP)
        {
            var cusID = Session["CustomerID"].ToString();
            var data = _context.GioHangs.Where(x => x.MaSP == strMaSP && x.MaKH == cusID && x.Size == strSize).FirstOrDefault();
            _context.GioHangs.Remove(data);
            _context.SaveChanges();
            var strSql = "select gh.MaSP, sp.TenSP, gh.Size, sps.Gia as GiaBan, gh.SoLuong, (select Link from vw_spanhdaidien where MaSP = gh.MaSP) as LinkAnh from GioHang gh join SanPham sp on gh.MaSP=sp.MaSP join SPSize sps on gh.MaSP = sps.MaSP and gh.Size = sps.Size where MaKH = '" + cusID + "'";
            var data2 = _context.Database.SqlQuery<ShoppingCartModel>(strSql).ToList();
            int total = data2.Sum(x => x.Soluong * x.GiaBan);
            int totalamount = data2.Sum(x => x.Soluong);
            return Json(new
            {
                total = total,
                totalamount = totalamount,
                status = true
            },JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateItemAmountOnSPC(string strSize, string strMaSP, string strSoluong)
        {
            var cusID = Session["CustomerID"].ToString();
            var data = _context.GioHangs.Where(x => x.MaSP == strMaSP && x.MaKH == cusID && x.Size == strSize).FirstOrDefault();
            _context.GioHangs.Remove(data);
            data = new GioHang()
            {
                MaKH = cusID,
                MaSP = strMaSP,
                SoLuong = int.Parse(strSoluong),
                Size = strSize
            };
            _context.GioHangs.Add(data);
            _context.SaveChanges();
            var strSql = "select gh.MaSP, sp.TenSP, gh.Size, sps.Gia as GiaBan, gh.SoLuong, (select Link from vw_spanhdaidien where MaSP = gh.MaSP) as LinkAnh from GioHang gh join SanPham sp on gh.MaSP=sp.MaSP join SPSize sps on gh.MaSP = sps.MaSP and gh.Size = sps.Size where MaKH = '" + cusID + "'";
            var data2 = _context.Database.SqlQuery<ShoppingCartModel>(strSql).ToList();
            int total = data2.Sum(x => x.Soluong * x.GiaBan);
            int totalamount = data2.Sum(x => x.Soluong);
            return Json(new
            {
                total = total,
                totalamount = totalamount,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Order(string strGhiChu)
        {
            var cusID = Session["CustomerID"].ToString();
            var listItemSPC = _context.GioHangs.Where(x => x.MaKH == cusID).ToList();

            var strLastMaDD = _context.DonDats.OrderByDescending(x => x.MaDD).FirstOrDefault();
            var strNextMaDD = "DD";
            if(strLastMaDD == null)
            {
                strNextMaDD = "DD00000001";
            }
            else
            {
                int intNextMaDD = int.Parse(strLastMaDD.MaDD.Substring(2)) + 1;
                strNextMaDD = strNextMaDD + intNextMaDD;
                while(strNextMaDD.Length < 10)
                {
                    strNextMaDD = strNextMaDD.Insert(2, "0");
                }
            }
            var dateNgayDat = DateTime.Now;
            var intTrangThai = 0;
            DonDat ddNew = new DonDat()
            {
                MaDD = strNextMaDD,
                MaKH = cusID,
                NgayDat = dateNgayDat,
                GhiChu = strGhiChu,
                TrangThai = intTrangThai
            };

            _context.DonDats.Add(ddNew);
            _context.SaveChanges();

            foreach(var item in listItemSPC)
            {
                _context.DonDatCTs.Add(new DonDatCT()
                {
                    MaDD = strNextMaDD,
                    MaSP = item.MaSP,
                    Size = item.Size,
                    SoLuong = item.SoLuong
                });
            }
            _context.SaveChanges();
            _context.Database.ExecuteSqlCommand("delete GioHang where MaKH = @makh",new SqlParameter("makh",cusID));

            return Json(new
            {
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
    }
}