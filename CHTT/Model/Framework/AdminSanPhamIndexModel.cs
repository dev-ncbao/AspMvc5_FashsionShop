using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Framework
{
    public class AdminSanPhamIndexModel
    {
        [Key]
        [StringLength(10)]
        public string MaSP { get; set; }

        [Required]
        [StringLength(300)]
        public string TenSP { get; set; }

        [StringLength(50)]
        [Required]
        public string TenDoiTuong { get; set; }

        [StringLength(200)]
        public string TenNCC { get; set; }

        [StringLength(200)]
        public string Link { get; set; }

        public int? SoLuong { get; set; }
    }
}
