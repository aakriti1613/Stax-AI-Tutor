// MCQ Database for First Units Only
// This is a static database for the first unit of each subject

export interface MCQData {
  subject: string
  unit: string
  subtopic: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'Basic' | 'Medium'
}

export const MCQ_DATABASE: MCQData[] = [
  // C++ Variables - Introduction to Variables
  {
    subject: 'C++ Fundamentals',
    unit: 'Variables & Data Types',
    subtopic: 'Introduction to Variables',
    question: 'What is a variable in programming?',
    options: [
      'A named storage location that holds a value',
      'A function that performs calculations',
      'A data type definition',
      'A loop structure'
    ],
    correctAnswer: 0,
    explanation: 'A variable is a named storage location in memory that holds a value. It allows you to store and manipulate data in your program.',
    difficulty: 'Basic'
  },
  {
    subject: 'C++ Fundamentals',
    unit: 'Variables & Data Types',
    subtopic: 'Introduction to Variables',
    question: 'Which of the following is a valid variable name in C++?',
    options: [
      '2variable',
      'my-variable',
      'myVariable',
      'int'
    ],
    correctAnswer: 2,
    explanation: 'Variable names in C++ must start with a letter or underscore, can contain letters, digits, and underscores, but cannot start with a number or be a reserved keyword like "int".',
    difficulty: 'Basic'
  },
  {
    subject: 'C++ Fundamentals',
    unit: 'Variables & Data Types',
    subtopic: 'Introduction to Variables',
    question: 'What happens if you use an uninitialized variable in C++?',
    options: [
      'It automatically gets initialized to 0',
      'It contains garbage/undefined value',
      'The program won\'t compile',
      'It gets initialized to null'
    ],
    correctAnswer: 1,
    explanation: 'Uninitialized variables in C++ contain garbage values - whatever was previously stored in that memory location. This can lead to unpredictable behavior.',
    difficulty: 'Medium'
  },
  {
    subject: 'C++ Fundamentals',
    unit: 'Variables & Data Types',
    subtopic: 'Introduction to Variables',
    question: 'What is the scope of a variable declared inside a function?',
    options: [
      'Global scope',
      'Local scope',
      'File scope',
      'Namespace scope'
    ],
    correctAnswer: 1,
    explanation: 'Variables declared inside a function have local scope - they can only be accessed within that function and are destroyed when the function exits.',
    difficulty: 'Medium'
  },
  {
    subject: 'C++ Fundamentals',
    unit: 'Variables & Data Types',
    subtopic: 'Introduction to Variables',
    question: 'Which keyword is used to declare a constant variable in C++?',
    options: [
      'static',
      'const',
      'final',
      'readonly'
    ],
    correctAnswer: 1,
    explanation: 'The "const" keyword is used to declare constant variables in C++ that cannot be modified after initialization.',
    difficulty: 'Basic'
  },

  // Java Basics - Hello World
  {
    subject: 'Java Fundamentals',
    unit: 'Java Basics',
    subtopic: 'Hello World',
    question: 'What is the entry point of a Java program?',
    options: [
      'main() method',
      'start() method',
      'init() method',
      'run() method'
    ],
    correctAnswer: 0,
    explanation: 'The main() method with signature "public static void main(String[] args)" is the entry point where Java program execution begins.',
    difficulty: 'Basic'
  },
  {
    subject: 'Java Fundamentals',
    unit: 'Java Basics',
    subtopic: 'Hello World',
    question: 'Which keyword is used to print output in Java?',
    options: [
      'print',
      'System.out.println',
      'console.log',
      'printf'
    ],
    correctAnswer: 1,
    explanation: 'System.out.println() is used to print output to the console in Java. "System.out" is the standard output stream.',
    difficulty: 'Basic'
  },
  {
    subject: 'Java Fundamentals',
    unit: 'Java Basics',
    subtopic: 'Hello World',
    question: 'What does "public static void main" mean?',
    options: [
      'public: accessible everywhere, static: belongs to class, void: returns nothing',
      'public: private method, static: instance method, void: returns int',
      'public: package-private, static: instance method, void: returns string',
      'None of the above'
    ],
    correctAnswer: 0,
    explanation: 'public: accessible from anywhere, static: belongs to class (not instance), void: method returns nothing.',
    difficulty: 'Medium'
  },
  {
    subject: 'Java Fundamentals',
    unit: 'Java Basics',
    subtopic: 'Hello World',
    question: 'What is the file extension for Java source files?',
    options: [
      '.java',
      '.class',
      '.jar',
      '.javac'
    ],
    correctAnswer: 0,
    explanation: 'Java source files have the .java extension. They are compiled to .class files (bytecode) by the Java compiler.',
    difficulty: 'Basic'
  },
  {
    subject: 'Java Fundamentals',
    unit: 'Java Basics',
    subtopic: 'Hello World',
    question: 'What is the difference between System.out.print() and System.out.println()?',
    options: [
      'No difference',
      'print() adds newline, println() doesn\'t',
      'println() adds newline, print() doesn\'t',
      'print() is faster'
    ],
    correctAnswer: 2,
    explanation: 'System.out.println() automatically adds a newline character after printing, while System.out.print() does not.',
    difficulty: 'Basic'
  },

  // Python Basics - Python Syntax
  {
    subject: 'Python Fundamentals',
    unit: 'Python Basics',
    subtopic: 'Python Syntax',
    question: 'What is used for indentation in Python?',
    options: [
      'Tabs only',
      'Spaces only',
      'Either tabs or spaces, but must be consistent',
      'Brackets'
    ],
    correctAnswer: 2,
    explanation: 'Python uses indentation to define code blocks. You can use either tabs or spaces, but you must be consistent within the same file.',
    difficulty: 'Basic'
  },
  {
    subject: 'Python Fundamentals',
    unit: 'Python Basics',
    subtopic: 'Python Syntax',
    question: 'How do you write a comment in Python?',
    options: [
      '// comment',
      '# comment',
      '/* comment */',
      '-- comment'
    ],
    correctAnswer: 1,
    explanation: 'In Python, comments start with the # symbol. Everything after # on that line is ignored by the interpreter.',
    difficulty: 'Basic'
  },
  {
    subject: 'Python Fundamentals',
    unit: 'Python Basics',
    subtopic: 'Python Syntax',
    question: 'What is the result of: print(2 ** 3)',
    options: [
      '6',
      '8',
      '9',
      'Error'
    ],
    correctAnswer: 1,
    explanation: 'The ** operator is exponentiation in Python. 2 ** 3 means 2 raised to the power of 3, which equals 8.',
    difficulty: 'Basic'
  },
  {
    subject: 'Python Fundamentals',
    unit: 'Python Basics',
    subtopic: 'Python Syntax',
    question: 'What is dynamic typing in Python?',
    options: [
      'Variables can change type during execution',
      'Variables must be declared with types',
      'Types are checked at compile time',
      'Python doesn\'t support types'
    ],
    correctAnswer: 0,
    explanation: 'Python uses dynamic typing, meaning variables can hold values of different types and can change type during program execution.',
    difficulty: 'Medium'
  },
  {
    subject: 'Python Fundamentals',
    unit: 'Python Basics',
    subtopic: 'Python Syntax',
    question: 'What does PEP 8 refer to?',
    options: [
      'Python Enhancement Proposal for code style',
      'A Python library',
      'A Python version',
      'A Python framework'
    ],
    correctAnswer: 0,
    explanation: 'PEP 8 is the official style guide for Python code, providing conventions for writing readable and consistent Python code.',
    difficulty: 'Medium'
  },

  // DSA Arrays - Introduction to Arrays
  {
    subject: 'Data Structures & Algorithms',
    unit: 'Arrays',
    subtopic: 'Introduction to Arrays',
    question: 'What is the time complexity to access an element in an array by index?',
    options: [
      'O(n)',
      'O(log n)',
      'O(1)',
      'O(n log n)'
    ],
    correctAnswer: 2,
    explanation: 'Array access by index is O(1) constant time because arrays use direct memory addressing - the address can be calculated directly from the index.',
    difficulty: 'Basic'
  },
  {
    subject: 'Data Structures & Algorithms',
    unit: 'Arrays',
    subtopic: 'Introduction to Arrays',
    question: 'What is the main disadvantage of arrays?',
    options: [
      'Fast access',
      'Fixed size',
      'Memory efficient',
      'Easy to use'
    ],
    correctAnswer: 1,
    explanation: 'Arrays have a fixed size that must be known at declaration time. This makes them inflexible when the number of elements is unknown.',
    difficulty: 'Basic'
  },
  {
    subject: 'Data Structures & Algorithms',
    unit: 'Arrays',
    subtopic: 'Introduction to Arrays',
    question: 'What is the time complexity to insert an element at the beginning of an array?',
    options: [
      'O(1)',
      'O(n)',
      'O(log n)',
      'O(n²)'
    ],
    correctAnswer: 1,
    explanation: 'Inserting at the beginning requires shifting all existing elements one position to the right, which takes O(n) time.',
    difficulty: 'Medium'
  },
  {
    subject: 'Data Structures & Algorithms',
    unit: 'Arrays',
    subtopic: 'Introduction to Arrays',
    question: 'What is a 2D array?',
    options: [
      'An array of arrays',
      'An array with two elements',
      'A special data type',
      'A function'
    ],
    correctAnswer: 0,
    explanation: 'A 2D array is essentially an array where each element is itself an array, creating a matrix-like structure.',
    difficulty: 'Basic'
  },
  {
    subject: 'Data Structures & Algorithms',
    unit: 'Arrays',
    subtopic: 'Introduction to Arrays',
    question: 'What is the difference between an array and a list?',
    options: [
      'No difference',
      'Arrays are fixed size, lists are dynamic',
      'Lists are faster',
      'Arrays are only in C++'
    ],
    correctAnswer: 1,
    explanation: 'Arrays typically have fixed size, while lists (like Python lists or Java ArrayList) can grow and shrink dynamically.',
    difficulty: 'Medium'
  },

  // OOPS Classes & Objects - Class Concept
  {
    subject: 'Object-Oriented Programming',
    unit: 'Classes & Objects',
    subtopic: 'Class Concept',
    question: 'What is a class in OOP?',
    options: [
      'A variable',
      'A blueprint for creating objects',
      'A function',
      'A data type'
    ],
    correctAnswer: 1,
    explanation: 'A class is a blueprint or template that defines the properties (attributes) and behaviors (methods) that objects of that class will have.',
    difficulty: 'Basic'
  },
  {
    subject: 'Object-Oriented Programming',
    unit: 'Classes & Objects',
    subtopic: 'Class Concept',
    question: 'What is an object?',
    options: [
      'A class definition',
      'An instance of a class',
      'A method',
      'A variable'
    ],
    correctAnswer: 1,
    explanation: 'An object is an instance of a class - a concrete realization of the class blueprint with actual values for its attributes.',
    difficulty: 'Basic'
  },
  {
    subject: 'Object-Oriented Programming',
    unit: 'Classes & Objects',
    subtopic: 'Class Concept',
    question: 'What are the four pillars of OOP?',
    options: [
      'Class, Object, Method, Variable',
      'Encapsulation, Inheritance, Polymorphism, Abstraction',
      'Public, Private, Protected, Static',
      'Int, String, Float, Bool'
    ],
    correctAnswer: 1,
    explanation: 'The four pillars of OOP are: Encapsulation (data hiding), Inheritance (code reuse), Polymorphism (many forms), and Abstraction (simplified interface).',
    difficulty: 'Medium'
  },
  {
    subject: 'Object-Oriented Programming',
    unit: 'Classes & Objects',
    subtopic: 'Class Concept',
    question: 'What is encapsulation?',
    options: [
      'Inheriting from a class',
      'Bundling data and methods together, hiding implementation',
      'Creating multiple objects',
      'Defining a class'
    ],
    correctAnswer: 1,
    explanation: 'Encapsulation is the bundling of data (attributes) and methods (behaviors) together in a class, while hiding the internal implementation details.',
    difficulty: 'Medium'
  },
  {
    subject: 'Object-Oriented Programming',
    unit: 'Classes & Objects',
    subtopic: 'Class Concept',
    question: 'What is the difference between a class and an object?',
    options: [
      'No difference',
      'Class is template, object is instance',
      'Object is template, class is instance',
      'They are the same thing'
    ],
    correctAnswer: 1,
    explanation: 'A class is a template/blueprint that defines structure and behavior. An object is a concrete instance created from that class.',
    difficulty: 'Basic'
  },

  // DBMS Introduction - What is DBMS?
  {
    subject: 'Database Management Systems',
    unit: 'DBMS Introduction',
    subtopic: 'What is DBMS?',
    question: 'What does DBMS stand for?',
    options: [
      'Database Management System',
      'Data Backup Management System',
      'Database Memory System',
      'Data Business Management System'
    ],
    correctAnswer: 0,
    explanation: 'DBMS stands for Database Management System - software that manages databases and provides an interface for users and applications.',
    difficulty: 'Basic'
  },
  {
    subject: 'Database Management Systems',
    unit: 'DBMS Introduction',
    subtopic: 'What is DBMS?',
    question: 'What is the main purpose of a DBMS?',
    options: [
      'To store data only',
      'To manage, store, and retrieve data efficiently',
      'To create websites',
      'To write code'
    ],
    correctAnswer: 1,
    explanation: 'The main purpose of a DBMS is to efficiently manage, store, organize, and retrieve data while providing security, consistency, and concurrent access.',
    difficulty: 'Basic'
  },
  {
    subject: 'Database Management Systems',
    unit: 'DBMS Introduction',
    subtopic: 'What is DBMS?',
    question: 'What is a primary key?',
    options: [
      'A foreign key',
      'A unique identifier for each row in a table',
      'A data type',
      'A query'
    ],
    correctAnswer: 1,
    explanation: 'A primary key is a unique identifier for each row in a table. It cannot be null and must be unique across all rows.',
    difficulty: 'Basic'
  },
  {
    subject: 'Database Management Systems',
    unit: 'DBMS Introduction',
    subtopic: 'What is DBMS?',
    question: 'What is the difference between DBMS and RDBMS?',
    options: [
      'No difference',
      'RDBMS stores data in tables with relationships, DBMS doesn\'t',
      'DBMS is newer',
      'RDBMS doesn\'t support SQL'
    ],
    correctAnswer: 1,
    explanation: 'RDBMS (Relational Database Management System) stores data in tables with relationships between them, while DBMS is a more general term.',
    difficulty: 'Medium'
  },
  {
    subject: 'Database Management Systems',
    unit: 'DBMS Introduction',
    subtopic: 'What is DBMS?',
    question: 'What are the advantages of using a DBMS?',
    options: [
      'Data redundancy, inconsistency',
      'Data security, integrity, consistency, reduced redundancy',
      'Slower access',
      'No advantages'
    ],
    correctAnswer: 1,
    explanation: 'DBMS provides data security, integrity, consistency, reduced redundancy, concurrent access, and efficient data management.',
    difficulty: 'Medium'
  },
]

// Helper function to get MCQs for a specific subject/unit/subtopic
export function getMCQsForSubtopic(subject: string, unit: string, subtopic: string): MCQData[] {
  return MCQ_DATABASE.filter(
    mcq => mcq.subject === subject && mcq.unit === unit && mcq.subtopic === subtopic
  )
}















