export type Subject = 'cpp' | 'java' | 'python' | 'dsa' | 'oops' | 'dbms'

export interface SubTopic {
  id: string
  name: string
  description: string
  locked: boolean
  completed: boolean
  xpReward: number
  order: number
}

export interface Unit {
  id: string
  name: string
  description: string
  locked: boolean
  completed: boolean
  xpReward: number
  subtopics: SubTopic[]
}

export interface SubjectConfig {
  id: Subject
  name: string
  icon: string
  color: string
  units: Unit[]
}

export const SUBJECTS: Record<Subject, SubjectConfig> = {
  cpp: {
    id: 'cpp',
    name: 'C++ Fundamentals',
    icon: '⚡',
    color: 'neon-cyan',
    units: [
      {
        id: 'variables',
        name: 'Variables & Data Types',
        description: 'Learn the basics',
        locked: false,
        completed: false,
        xpReward: 100,
        subtopics: [
          { id: 'intro', name: 'Introduction to Variables', description: 'What are variables?', locked: false, completed: false, xpReward: 20, order: 1 },
          { id: 'data-types', name: 'Data Types', description: 'int, float, char, bool', locked: false, completed: false, xpReward: 25, order: 2 },
          { id: 'declaration', name: 'Variable Declaration', description: 'How to declare variables', locked: false, completed: false, xpReward: 25, order: 3 },
          { id: 'initialization', name: 'Variable Initialization', description: 'Assigning values', locked: false, completed: false, xpReward: 30, order: 4 },
        ],
      },
      {
        id: 'control-flow',
        name: 'Control Flow',
        description: 'If, loops, switches',
        locked: true,
        completed: false,
        xpReward: 150,
        subtopics: [
          { id: 'if-else', name: 'If-Else Statements', description: 'Conditional logic', locked: true, completed: false, xpReward: 30, order: 1 },
          { id: 'loops', name: 'Loops (for, while)', description: 'Iteration', locked: true, completed: false, xpReward: 40, order: 2 },
          { id: 'switch', name: 'Switch Statements', description: 'Multi-way branching', locked: true, completed: false, xpReward: 40, order: 3 },
          { id: 'nested', name: 'Nested Control Structures', description: 'Complex logic', locked: true, completed: false, xpReward: 40, order: 4 },
        ],
      },
      {
        id: 'functions',
        name: 'Functions',
        description: 'Reusable code blocks',
        locked: true,
        completed: false,
        xpReward: 150,
        subtopics: [
          { id: 'function-basics', name: 'Function Basics', description: 'Defining functions', locked: true, completed: false, xpReward: 30, order: 1 },
          { id: 'parameters', name: 'Parameters & Arguments', description: 'Passing data', locked: true, completed: false, xpReward: 40, order: 2 },
          { id: 'return', name: 'Return Values', description: 'Getting results', locked: true, completed: false, xpReward: 40, order: 3 },
          { id: 'overloading', name: 'Function Overloading', description: 'Multiple definitions', locked: true, completed: false, xpReward: 40, order: 4 },
        ],
      },
      {
        id: 'pointers',
        name: 'Pointers & References',
        description: 'Memory management',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'pointer-basics', name: 'Pointer Basics', description: 'Understanding pointers', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'pointer-arithmetic', name: 'Pointer Arithmetic', description: 'Manipulating pointers', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'references', name: 'References', description: 'Aliases', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'dynamic-memory', name: 'Dynamic Memory', description: 'new and delete', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'classes',
        name: 'Classes & Objects',
        description: 'OOP in C++',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'class-basics', name: 'Class Basics', description: 'Defining classes', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'objects', name: 'Objects', description: 'Creating instances', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'constructors', name: 'Constructors & Destructors', description: 'Initialization', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'access-modifiers', name: 'Access Modifiers', description: 'public, private, protected', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
    ],
  },
  java: {
    id: 'java',
    name: 'Java Fundamentals',
    icon: '☕',
    color: 'neon-purple',
    units: [
      {
        id: 'basics',
        name: 'Java Basics',
        description: 'Syntax and structure',
        locked: false,
        completed: false,
        xpReward: 100,
        subtopics: [
          { id: 'hello-world', name: 'Hello World', description: 'First program', locked: false, completed: false, xpReward: 20, order: 1 },
          { id: 'syntax', name: 'Java Syntax', description: 'Basic rules', locked: false, completed: false, xpReward: 25, order: 2 },
          { id: 'variables', name: 'Variables', description: 'Data storage', locked: false, completed: false, xpReward: 25, order: 3 },
          { id: 'operators', name: 'Operators', description: 'Math and logic', locked: false, completed: false, xpReward: 30, order: 4 },
        ],
      },
      {
        id: 'oop',
        name: 'OOP Concepts',
        description: 'Classes, inheritance',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'classes', name: 'Classes', description: 'Blueprint', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'inheritance', name: 'Inheritance', description: 'Extending classes', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'polymorphism', name: 'Polymorphism', description: 'Many forms', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'interfaces', name: 'Interfaces', description: 'Contracts', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'collections',
        name: 'Collections Framework',
        description: 'Lists, maps, sets',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'arraylist', name: 'ArrayList', description: 'Dynamic arrays', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'hashmap', name: 'HashMap', description: 'Key-value pairs', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'hashset', name: 'HashSet', description: 'Unique elements', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'iterators', name: 'Iterators', description: 'Traversing collections', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'exceptions',
        name: 'Exception Handling',
        description: 'Error management',
        locked: true,
        completed: false,
        xpReward: 150,
        subtopics: [
          { id: 'try-catch', name: 'Try-Catch Blocks', description: 'Error catching', locked: true, completed: false, xpReward: 40, order: 1 },
          { id: 'throw', name: 'Throw & Throws', description: 'Throwing exceptions', locked: true, completed: false, xpReward: 40, order: 2 },
          { id: 'custom', name: 'Custom Exceptions', description: 'User-defined', locked: true, completed: false, xpReward: 35, order: 3 },
          { id: 'finally', name: 'Finally Block', description: 'Cleanup code', locked: true, completed: false, xpReward: 35, order: 4 },
        ],
      },
    ],
  },
  python: {
    id: 'python',
    name: 'Python Fundamentals',
    icon: '🐍',
    color: 'neon-green',
    units: [
      {
        id: 'basics',
        name: 'Python Basics',
        description: 'Syntax and types',
        locked: false,
        completed: false,
        xpReward: 100,
        subtopics: [
          { id: 'syntax', name: 'Python Syntax', description: 'Indentation, comments', locked: false, completed: false, xpReward: 25, order: 1 },
          { id: 'variables', name: 'Variables', description: 'Dynamic typing', locked: false, completed: false, xpReward: 25, order: 2 },
          { id: 'data-types', name: 'Data Types', description: 'int, str, float, bool', locked: false, completed: false, xpReward: 25, order: 3 },
          { id: 'operators', name: 'Operators', description: 'Math and logic', locked: false, completed: false, xpReward: 25, order: 4 },
        ],
      },
      {
        id: 'data-structures',
        name: 'Data Structures',
        description: 'Lists, dicts, tuples',
        locked: true,
        completed: false,
        xpReward: 150,
        subtopics: [
          { id: 'lists', name: 'Lists', description: 'Ordered collections', locked: true, completed: false, xpReward: 40, order: 1 },
          { id: 'tuples', name: 'Tuples', description: 'Immutable sequences', locked: true, completed: false, xpReward: 35, order: 2 },
          { id: 'dictionaries', name: 'Dictionaries', description: 'Key-value pairs', locked: true, completed: false, xpReward: 40, order: 3 },
          { id: 'sets', name: 'Sets', description: 'Unique collections', locked: true, completed: false, xpReward: 35, order: 4 },
        ],
      },
      {
        id: 'functions',
        name: 'Functions & Modules',
        description: 'Code organization',
        locked: true,
        completed: false,
        xpReward: 150,
        subtopics: [
          { id: 'function-basics', name: 'Function Basics', description: 'def keyword', locked: true, completed: false, xpReward: 40, order: 1 },
          { id: 'parameters', name: 'Parameters', description: 'args, kwargs', locked: true, completed: false, xpReward: 40, order: 2 },
          { id: 'lambda', name: 'Lambda Functions', description: 'Anonymous functions', locked: true, completed: false, xpReward: 35, order: 3 },
          { id: 'modules', name: 'Modules & Packages', description: 'Importing code', locked: true, completed: false, xpReward: 35, order: 4 },
        ],
      },
      {
        id: 'oop',
        name: 'OOP in Python',
        description: 'Classes and objects',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'classes', name: 'Classes', description: 'Class definition', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'objects', name: 'Objects', description: 'Instances', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'inheritance', name: 'Inheritance', description: 'Extending classes', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'magic-methods', name: 'Magic Methods', description: '__init__, __str__', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
    ],
  },
  dsa: {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: '🔢',
    color: 'neon-pink',
    units: [
      {
        id: 'arrays',
        name: 'Arrays',
        description: 'Linear data structures',
        locked: false,
        completed: false,
        xpReward: 150,
        subtopics: [
          { id: 'intro', name: 'Introduction to Arrays', description: 'What are arrays?', locked: false, completed: false, xpReward: 30, order: 1 },
          { id: 'operations', name: 'Array Operations', description: 'Access, insert, delete', locked: false, completed: false, xpReward: 40, order: 2 },
          { id: 'searching', name: 'Searching in Arrays', description: 'Linear & Binary search', locked: false, completed: false, xpReward: 40, order: 3 },
          { id: 'sorting', name: 'Sorting Arrays', description: 'Bubble, Selection, Insertion', locked: false, completed: false, xpReward: 40, order: 4 },
        ],
      },
      {
        id: 'linked-lists',
        name: 'Linked Lists',
        description: 'Dynamic structures',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'singly', name: 'Singly Linked List', description: 'One-way connection', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'doubly', name: 'Doubly Linked List', description: 'Two-way connection', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'operations', name: 'LL Operations', description: 'Insert, delete, traverse', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'applications', name: 'Applications', description: 'Real-world uses', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'trees',
        name: 'Trees',
        description: 'Hierarchical data',
        locked: true,
        completed: false,
        xpReward: 250,
        subtopics: [
          { id: 'binary-tree', name: 'Binary Tree', description: 'Two children max', locked: true, completed: false, xpReward: 60, order: 1 },
          { id: 'bst', name: 'Binary Search Tree', description: 'Sorted tree', locked: true, completed: false, xpReward: 60, order: 2 },
          { id: 'traversal', name: 'Tree Traversal', description: 'Inorder, Preorder, Postorder', locked: true, completed: false, xpReward: 65, order: 3 },
          { id: 'avl', name: 'AVL Trees', description: 'Self-balancing', locked: true, completed: false, xpReward: 65, order: 4 },
        ],
      },
      {
        id: 'sorting',
        name: 'Sorting Algorithms',
        description: 'Efficient ordering',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'quick-sort', name: 'Quick Sort', description: 'Divide & conquer', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'merge-sort', name: 'Merge Sort', description: 'Divide & merge', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'heap-sort', name: 'Heap Sort', description: 'Heap-based', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'complexity', name: 'Time Complexity', description: 'Big O analysis', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'searching',
        name: 'Searching Algorithms',
        description: 'Finding data',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'linear', name: 'Linear Search', description: 'Sequential search', locked: true, completed: false, xpReward: 40, order: 1 },
          { id: 'binary', name: 'Binary Search', description: 'Divide in half', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'hash', name: 'Hash-based Search', description: 'O(1) lookup', locked: true, completed: false, xpReward: 55, order: 3 },
          { id: 'graph-search', name: 'Graph Search', description: 'BFS, DFS', locked: true, completed: false, xpReward: 55, order: 4 },
        ],
      },
    ],
  },
  oops: {
    id: 'oops',
    name: 'Object-Oriented Programming',
    icon: '🎯',
    color: 'neon-blue',
    units: [
      {
        id: 'classes',
        name: 'Classes & Objects',
        description: 'Fundamentals',
        locked: false,
        completed: false,
        xpReward: 150,
        subtopics: [
          { id: 'class-concept', name: 'Class Concept', description: 'Blueprint', locked: false, completed: false, xpReward: 40, order: 1 },
          { id: 'objects', name: 'Objects', description: 'Instances', locked: false, completed: false, xpReward: 40, order: 2 },
          { id: 'attributes', name: 'Attributes', description: 'Properties', locked: false, completed: false, xpReward: 35, order: 3 },
          { id: 'methods', name: 'Methods', description: 'Behaviors', locked: false, completed: false, xpReward: 35, order: 4 },
        ],
      },
      {
        id: 'inheritance',
        name: 'Inheritance',
        description: 'Code reuse',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'single', name: 'Single Inheritance', description: 'One parent', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'multiple', name: 'Multiple Inheritance', description: 'Multiple parents', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'multilevel', name: 'Multilevel Inheritance', description: 'Chain of inheritance', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'overriding', name: 'Method Overriding', description: 'Customizing behavior', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'polymorphism',
        name: 'Polymorphism',
        description: 'Many forms',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'compile-time', name: 'Compile-time Polymorphism', description: 'Method overloading', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'runtime', name: 'Runtime Polymorphism', description: 'Method overriding', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'virtual', name: 'Virtual Functions', description: 'Dynamic binding', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'abstract', name: 'Abstract Classes', description: 'Incomplete classes', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'encapsulation',
        name: 'Encapsulation',
        description: 'Data hiding',
        locked: true,
        completed: false,
        xpReward: 150,
        subtopics: [
          { id: 'access-control', name: 'Access Control', description: 'public, private', locked: true, completed: false, xpReward: 40, order: 1 },
          { id: 'getters', name: 'Getters', description: 'Reading data', locked: true, completed: false, xpReward: 35, order: 2 },
          { id: 'setters', name: 'Setters', description: 'Writing data', locked: true, completed: false, xpReward: 35, order: 3 },
          { id: 'data-protection', name: 'Data Protection', description: 'Security', locked: true, completed: false, xpReward: 40, order: 4 },
        ],
      },
      {
        id: 'abstraction',
        name: 'Abstraction',
        description: 'Simplified interfaces',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'abstract-classes', name: 'Abstract Classes', description: 'Cannot instantiate', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'interfaces', name: 'Interfaces', description: 'Contracts', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'implementation', name: 'Implementation', description: 'Concrete classes', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'benefits', name: 'Benefits', description: 'Why use abstraction', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
    ],
  },
  dbms: {
    id: 'dbms',
    name: 'Database Management Systems',
    icon: '🗄️',
    color: 'neon-cyan',
    units: [
      {
        id: 'introduction',
        name: 'DBMS Introduction',
        description: 'Basics of databases',
        locked: false,
        completed: false,
        xpReward: 100,
        subtopics: [
          { id: 'what-is-dbms', name: 'What is DBMS?', description: 'Database basics', locked: false, completed: false, xpReward: 25, order: 1 },
          { id: 'advantages', name: 'Advantages', description: 'Why use DBMS', locked: false, completed: false, xpReward: 25, order: 2 },
          { id: 'types', name: 'Database Types', description: 'Relational, NoSQL', locked: false, completed: false, xpReward: 25, order: 3 },
          { id: 'architecture', name: 'DBMS Architecture', description: 'System design', locked: false, completed: false, xpReward: 25, order: 4 },
        ],
      },
      {
        id: 'sql',
        name: 'SQL Fundamentals',
        description: 'Query language',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'select', name: 'SELECT Queries', description: 'Retrieving data', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'insert', name: 'INSERT Statements', description: 'Adding data', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'update', name: 'UPDATE & DELETE', description: 'Modifying data', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'joins', name: 'JOINs', description: 'Combining tables', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'normalization',
        name: 'Normalization',
        description: 'Database design',
        locked: true,
        completed: false,
        xpReward: 250,
        subtopics: [
          { id: '1nf', name: 'First Normal Form', description: '1NF', locked: true, completed: false, xpReward: 60, order: 1 },
          { id: '2nf', name: 'Second Normal Form', description: '2NF', locked: true, completed: false, xpReward: 60, order: 2 },
          { id: '3nf', name: 'Third Normal Form', description: '3NF', locked: true, completed: false, xpReward: 65, order: 3 },
          { id: 'bcnf', name: 'BCNF', description: 'Boyce-Codd NF', locked: true, completed: false, xpReward: 65, order: 4 },
        ],
      },
      {
        id: 'transactions',
        name: 'Transactions',
        description: 'ACID properties',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'acid', name: 'ACID Properties', description: 'Atomicity, Consistency', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'concurrency', name: 'Concurrency Control', description: 'Managing access', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'locks', name: 'Locks', description: 'Locking mechanisms', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'deadlock', name: 'Deadlock', description: 'Prevention & detection', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
      {
        id: 'indexing',
        name: 'Indexing',
        description: 'Performance optimization',
        locked: true,
        completed: false,
        xpReward: 200,
        subtopics: [
          { id: 'b-tree', name: 'B-Tree Index', description: 'Balanced tree', locked: true, completed: false, xpReward: 50, order: 1 },
          { id: 'hash', name: 'Hash Index', description: 'Hash-based', locked: true, completed: false, xpReward: 50, order: 2 },
          { id: 'clustered', name: 'Clustered Index', description: 'Physical ordering', locked: true, completed: false, xpReward: 50, order: 3 },
          { id: 'optimization', name: 'Query Optimization', description: 'Improving performance', locked: true, completed: false, xpReward: 50, order: 4 },
        ],
      },
    ],
  },
}
