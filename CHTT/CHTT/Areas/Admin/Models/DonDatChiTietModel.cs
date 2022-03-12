using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class DonDatChiTietModel
    {
        [Key]
        [StringLength(5)]
        public string Size { get; set; }

        public int Gia { get; set; }

        [StringLength(200)]
        public string Link { get; set; }

        [StringLength(300)]
        public string TenSP { get; set; }

        [StringLength(10)]
        [Key]
        public string MaSP { get; set; }

        public int SoLuong { get; set; }
    }
}