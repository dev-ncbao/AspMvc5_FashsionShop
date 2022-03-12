using Model.Library;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Framework
{
    public class AdminKhachHang
    {
        CHTTDbContext context = null;
        //
        public AdminKhachHang() {
            context = new CHTTDbContext();
        }
        //
        public List<KhachHang> danhSachKhachHang()
        {
            return context.KhachHangs.SqlQuery("select * from khachhang").ToList();

        }
        //
        public KhachHang layKhachHang(string id)
        {
            return context.KhachHangs.Find(id);
        }
        //
        public bool themKhachHang(KhachHang model)
        {
            try {
                if (context.KhachHangs.Count(x => x.TaiKhoan == model.TaiKhoan) > 0)
                {
                    return false;
                }
                else {
                    int total = context.KhachHangs.Count();
                    do
                    {
                        total++;
                        model.MaKH = "KH" + total;
                        while (model.MaKH.Length != 8)
                        {
                            model.MaKH = model.MaKH.Insert(2, "0");
                        }
                    } while (context.KhachHangs.Count(x => x.MaKH == model.MaKH) != 0);
                    context.KhachHangs.Add(model);
                    context.SaveChanges();
                    return true;
                }
            }catch(Exception e){
                return false;
            }
        }
        //
        public bool chinhSuaKhachHang(KhachHang model)
        {
            try {
                string strSql; SqlParameter[] parameters;
                if (model.Email == null)
                {
                    strSql = "update khachhang set hoten = @hoten, phai = @phai, ngaysinh = convert(datetime,@ngaysinh,103), diachi = @diachi, sodienthoai = @sdt, matkhau = @mk where makh = @makh";
                        parameters = new SqlParameter[] {
                        new SqlParameter("hoten",model.HoTen),
                        new SqlParameter("makh", model.MaKH),
                        new SqlParameter("phai", model.Phai),
                        new SqlParameter("ngaysinh", model.NgaySinh),
                        new SqlParameter("diachi", model.DiaChi),
                        new SqlParameter("sdt", model.SoDienThoai),
                        new SqlParameter("mk", model.MatKhau)
                        };
                }
                else
                {
                    strSql = "update khachhang set hoten = @hoten, phai = @phai, ngaysinh = convert(datetime,@ngaysinh,103), diachi = @diachi, sodienthoai = @sdt, email = @email, matkhau = @mk where makh = @makh";
                    parameters = new SqlParameter[] {
                new SqlParameter("hoten",model.HoTen),
                    new SqlParameter("makh", model.MaKH),
                    new SqlParameter("email", model.Email),
                    new SqlParameter("phai", model.Phai),
                    new SqlParameter("ngaysinh", model.NgaySinh),
                    new SqlParameter("diachi", model.DiaChi),
                    new SqlParameter("sdt", model.SoDienThoai),
                    new SqlParameter("mk", model.MatKhau)
            };
                }
                context.Database.ExecuteSqlCommand(strSql, parameters);
                return true;
            }
            catch(Exception e)
            {
                return false;
            }
        }
        //
        public bool kiemTraTonTai(string tenTK)
        {
            if (context.KhachHangs.Count(x => x.TaiKhoan == tenTK) > 0)
            {
                return true;
            }
            else return false;
        }
        //
        public bool xoaKhachHang(string id){
            try
            {
                context.KhachHangs.Remove(context.KhachHangs.Find(id));
                context.SaveChanges();
                return true;
            }catch(Exception e)
            {
                return false;
            }
        }
    }
}
