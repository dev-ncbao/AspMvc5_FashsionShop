using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test.Table
{
    public class EmployeeDbContext : DbContext
    {
        
        public EmployeeDbContext() : base("EmployeeDbContext")
        { 
                
        }
        public DbSet<Employee> Employees { set; get; }
    }
}
