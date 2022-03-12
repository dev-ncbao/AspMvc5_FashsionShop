using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Framework
{
    public class AdminSanPhamInformationModel
    {

        [Key]
        [StringLength(10)]
        public string MaSP { get; set; }

        [StringLength(5)]
        [Required]
        public string MaDoiTuong { get; set; }

        [StringLength(300)]
        public string TenSP { get; set; }

        [StringLength(2000)]
        public string MoTa { get; set; }

        [StringLength(10)]
        public string MaNCC { get; set; }

        [StringLength(200)]
        public string TenNCC { get; set; }

        [StringLength(10)]
        public string MaLoai { get; set; }

        [StringLength(10)]
        public string MaCTLoai { get; set; }
    }
}
