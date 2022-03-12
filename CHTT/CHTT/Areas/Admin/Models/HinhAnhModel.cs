using Model.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class HinhAnhModel
    {
        public string MaSP { set; get; }
        public HttpPostedFileBase[] file { set; get; }
    }
}