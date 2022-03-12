namespace Model.Library
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SPCTLoaiData")]
    public partial class SPCTLoaiData
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SPCTLoaiData()
        {
            SPPhanLoais = new HashSet<SPPhanLoai>();
        }

        [Required]
        [StringLength(10)]
        public string MaLoai { get; set; }

        [Required]
        [StringLength(100)]
        public string TenCTLoai { get; set; }

        [Key]
        [StringLength(10)]
        public string MaCTLoai { get; set; }

        public virtual SPLoaiData SPLoaiData { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SPPhanLoai> SPPhanLoais { get; set; }
    }
}
