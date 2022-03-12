using System.Web.Mvc;

namespace CHTT.Areas.Admin
{
    public class AdminAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Admin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                name: "Admin_Login",
                url: "quan-ly/dang-nhap/",
                defaults: new {controller = "AdminLogin", action = "Login", id = UrlParameter.Optional }
            );

            context.MapRoute(
                name: "Admin_ThongKe",
                url: "quan-ly/thong-ke/",
                defaults: new { controller = "AdminThongKe", action = "Index", id = UrlParameter.Optional }
            );

            context.MapRoute(
                name: "Admin_Logout",
                url: "quan-ly/dang-xuat/",
                defaults: new { controller = "AdminLogin", action = "Logout", id = UrlParameter.Optional }
            );
            //
            context.MapRoute(
                name: "Admin_Home",
                url: "quan-ly/trang-chu/{action}",
                defaults: new { controller = "AdminHome", action = "Index"/*, id = UrlParameter.Optional*/ }
            );
            //
            context.MapRoute(
                name: "Admin_SanPham_AddOrEdit",
                url: "quan-ly/san-pham/chi-tiet/{id}",
                defaults: new { controller = "AdminSanPham", action = "AddOrEdit", id = UrlParameter.Optional }
            );

            context.MapRoute(
                name: "Admin_SanPham",
                url: "quan-ly/san-pham/{action}/{id}",
                defaults: new { controller = "AdminSanPham", action = "Index", id = UrlParameter.Optional }
            );
            //
            context.MapRoute(
                name: "Admin_KhachHang",
                url: "quan-ly/khach-hang/{action}/{id}",
                defaults: new { controller = "AdminKhachHang", action = "Index", id = UrlParameter.Optional }
            );
            //
            context.MapRoute(
                name: "Admin_DonDat_Detail",
                url: "quan-ly/don-dat/chi-tiet/{id}",
                defaults: new { controller = "AdminDonDat", action = "Detail", id = UrlParameter.Optional }
            );

            context.MapRoute(
                name: "Admin_DonDat",
                url: "quan-ly/don-dat/{action}/{id}",
                defaults: new { controller = "AdminDonDat", action = "Index", id = UrlParameter.Optional }
            );
            //
            context.MapRoute(
                name: "Admin_HoaDon_Detail",
                url: "quan-ly/hoa-don/chi-tiet/{id}",
                defaults: new { controller = "AdminHoaDon", action = "Detail", id = UrlParameter.Optional }
            );

            context.MapRoute(
                name: "Admin_HoaDon",
                url: "quan-ly/hoa-don/{action}/{id}",
                defaults: new { controller = "AdminHoaDon", action = "Index", id = UrlParameter.Optional }
            );
            //
            context.MapRoute(
                name: "Admin_PhieuNhap_Detail",
                url: "quan-ly/phieu-nhap/chi-tiet/{id}",
                defaults: new { controller = "AdminPhieuNhap", action = "Detail", id = UrlParameter.Optional }
            );

            context.MapRoute(
                name: "Admin_PhieuNhap",
                url: "quan-ly/phieu-nhap/{action}/{id}",
                defaults: new { controller = "AdminPhieuNhap", action = "Index", id = UrlParameter.Optional }
            );
            //
            context.MapRoute(
                name: "Admin_NCC",
                url: "quan-ly/ncc/{action}/{id}",
                defaults: new { controller = "AdminNhaCungCap", action = "Index", id = UrlParameter.Optional }
            );
            //
            context.MapRoute(
                name: "Admin_NhanVien",
                url: "quan-ly/nhan-vien/{action}/{id}",
                defaults: new { controller = "AdminNhanVien", action = "Index", id = UrlParameter.Optional }
            );
            //
            context.MapRoute(
                "Admin_Default",
                "quan-ly/{controller}/{action}/{id}",
                new { action = "Index", controller = "AdminHome", id = UrlParameter.Optional }
            );
        }
    }
}