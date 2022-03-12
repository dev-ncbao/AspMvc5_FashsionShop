namespace Model.Library
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SPSize")]
    public partial class SPSize
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(10)]
        public string MaSP { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SoLuong { get; set; }

        [Key]
        [Column(Order = 2)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Gia { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(5)]
        public string Size { get; set; }

        public virtual SanPham SanPham { get; set; }
    }
}
