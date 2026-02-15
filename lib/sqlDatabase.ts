/**
 * SQL Question Database
 * Contains schema definitions and seed data for SQL challenges
 */

export interface SQLQuestion {
  id: string
  title: string
  description: string
  difficulty: 'Basic' | 'Medium' | 'Advanced'
  schema: string // SQL schema definition
  seedData: string // SQL INSERT statements
  expectedQuery?: string // Optional: expected query pattern (for validation)
  hints: string[]
}

export interface SQLSchema {
  questionId: string
  schema: string
  seedData: string
}

// SQL Questions Database
export const SQL_QUESTIONS: Record<string, SQLQuestion> = {
  // Basic: SELECT Queries
  'dbms-sql-select-basic': {
    id: 'dbms-sql-select-basic',
    title: 'Basic SELECT Query',
    description: 'Write a SQL query to retrieve all columns from the employees table.',
    difficulty: 'Basic',
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        salary INTEGER NOT NULL,
        hire_date TEXT NOT NULL
      );
    `,
    seedData: `
      INSERT INTO employees (id, name, department, salary, hire_date) VALUES
      (1, 'John Doe', 'Engineering', 75000, '2020-01-15'),
      (2, 'Jane Smith', 'Marketing', 65000, '2019-03-20'),
      (3, 'Bob Johnson', 'Engineering', 80000, '2018-06-10'),
      (4, 'Alice Williams', 'Sales', 60000, '2021-02-05'),
      (5, 'Charlie Brown', 'Engineering', 90000, '2017-11-30');
    `,
    hints: [
      'Use SELECT * to retrieve all columns',
      'Use FROM to specify the table name',
      'The table name is "employees"'
    ]
  },
  
  // Basic: SELECT with WHERE
  'dbms-sql-select-where-basic': {
    id: 'dbms-sql-select-where-basic',
    title: 'SELECT with WHERE Clause',
    description: 'Write a SQL query to retrieve all employees from the Engineering department.',
    difficulty: 'Basic',
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        salary INTEGER NOT NULL,
        hire_date TEXT NOT NULL
      );
    `,
    seedData: `
      INSERT INTO employees (id, name, department, salary, hire_date) VALUES
      (1, 'John Doe', 'Engineering', 75000, '2020-01-15'),
      (2, 'Jane Smith', 'Marketing', 65000, '2019-03-20'),
      (3, 'Bob Johnson', 'Engineering', 80000, '2018-06-10'),
      (4, 'Alice Williams', 'Sales', 60000, '2021-02-05'),
      (5, 'Charlie Brown', 'Engineering', 90000, '2017-11-30');
    `,
    hints: [
      'Use WHERE clause to filter rows',
      'Filter by department = "Engineering"',
      'Use single quotes for string values'
    ]
  },

  // Medium: SELECT with ORDER BY
  'dbms-sql-select-orderby-medium': {
    id: 'dbms-sql-select-orderby-medium',
    title: 'SELECT with ORDER BY',
    description: 'Write a SQL query to retrieve all employees ordered by salary in descending order.',
    difficulty: 'Medium',
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        salary INTEGER NOT NULL,
        hire_date TEXT NOT NULL
      );
    `,
    seedData: `
      INSERT INTO employees (id, name, department, salary, hire_date) VALUES
      (1, 'John Doe', 'Engineering', 75000, '2020-01-15'),
      (2, 'Jane Smith', 'Marketing', 65000, '2019-03-20'),
      (3, 'Bob Johnson', 'Engineering', 80000, '2018-06-10'),
      (4, 'Alice Williams', 'Sales', 60000, '2021-02-05'),
      (5, 'Charlie Brown', 'Engineering', 90000, '2017-11-30');
    `,
    hints: [
      'Use ORDER BY to sort results',
      'Use DESC for descending order',
      'Sort by the salary column'
    ]
  },

  // Medium: SELECT with JOIN
  'dbms-sql-join-medium': {
    id: 'dbms-sql-join-medium',
    title: 'INNER JOIN Query',
    description: 'Write a SQL query to retrieve employee names and their department names by joining employees and departments tables.',
    difficulty: 'Medium',
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department_id INTEGER NOT NULL,
        salary INTEGER NOT NULL
      );
      CREATE TABLE departments (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );
    `,
    seedData: `
      INSERT INTO departments (id, name) VALUES
      (1, 'Engineering'),
      (2, 'Marketing'),
      (3, 'Sales');
      INSERT INTO employees (id, name, department_id, salary) VALUES
      (1, 'John Doe', 1, 75000),
      (2, 'Jane Smith', 2, 65000),
      (3, 'Bob Johnson', 1, 80000),
      (4, 'Alice Williams', 3, 60000),
      (5, 'Charlie Brown', 1, 90000);
    `,
    hints: [
      'Use INNER JOIN to combine tables',
      'Join on employees.department_id = departments.id',
      'Select name from employees and name from departments (use aliases)'
    ]
  },

  // Advanced: Complex JOIN with Aggregation
  'dbms-sql-join-aggregate-advanced': {
    id: 'dbms-sql-join-aggregate-advanced',
    title: 'JOIN with GROUP BY and Aggregate',
    description: 'Write a SQL query to find the average salary for each department.',
    difficulty: 'Advanced',
    schema: `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department_id INTEGER NOT NULL,
        salary INTEGER NOT NULL
      );
      CREATE TABLE departments (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );
    `,
    seedData: `
      INSERT INTO departments (id, name) VALUES
      (1, 'Engineering'),
      (2, 'Marketing'),
      (3, 'Sales');
      INSERT INTO employees (id, name, department_id, salary) VALUES
      (1, 'John Doe', 1, 75000),
      (2, 'Jane Smith', 2, 65000),
      (3, 'Bob Johnson', 1, 80000),
      (4, 'Alice Williams', 3, 60000),
      (5, 'Charlie Brown', 1, 90000);
    `,
    hints: [
      'Use JOIN to combine employees and departments',
      'Use GROUP BY to group by department',
      'Use AVG() function to calculate average salary'
    ]
  }
}

