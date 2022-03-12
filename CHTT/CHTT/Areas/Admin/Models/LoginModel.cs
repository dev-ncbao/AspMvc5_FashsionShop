using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Bạn chưa nhập Tài khoản.")]
        [Display(Name = "Tài khoản")]
        public string Username { set; get; }
        [Required(ErrorMessage = "Bạn chưa nhập Mật khẩu.")]
        [Display(Name = "Mật khẩu")]
        public string Password { set; get; }

        public bool RememberMe { set; get; }
    }
}