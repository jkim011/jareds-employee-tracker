const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Connection
const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "password",
      database: "employee_db"
    },
    console.log("Connected to the employee_db database.")
);

db.connect(err => {
    if (err) throw err;
    console.log('Connected as id ' + db.threadId);
    showTitle();
});

// Shows at start of application
function showTitle() {
        console.log("------------------------------")
        console.log("|                            |")
        console.log("|      EMPLOYEE MANAGER      |")
        console.log("|                            |")
        console.log("------------------------------")
        console.log("")
        startPrompt();
};

function startPrompt() {
    inquirer
    .prompt ([
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: [
                        "View All Employees",
                        "Add Employee",
                        "Update Employee Role",
                        "View All Roles",
                        "Add Role",
                        "View All Departments",
                        "Add Department"
                     ]
        }
    ])
}