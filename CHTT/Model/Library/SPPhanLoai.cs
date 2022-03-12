namespace Model.Library
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SPPhanLoai")]
    public partial class SPPhanLoai
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(10)]
        public string MaSP { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(10)]
        public string MaLoai { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(10)]
        public string MaCTLoai { get; set; }

        public virtual SanPham SanPham { get; set; }

        public virtual SPCTLoaiData SPCTLoaiData { get; set; }

        public virtual SPLoaiData SPLoaiData { get; set; }
    }
}
