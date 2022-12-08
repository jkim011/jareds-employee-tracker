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

// Functions for prompt choices
showEmployees = () => {
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department,
                        role.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                 FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  
    connection.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
      startPrompt();
    });
};

employeeDepartment = () => {
    const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN department ON role.department_id = department.id`;
  
    connection.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      startPrompt();
    });          
};

addEmployee = () => {
    inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: addFirstName => {
          if (addFirstName) {
              return true;
          } else {
              console.log("Please enter a first name");
              return false;
          }
        }
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: addLastName => {
          if (addLastName) {
              return true;
          } else {
              console.log("Please enter a last name");
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.firstName, answer.lastName]
      const roleSql = `SELECT role.id, role.title FROM role`;
      
      connection.query(roleSql, (err, data) => {
        if (err) throw err; 
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employee`;

                connection.query(managerSql, (err, data) => {
                  if (err) throw err;
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  inquirer.prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                   VALUES (?, ?, ?, ?)`;
  
                      connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added!")
                      showEmployees();
                      });
                    });
                });
              });
      });
    });
};

deleteEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;
  
    connection.query(employeeSql, (err, data) => {
      if (err) throw err; 
      const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to delete?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const sql = `DELETE FROM employee WHERE id = ?`;
  
          connection.query(sql, employee, (err, result) => {
            if (err) throw err;
            console.log("Employee has been deleted!");
            showEmployees();
          });
        });
    });
};

updateEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;
  
    connection.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM role`;
  
          connection.query(roleSql, (err, data) => {
            if (err) throw err; 
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: "list",
                  name: "role",
                  message: "What is this employee's new role?",
                  choices: roles
                }
              ])
                .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
    
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee role has been updated!");  
                    showEmployees();
                  }); 
                });
            });
        });
    });
};

updateManager = () => {
    const employeeSql = `SELECT * FROM employee`;
  
    connection.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(employeeChoice => {
          const employee = employeeChoice.name;
          const params = []; 
          params.push(employee);
  
          const managerSql = `SELECT * FROM employee`;
  
            connection.query(managerSql, (err, data) => {
              if (err) throw err; 
  
            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
              
                inquirer.prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is this employee's new manager?",
                    choices: managers
                  }
                ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager); 
                      
                      let employee = params[0]
                      params[0] = manager
                      params[1] = employee 
                      
                      const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
  
                      connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee's manager has been updated!");
                        showEmployees();
                      });
                    });
                });
            });
        });
};

showRoles = () => {  
    const sql = `SELECT role.id, role.title, role.salary, department.name AS department
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;
    
    connection.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      startPrompt();
    })
};

addRole = () => {
    inquirer.prompt([
      {
        type: "input", 
        name: "role",
        message: "What role do you want to add?",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log("Please enter a role");
              return false;
          }
        }
      },
      {
        type: "input", 
        name: "salary",
        message: "What is the salary of this role?",
        validate: addSalary => {
          if (isNaN(addSalary)) {
            console.log("Please enter a salary");
              return false;
          } else {
              return true;
          }
        }
      }
    ])
      .then(answer => {
        const params = [answer.role, answer.salary];
        const roleSql = `SELECT name, id FROM department`; 
  
        connection.query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const departments = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: "list", 
            name: "departments",
            message: "What department is this role in?",
            choices: departments
          }
          ])
            .then(departmentChoice => {
              const department = departmentChoice.departments;
              params.push(department);
  
              const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;
  
              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Added" + answer.role + " to roles!"); 
                showRoles();
              });
            });
        });
    });
};

deleteRole = () => {
    const roleSql = `SELECT * FROM role`; 
  
    connection.query(roleSql, (err, data) => {
      if (err) throw err; 
  
      const role = data.map(({ title, id }) => ({ name: title, value: id }));
  
      inquirer.prompt([
        {
          type: "list", 
          name: "role",
          message: "What role do you want to delete?",
          choices: role
        }
      ])
        .then(roleChoice => {
          const role = roleChoice.role;
          const sql = `DELETE FROM role WHERE id = ?`;
  
          connection.query(sql, role, (err, result) => {
            if (err) throw err;
            console.log("Role successfully deleted!"); 
            showRoles();
        });
      });
    });
};
  
showDepartments = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      startPrompt();
    });
};

addDepartment = () => {
    inquirer.prompt([
      {
        type: "input", 
        name: "addDepartment",
        message: "What department do you want to add?",
        validate: addDepartment => {
          if (addDepartment) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;

        connection.query(sql, answer.addDepartment, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDepartment + " to departments!");   
          showDepartments();
      });
    });
};

deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`; 
  
    connection.query(deptSql, (err, data) => {
      if (err) throw err; 
  
      const departments = data.map(({ name, id }) => ({ name: name, value: id }));
  
      inquirer.prompt([
        {
          type: "list", 
          name: "departments",
          message: "What department do you want to delete?",
          choices: departments
        }
      ])
        .then(departmentChoice => {
          const department = departmentChoice.departments;
          const sql = `DELETE FROM department WHERE id = ?`;
  
          connection.query(sql, department, (err, result) => {
            if (err) throw err;
            console.log("Department successfully deleted!"); 
            showDepartments();
        });
      });
    });
};

viewBudget = () => {  
    const sql = `SELECT department_id AS id, 
                        department.name AS department,
                        SUM(salary) AS budget
                 FROM  role  
                 JOIN department ON role.department_id = department.id GROUP BY  department_id`;
    
    connection.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);  
      startPrompt(); 
    });            
};
