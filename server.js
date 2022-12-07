// Dependencies
const inquirer = require("inquirer")
const cTable = require('console.table');
const connection = require("./db/connection")

// Connection and starts application 
connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id " + connection.threadId)
    startApp();
});

// Starts application and displays title
const startApp = () => {
    console.log("------------------------------")
    console.log("|                            |")
    console.log("|      EMPLOYEE MANAGER      |")
    console.log("|                            |")
    console.log("------------------------------")
    startPrompt();
};

// Shows user prompts then performs function based on user answer
const startPrompt = () => {
    inquirer.prompt([
        {
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [
                    "View All Employees", 
                    "View All Employees By Department", 
                    "View All Employees by Manager",
                    "Add Employee",
                    "Delete Employee",
                    "Update Employee Role",
                    "Update Employee Manager", 
                    "View All Roles",
                    "Add Role",
                    "Delete Role",
                    "View All Departments",
                    "Add Department",
                    "Delete Department",
                    "View Total Department Budgets",
                    "Quit"
                ]
        }
    ])
    .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View All Employees") {
          showEmployees();
        }
  
        if (choices === "View All Employees By Department") {
          employeeDepartment();
        }
  
        if (choices === "View All Employees by Manager") {
          employeeManager();
        }
  
        if (choices === "Add Employee") {
          addEmployee();
        }
  
        if (choices === "Delete Employee") {
          deleteEmployee();
        }
  
        if (choices === "Update Employee Role") {
          updateEmployee();
        }
  
        if (choices === "Update Employee Manager") {
          updateManager();
        }
  
        if (choices === "View All Roles") {
          showRoles();
        }
  
        if (choices === "Add Role") {
          addRole();
        }
  
        if (choices === "Delete Role") {
          deleteRole();
        }
  
        if (choices === "View All Departments") {
          showDepartments();
        }
  
        if (choices === "Add Department") {
          addDepartment();
        }
  
        if (choices === "Delete Department") {
          deleteDepartment();
        }

        if (choices === "View Total Department Budgets") {
          viewBudget();
        }
  
        if (choices === "Quit") {
          connection.end()
        };
    });
};