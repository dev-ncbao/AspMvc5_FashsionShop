using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Framework
{
    public class SanPhamModel
    {
        [DisplayName("Mã sản phẩm")]
        [Key]
        [StringLength(10)]
        public string MaSP { set; get; }

        [StringLength(300)]
        [DisplayName("Tên sản phẩm")]
        public string TenSP { set; get; }

        [DisplayName("Loại")]
        [StringLength(50)]
        public string ChungLoai { get; set; }

        [DisplayName("Dành cho đối tượng")]
        public bool? GioiTinhSuDung { set; get; }

        [DisplayName("Ảnh mô tả")]
        [StringLength(200)]
        public string Link { get; set; }

        [DisplayName("Nhà cung cấp")]
        [StringLength(200)]
        public string TenNCC { set; get; }
    }
}
