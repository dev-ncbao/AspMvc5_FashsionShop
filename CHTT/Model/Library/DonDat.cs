namespace Model.Library
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("DonDat")]
    public partial class DonDat
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public DonDat()
        {
            HoaDons = new HashSet<HoaDon>();
            DonDatCTs = new HashSet<DonDatCT>();
        }

        [Key]
        [StringLength(10)]
        public string MaDD { get; set; }

        [Required]
        [StringLength(10)]
        public string MaKH { get; set; }

        public DateTime NgayDat { get; set; }

        [StringLength(300)]
        public string GhiChu { get; set; }

        public int TrangThai { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<HoaDon> HoaDons { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DonDatCT> DonDatCTs { get; set; }

        public virtual KhachHang KhachHang { get; set; }
    }
}
