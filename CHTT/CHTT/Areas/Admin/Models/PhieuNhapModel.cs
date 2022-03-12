using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class PhieuNhapModel
    {
        [Key]
        [StringLength(10)]
        public string MaPN { get; set; }

        [StringLength(200)]
        public string TenNCC { get; set; }

        public DateTime NgayNhap { get; set; }

        public int SLTH { get; set; }

        public int? SLCT { get; set; }

        public int? TongGia { get; set; }

        [StringLength(10)]
        public string MaNCC { get; set; }

    }
}