using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class HoaDonModel
    {
        [Key]
        [StringLength(10)]
        public string MaHD { get; set; }

        [StringLength(10)]
        public string MaDD { get; set; }

        public DateTime NgayXuatHD { get; set; }

        public int TongGiaTri { get; set; }

        [StringLength(100)]
        public string HoTenKH { get; set; }

        public int TongSoLuong { get; set; }
    }
}