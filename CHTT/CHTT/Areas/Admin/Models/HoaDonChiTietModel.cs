using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class HoaDonChiTietModel
    {
        [StringLength(10)]
        public string MaDD { get; set; }

        [Key]
        [StringLength(10)]
        public string MaHD { get; set; }

        public DateTime NgayXuatHD { get; set; }

        [StringLength(300)]
        public string GhiChu { get; set; }

        [Required]
        [StringLength(10)]
        public string MaNV { get; set; }

        [StringLength(10)]
        public string MaKH { get; set; }

        [Required]
        [StringLength(100)]
        public string HoTenKH { get; set; }

        public DateTime NgaySinh { get; set; }

        [Required]
        [StringLength(300)]
        public string DiaChi { get; set; }

        [StringLength(20)]
        public string SoDienThoai { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(10)]
        public string Phai { get; set; }

        public int TongGiaTri { get; set; }
    }
}