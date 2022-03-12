namespace Test.Table.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Test.Table.EmployeeDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Test.Table.EmployeeDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.
            context.Employees.AddOrUpdate(
                new Employee { Name = "Nguyễn Chí Bảo" , Salary = 1000000, Status = true},
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 2000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 3000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 4000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 5000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 6000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 7000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 8000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 9000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 10000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 11000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 12000000, Status = true }, 
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 13000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 14000000, Status = true },
                new Employee { Name = "Nguyễn Chí Bảo", Salary = 15000000, Status = true }
            );
        }
    }
}
