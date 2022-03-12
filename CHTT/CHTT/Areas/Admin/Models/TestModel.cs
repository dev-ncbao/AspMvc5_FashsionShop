using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CHTT.Areas.Admin.Models
{
    public class TestModel
    {
        public int ID { set; get; }
        public string Name { set; get; }
        public double Salary { set; get; }
        public bool Status { set; get; }

        public bool updateSalary(int id, double salary) {
            return true;
        }
    }
}