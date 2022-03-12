using CHTT.Areas.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Test.Table;

namespace CHTT.Areas.Admin.Controllers
{
    public class TestController : Controller
    {
        private EmployeeDbContext _context;
        public TestController() {
            _context = new EmployeeDbContext();
        }

        public ActionResult Index() {
            return View();
        }

        [HttpGet]
        public JsonResult loadData(int page, int pageSize) {
            var model = _context.Employees.OrderBy(x=>x.ID).Skip((page - 1) * pageSize).Take(pageSize);
            var totalRow = _context.Employees.Count();
            return Json(new { 
                data = model,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult updateSalary(string model) {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Employee deTestMember = serializer.Deserialize<Employee>(model);
            var testMember = _context.Employees.Single(x=>x.ID == deTestMember.ID);
            testMember.Salary = deTestMember.Salary;
            var checkSave = _context.Employees.Single(x => x.ID == deTestMember.ID);
            return Json(new { status = true });
        }

        [HttpPost]
        public JsonResult addUpdateEmployee(string strData, int id)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Employee deTestMember = serializer.Deserialize<Employee>(strData);
            if (id == 1)
            {
                try
                {
                    _context.Employees.Add(deTestMember);
                    _context.SaveChanges();
                    return Json(new { status = true });
                }
                catch (Exception e)
                {
                    return Json(new { status = false });
                }
            }
            else
            {
                Employee model = _context.Employees.Find(deTestMember.ID);
                try
                {
                    model.Name = deTestMember.Name;
                    model.Salary = deTestMember.Salary;
                    model.Status = deTestMember.Status;
                    _context.SaveChanges();
                    return Json(new { status = true });
                }
                catch (Exception e)
                {
                    return Json(new { status = false });
                }
            }
        }

        [HttpGet]
        public JsonResult getDetail(int id)
        {
            var model = _context.Employees.Find(id);
            return Json(new
            {
                data = model,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult deleteEmployee(int id)
        {
            try
            {
                var model = _context.Employees.Find(id);
                _context.Employees.Remove(model);
                _context.SaveChanges();
            }
            catch (Exception e) {
                return Json(new { status = false });
            }
            return Json(new { status = true });
        }

        [HttpGet]
        public JsonResult loadDataToDT() {
            var data = _context.Employees.ToList();
            return Json(new { 
                data = data
            }, JsonRequestBehavior.AllowGet);
        }
    }


    // GET: Admin/Test
    /*public ActionResult Index()
    {
        var list = new List<TestModel>();
        list.Add(new TestModel("Yame", "NCC01"));
        list.Add(new TestModel("Toto", "NCC02"));
        list.Add(new TestModel("4Men", "NCC03"));
        list.Add(new TestModel("Chuot xam", "NCC04"));
        ViewBag.list = new SelectList(list, "Value", "Name");
        return View();
    }

    [HttpPost]
    public ActionResult Index(string Value) {
        return Content(Value);
    }

    public ActionResult Create() {
        var list = new List<TestModel>();
        list.Add(new TestModel("Yame", "NCC01"));
        list.Add(new TestModel("Toto", "NCC02"));
        list.Add(new TestModel("4Men", "NCC03"));
        list.Add(new TestModel("Chuot xam", "NCC04"));
        ViewBag.Name3 = new SelectList(list, "Value", "Name",null);

        ViewBag.Value = new SelectList(list, "Name", "Value", "NCC01");

        ViewBag.Name2 = new SelectList(list, "Value", "Name", null);
        return View();
    }*/

    /*List<TestModel> listTestModel = new List<TestModel>() {
            new TestModel()
            {
                ID = 1,
                Name = "Nguyen Van A",
                Salary = 5000000,
                Status = true
            },
            new TestModel()
            {
            ID = 2,
                Name = "Nguyen Van B",
                Salary = 10000000,
                Status = true
            },
            new TestModel()
            {
            ID = 3,
                Name = "Nguyen Van C",
                Salary = 15000000,
                Status = true
            },
            new TestModel()
            {
            ID = 4,
                Name = "Nguyen Van D",
                Salary = 20000000,
                Status = true
            },
            new TestModel()
            {
            ID = 5,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 6,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 7,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 8,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 9,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 10,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 11,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 12,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 13,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            },
            new TestModel()
            {
            ID = 14,
                Name = "Nguyen Van E",
                Salary = 25000000,
                Status = true
            }
        };*/
}