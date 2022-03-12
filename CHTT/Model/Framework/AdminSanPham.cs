using Model.Library;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Framework
{
    public class AdminSanPham
    {
        CHTTDbContext context = null;

        public AdminSanPham() {
            context = new CHTTDbContext();
        }

        public AdminSanPhamInformationModel getInformation(string id)
        {
            string strSql = "select sp.MaSP, sp.MaDoiTuong, TenNCC, TenSP, MoTa, sppl.MaLoai, spctl.MaCTLoai " +
                "from SanPham sp left join SPPhanLoai sppl on sppl.MaSP = sp.MaSP left join SPCTLoaiData spctl on spctl.MaCTLoai" +
                " = sppl.MaCTLoai left join SPLoaiData spl on spl.MaLoai = sppl.MaLoai left join SPDoiTuongData spdt on spdt.MaDoiTuong = sp.MaDoiTuong join NhaCC ncc on ncc.MaNCC = sp.MaNCC";
            var data = context.Database.SqlQuery<AdminSanPhamInformationModel>(strSql).Where(x => x.MaSP == id).FirstOrDefault();
            return data;
        }
    }
}