/**
 * Get SQL question by subject, unit, subtopic, and difficulty
 */
export function getSQLQuestion(
  subject: string,
  unit: string,
  subtopic: string,
  difficulty: 'Basic' | 'Medium' | 'Advanced'
): SQLQuestion | null {
  // Only for DBMS/SQL subjects
  const normalizedSubject = subject.toLowerCase().replace(/\s+/g, '-')
  if (!normalizedSubject.includes('database') && !normalizedSubject.includes('dbms') && !normalizedSubject.includes('sql')) {
    return null
  }

  // Normalize unit and subtopic
  const normalizedUnit = unit.toLowerCase().replace(/\s+/g, '-')
  const normalizedSubtopic = subtopic.toLowerCase().replace(/\s+/g, '-')
  const normalizedDifficulty = difficulty.toLowerCase()

  // Map to question key
  const questionKey = `dbms-${normalizedUnit}-${normalizedSubtopic}-${normalizedDifficulty}`
  
  // Try exact match first
  if (SQL_QUESTIONS[questionKey]) {
    return SQL_QUESTIONS[questionKey]
  }

  // Fallback: return a question based on difficulty
  const difficultyQuestions: Record<string, string[]> = {
    'basic': ['dbms-sql-select-basic', 'dbms-sql-select-where-basic'],
    'medium': ['dbms-sql-select-orderby-medium', 'dbms-sql-join-medium'],
    'advanced': ['dbms-sql-join-aggregate-advanced']
  }

  const availableQuestions = difficultyQuestions[normalizedDifficulty] || difficultyQuestions['basic']
  const questionIndex = Math.abs(
    `${subject}-${unit}-${subtopic}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % availableQuestions.length
  
  const selectedKey = availableQuestions[questionIndex]
  return SQL_QUESTIONS[selectedKey] || null
}

/**
 * Get schema and seed data for a question
 */
export function getSQLSchema(questionId: string): SQLSchema | null {
  const question = SQL_QUESTIONS[questionId]
  if (!question) return null

  return {
    questionId: question.id,
    schema: question.schema.trim(),
    seedData: question.seedData.trim()
  }
}




