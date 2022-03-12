namespace Model.Library
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("PhieuNhap")]
    public partial class PhieuNhap
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PhieuNhap()
        {
            PhieuNhapCTs = new HashSet<PhieuNhapCT>();
        }

        [Key]
        [StringLength(10)]
        public string MaPN { get; set; }

        [Required]
        [StringLength(10)]
        public string MaNCC { get; set; }

        public DateTime NgayNhap { get; set; }

        public virtual NhaCC NhaCC { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PhieuNhapCT> PhieuNhapCTs { get; set; }
    }
}
