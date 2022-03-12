namespace Model.Library
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SanPham")]
    public partial class SanPham
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SanPham()
        {
            DonDatCTs = new HashSet<DonDatCT>();
            HoaDonCTs = new HashSet<HoaDonCT>();
            PhieuNhapCTs = new HashSet<PhieuNhapCT>();
            GioHangs = new HashSet<GioHang>();
            SPHinhAnhs = new HashSet<SPHinhAnh>();
            SPSizes = new HashSet<SPSize>();
            SPPhanLoais = new HashSet<SPPhanLoai>();
        }

        [Key]
        [StringLength(10)]
        public string MaSP { get; set; }

        [StringLength(5)]
        public string MaDoiTuong { get; set; }

        [Required]
        [StringLength(10)]
        public string MaNCC { get; set; }

        [Required]
        [StringLength(300)]
        public string TenSP { get; set; }

        [StringLength(2000)]
        public string MoTa { get; set; }

        public virtual NhaCC NhaCC { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DonDatCT> DonDatCTs { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<HoaDonCT> HoaDonCTs { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PhieuNhapCT> PhieuNhapCTs { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<GioHang> GioHangs { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SPHinhAnh> SPHinhAnhs { get; set; }

        public virtual SPDoiTuongData SPDoiTuongData { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SPSize> SPSizes { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SPPhanLoai> SPPhanLoais { get; set; }
    }
}
