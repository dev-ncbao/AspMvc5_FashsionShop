using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CHTT
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //
            routes.MapRoute(
                name: "Sale_off",
                url: "khuyen-mai",
                defaults: new { controller = "SaleOff", action = "Index" }
            );
            //
            /*routes.MapRoute(
                name: "Account_Login",
                url: "tai-khoan/{action}/{id}",
                defaults: new { controller = "AccountLogin", action = "Index", id = UrlParameter.Optional }
            );
            //
            routes.MapRoute(
                name: "Home",
                url: "trang-chu/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );*/
            //
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
