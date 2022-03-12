namespace Model.Library
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SPHinhAnh")]
    public partial class SPHinhAnh
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(10)]
        public string MaSP { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string Link { get; set; }

        public virtual SanPham SanPham { get; set; }
    }
}
