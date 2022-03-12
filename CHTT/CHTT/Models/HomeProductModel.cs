using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CHTT.Models
{
    public class HomeProductModel
    {
        public int? GiaBan { get; set; }

        public int? DaBan { get; set; }

        [StringLength(300)]
        public string TenSP { get; set; }

        [StringLength(10)]
        public string MaSP { get; set; }

        [StringLength(200)]
        public string LinkAnh { get; set; }
    }
}