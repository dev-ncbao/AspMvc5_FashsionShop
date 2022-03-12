using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class ReportProductModel
    {
        public string MaSP { set; get; }
        public string TenSP { set; get; }
        public string Size { set; get; }
        public int Gia { set; get; }
        public int SoLuong { set; get; }
    }
}