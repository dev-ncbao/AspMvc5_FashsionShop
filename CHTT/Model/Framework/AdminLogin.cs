using Model.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Framework
{
    public class AdminLogin
    {
        CHTTDbContext context = null;
        //
        public AdminLogin() {
            context = new CHTTDbContext();
        }
        //Kiem tra nguoi dung ton tai
        public int Login(string Username, string Password) {
            int res = context.NhanViens.Count(x => x.MaNV == Username && x.MatKhau == Password && x.KichHoat == 1);
            return res;
        }
        //Lay thong tin can thiet
        public NhanVien layDuLieuNhanVien(string Username, string Password)
        {
            return context.NhanViens.FirstOrDefault(x => x.MaNV == Username && x.MatKhau == Password);
        }
    }
}
