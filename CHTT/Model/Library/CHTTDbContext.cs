using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace Model.Library
{
    public partial class CHTTDbContext : DbContext
    {
        public CHTTDbContext()
            : base("name=CHTTDbContext")
        {
        }

        public virtual DbSet<ChucVu> ChucVus { get; set; }
        public virtual DbSet<DonDat> DonDats { get; set; }
        public virtual DbSet<HoaDon> HoaDons { get; set; }
        public virtual DbSet<KhachHang> KhachHangs { get; set; }
        public virtual DbSet<NhaCC> NhaCCs { get; set; }
        public virtual DbSet<NhanVien> NhanViens { get; set; }
        public virtual DbSet<PhieuNhap> PhieuNhaps { get; set; }
        public virtual DbSet<SanPham> SanPhams { get; set; }
        public virtual DbSet<SPCTLoaiData> SPCTLoaiDatas { get; set; }
        public virtual DbSet<SPDoiTuongData> SPDoiTuongDatas { get; set; }
        public virtual DbSet<SPLoaiData> SPLoaiDatas { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<DonDatCT> DonDatCTs { get; set; }
        public virtual DbSet<GioHang> GioHangs { get; set; }
        public virtual DbSet<HoaDonCT> HoaDonCTs { get; set; }
        public virtual DbSet<PhieuNhapCT> PhieuNhapCTs { get; set; }
        public virtual DbSet<SPHinhAnh> SPHinhAnhs { get; set; }
        public virtual DbSet<SPPhanLoai> SPPhanLoais { get; set; }
        public virtual DbSet<SPSize> SPSizes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChucVu>()
                .Property(e => e.MaChucVu)
                .IsUnicode(false);

            modelBuilder.Entity<ChucVu>()
                .HasMany(e => e.NhanViens)
                .WithRequired(e => e.ChucVu)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<DonDat>()
                .Property(e => e.MaDD)
                .IsUnicode(false);

            modelBuilder.Entity<DonDat>()
                .Property(e => e.MaKH)
                .IsUnicode(false);

            modelBuilder.Entity<DonDat>()
                .HasMany(e => e.HoaDons)
                .WithRequired(e => e.DonDat)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<DonDat>()
                .HasMany(e => e.DonDatCTs)
                .WithRequired(e => e.DonDat)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<HoaDon>()
                .Property(e => e.MaKH)
                .IsUnicode(false);

            modelBuilder.Entity<HoaDon>()
                .Property(e => e.MaHD)
                .IsUnicode(false);

            modelBuilder.Entity<HoaDon>()
                .Property(e => e.MaNV)
                .IsUnicode(false);

            modelBuilder.Entity<HoaDon>()
                .Property(e => e.MaDD)
                .IsUnicode(false);

            modelBuilder.Entity<HoaDon>()
                .HasMany(e => e.HoaDonCTs)
                .WithRequired(e => e.HoaDon)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<KhachHang>()
                .Property(e => e.MaKH)
                .IsUnicode(false);

            modelBuilder.Entity<KhachHang>()
                .Property(e => e.SoDienThoai)
                .IsUnicode(false);

            modelBuilder.Entity<KhachHang>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<KhachHang>()
                .Property(e => e.MatKhau)
                .IsUnicode(false);

            modelBuilder.Entity<KhachHang>()
                .Property(e => e.TaiKhoan)
                .IsUnicode(false);

            modelBuilder.Entity<KhachHang>()
                .HasMany(e => e.DonDats)
                .WithRequired(e => e.KhachHang)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<KhachHang>()
                .HasMany(e => e.HoaDons)
                .WithRequired(e => e.KhachHang)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<KhachHang>()
                .HasMany(e => e.GioHangs)
                .WithRequired(e => e.KhachHang)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<NhaCC>()
                .Property(e => e.MaNCC)
                .IsUnicode(false);

            modelBuilder.Entity<NhaCC>()
                .Property(e => e.SoDienThoai)
                .IsUnicode(false);

            modelBuilder.Entity<NhaCC>()
                .HasMany(e => e.PhieuNhaps)
                .WithRequired(e => e.NhaCC)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<NhaCC>()
                .HasMany(e => e.SanPhams)
                .WithRequired(e => e.NhaCC)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<NhanVien>()
                .Property(e => e.MaNV)
                .IsUnicode(false);

            modelBuilder.Entity<NhanVien>()
                .Property(e => e.SoDienThoai)
                .IsUnicode(false);

            modelBuilder.Entity<NhanVien>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<NhanVien>()
                .Property(e => e.MaChucVu)
                .IsUnicode(false);

            modelBuilder.Entity<NhanVien>()
                .Property(e => e.MatKhau)
                .IsUnicode(false);

            modelBuilder.Entity<NhanVien>()
                .HasMany(e => e.HoaDons)
                .WithRequired(e => e.NhanVien)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<PhieuNhap>()
                .Property(e => e.MaPN)
                .IsUnicode(false);

            modelBuilder.Entity<PhieuNhap>()
                .Property(e => e.MaNCC)
                .IsUnicode(false);

            modelBuilder.Entity<PhieuNhap>()
                .HasMany(e => e.PhieuNhapCTs)
                .WithRequired(e => e.PhieuNhap)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SanPham>()
                .Property(e => e.MaSP)
                .IsUnicode(false);

            modelBuilder.Entity<SanPham>()
                .Property(e => e.MaDoiTuong)
                .IsUnicode(false);

            modelBuilder.Entity<SanPham>()
                .Property(e => e.MaNCC)
                .IsUnicode(false);

            modelBuilder.Entity<SanPham>()
                .HasMany(e => e.DonDatCTs)
                .WithRequired(e => e.SanPham)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SanPham>()
                .HasMany(e => e.HoaDonCTs)
                .WithRequired(e => e.SanPham)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SanPham>()
                .HasMany(e => e.PhieuNhapCTs)
                .WithRequired(e => e.SanPham)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SanPham>()
                .HasMany(e => e.GioHangs)
                .WithRequired(e => e.SanPham)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SanPham>()
                .HasMany(e => e.SPHinhAnhs)
                .WithRequired(e => e.SanPham)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SanPham>()
                .HasMany(e => e.SPSizes)
                .WithRequired(e => e.SanPham)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SanPham>()
                .HasMany(e => e.SPPhanLoais)
                .WithRequired(e => e.SanPham)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SPCTLoaiData>()
                .Property(e => e.MaLoai)
                .IsUnicode(false);

            modelBuilder.Entity<SPCTLoaiData>()
                .Property(e => e.MaCTLoai)
                .IsUnicode(false);

            modelBuilder.Entity<SPCTLoaiData>()
                .HasMany(e => e.SPPhanLoais)
                .WithRequired(e => e.SPCTLoaiData)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SPDoiTuongData>()
                .Property(e => e.MaDoiTuong)
                .IsUnicode(false);

            modelBuilder.Entity<SPLoaiData>()
                .Property(e => e.MaLoai)
                .IsUnicode(false);

            modelBuilder.Entity<SPLoaiData>()
                .HasMany(e => e.SPCTLoaiDatas)
                .WithRequired(e => e.SPLoaiData)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<SPLoaiData>()
                .HasMany(e => e.SPPhanLoais)
                .WithRequired(e => e.SPLoaiData)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<DonDatCT>()
                .Property(e => e.MaDD)
                .IsUnicode(false);

            modelBuilder.Entity<DonDatCT>()
                .Property(e => e.MaSP)
                .IsUnicode(false);

            modelBuilder.Entity<DonDatCT>()
                .Property(e => e.Size)
                .IsUnicode(false);

            modelBuilder.Entity<GioHang>()
                .Property(e => e.MaKH)
                .IsUnicode(false);

            modelBuilder.Entity<GioHang>()
                .Property(e => e.MaSP)
                .IsUnicode(false);

            modelBuilder.Entity<GioHang>()
                .Property(e => e.Size)
                .IsUnicode(false);

            modelBuilder.Entity<HoaDonCT>()
                .Property(e => e.MaHD)
                .IsUnicode(false);

            modelBuilder.Entity<HoaDonCT>()
                .Property(e => e.MaSP)
                .IsUnicode(false);

            modelBuilder.Entity<HoaDonCT>()
                .Property(e => e.Size)
                .IsUnicode(false);

            modelBuilder.Entity<PhieuNhapCT>()
                .Property(e => e.MaPN)
                .IsUnicode(false);

            modelBuilder.Entity<PhieuNhapCT>()
                .Property(e => e.MaSP)
                .IsUnicode(false);

            modelBuilder.Entity<SPHinhAnh>()
                .Property(e => e.MaSP)
                .IsUnicode(false);

            modelBuilder.Entity<SPHinhAnh>()
                .Property(e => e.Link)
                .IsUnicode(false);

            modelBuilder.Entity<SPPhanLoai>()
                .Property(e => e.MaSP)
                .IsUnicode(false);

            modelBuilder.Entity<SPPhanLoai>()
                .Property(e => e.MaLoai)
                .IsUnicode(false);

            modelBuilder.Entity<SPPhanLoai>()
                .Property(e => e.MaCTLoai)
                .IsUnicode(false);

            modelBuilder.Entity<SPSize>()
                .Property(e => e.MaSP)
                .IsUnicode(false);

            modelBuilder.Entity<SPSize>()
                .Property(e => e.Size)
                .IsUnicode(false);
        }
    }
}
