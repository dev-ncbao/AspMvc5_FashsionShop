using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class DonDatCTModel
    {
        [StringLength(10)]
        public string MaDD { get; set; }

        public DateTime NgayDat { get; set; }

        public int TrangThai { get; set; }

        [StringLength(100)]
        public string HoTenKH { get; set; }

        public int TongSoLuong { get; set; }


    }
}