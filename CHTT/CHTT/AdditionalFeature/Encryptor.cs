using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace CHTT.AdditionalFeature
{
    public class Encryptor
    {
        public static string ComputeSHA256Hash(string strRaw)
        {
            SHA256 sha256Hash = SHA256.Create();
            byte[] byteHashed = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(strRaw));
            StringBuilder strBuild = new StringBuilder();
            for (int i = 0; i < byteHashed.Length; i++)
            {
                strBuild.Append(byteHashed[i].ToString("x2"));
            }
            return strBuild.ToString();
        }
    }
}