// Theory Database - Static content for first units
// This provides reliable theory content without depending on Gemini API

export interface TheoryContent {
  title: string
  overview: string
  sections: Array<{
    heading: string
    content: string
    codeExample: string
    visualDescription: string
  }>
  keyTakeaways: string[]
}

type TheoryKey = `${string}-${string}-${string}` // subject-unit-subtopic

const theoryDatabase: Record<string, TheoryContent> = {
  // DSA - Arrays - Introduction
  'dsa-arrays-intro': {
    title: 'Introduction to Arrays',
    overview: 'Arrays are one of the most fundamental data structures in computer science. They allow you to store multiple values of the same type in a contiguous block of memory, making them efficient for accessing elements by index. In this section, you\'ll learn what arrays are, how they work, and why they\'re essential for programming.',
    sections: [
      {
        heading: 'What are Arrays?',
        content: `An array is a collection of elements of the same data type, stored in contiguous memory locations. Think of it like a row of lockers, where each locker has a number (index) and can hold one item.

Key Characteristics:
- Fixed Size: Once created, the size of an array is typically fixed (in some languages)
- Indexed Access: Elements are accessed using their position (index), starting from 0
- Contiguous Memory: All elements are stored next to each other in memory
- Same Data Type: All elements must be of the same type (in statically-typed languages)

Why Arrays Matter:
Arrays provide O(1) constant-time access to any element if you know its index. This makes them incredibly fast for lookups and essential for many algorithms.`,
        codeExample: `// Creating an array in different languages

// C++
int numbers[5] = {1, 2, 3, 4, 5};
int first = numbers[0];  // Access first element (index 0)

// Java
int[] numbers = {1, 2, 3, 4, 5};
int first = numbers[0];

// Python
numbers = [1, 2, 3, 4, 5]
first = numbers[0]  # Access first element`,
        visualDescription: 'Visual: Imagine a row of numbered boxes (0, 1, 2, 3, 4), each containing a value. When you access array[2], you directly go to box number 2.'
      },
      {
        heading: 'Array Indexing and Memory Layout',
        content: `Understanding how arrays are stored in memory is crucial for understanding their efficiency.

Memory Layout:
- Arrays are stored in contiguous (adjacent) memory locations
- If an integer takes 4 bytes, and you have an array of 5 integers starting at memory address 1000:
  - Index 0: Address 1000
  - Index 1: Address 1004
  - Index 2: Address 1008
  - Index 3: Address 1012
  - Index 4: Address 1016

Why This Matters:
Because elements are stored contiguously, the computer can calculate the exact memory address of any element using a simple formula:
address = base_address + (index × size_of_element)

This is why array access is O(1) - it's just simple arithmetic!`,
        codeExample: `// Demonstrating array indexing

int arr[5] = {10, 20, 30, 40, 50};

// Accessing elements
cout << arr[0] << endl;  // Output: 10
cout << arr[2] << endl;  // Output: 30
cout << arr[4] << endl;  // Output: 50

// Common mistake: accessing out of bounds
// cout << arr[5] << endl;  // ERROR! Index out of bounds`,
        visualDescription: 'Visual: A memory diagram showing consecutive memory addresses with array elements. Arrows show how index 0 maps to the first address, index 1 to the next, etc.'
      },
      {
        heading: 'Common Array Operations',
        content: `Arrays support several fundamental operations, each with different time complexities:

1. Access (Read)
- Time Complexity: O(1) - Constant time
- Direct access using index
- Syntax: element = array[index]

2. Update (Modify)
- Time Complexity: O(1) - Constant time
- Direct modification using index
- Syntax: array[index] = new_value

3. Search (Find Element)
- Time Complexity: O(n) - Linear time
- Must check each element until found
- Worst case: element not found, check all n elements

4. Insertion
- Time Complexity: O(n) - Linear time
- Must shift elements to make space
- Inserting at beginning requires shifting all elements

5. Deletion
- Time Complexity: O(n) - Linear time
- Must shift elements to fill the gap
- Deleting from beginning requires shifting all elements`,
        codeExample: `// Common array operations

int arr[5] = {1, 2, 3, 4, 5};

// 1. Access
int value = arr[2];  // O(1)

// 2. Update
arr[2] = 99;  // O(1)

// 3. Search (linear search)
int target = 3;
bool found = false;
for (int i = 0; i < 5; i++) {
    if (arr[i] == target) {
        found = true;
        break;
    }
}  // O(n)

// 4. Insert at position (requires shifting)
// This is simplified - actual insertion needs dynamic array
int pos = 2;
int newValue = 10;
// Shift elements right
for (int i = 4; i > pos; i--) {
    arr[i] = arr[i-1];
}
arr[pos] = newValue;  // O(n)`,
        visualDescription: 'Visual: Animated diagram showing each operation - access (instant arrow), search (scanning through elements), insertion (shifting elements right), deletion (shifting elements left).'
      },
      {
        heading: 'Advantages and Disadvantages',
        content: `Understanding when to use arrays is as important as knowing how they work.

Advantages:
- Fast Access: O(1) time to access any element by index
- Memory Efficient: No extra overhead, just the data
- Cache Friendly: Contiguous memory improves cache performance
- Simple: Easy to understand and implement
- Predictable: Fixed size makes memory usage predictable

Disadvantages:
- Fixed Size: Cannot easily resize (in many languages)
- Slow Insertion/Deletion: O(n) time, requires shifting
- Memory Waste: If array is larger than needed, memory is wasted
- No Dynamic Growth: Cannot add elements beyond initial size easily

When to Use Arrays:
- When you know the size in advance
- When you need fast random access
- When you're doing mostly read operations
- For implementing other data structures (stacks, queues, etc.)`,
        codeExample: `// Arrays are perfect for:
// 1. Storing fixed-size collections
int scores[10];  // Store 10 test scores

// 2. Lookup tables
char grades[5] = {'A', 'B', 'C', 'D', 'F'};
char grade = grades[scoreIndex];  // Fast lookup

// 3. Implementing other structures
int stack[100];
int top = -1;

void push(int value) {
    stack[++top] = value;  // Using array as stack
}`,
        visualDescription: 'Visual: A comparison chart showing arrays vs other data structures, highlighting speed of access but limitations in flexibility.'
      },
      {
        heading: 'Real-World Applications',
        content: `Arrays are everywhere in programming! Here are some common use cases:

1. Image Processing
- Pixels in an image are stored as arrays
- Each pixel has RGB values stored in a 2D array structure

2. Game Development
- Player inventory stored as arrays
- High scores maintained in arrays
- Game boards represented as 2D arrays (like chess board)

3. Data Analysis
- Temperature readings stored daily in arrays
- Stock prices tracked over time in arrays

4. System Programming
- Buffer management uses arrays
- Memory allocation relies on array structures
- Process scheduling queues implemented with arrays

5. Algorithm Implementation
- Sorting algorithms work on arrays
- Dynamic programming uses arrays for memoization
- Graph representations use adjacency matrices (2D arrays)`,
        codeExample: `// Real-world example: Temperature tracking

float temperatures[7];  // Store weekly temperatures

// Input temperatures
for (int i = 0; i < 7; i++) {
    cin >> temperatures[i];
}

// Calculate average
float sum = 0;
for (int i = 0; i < 7; i++) {
    sum += temperatures[i];
}
float average = sum / 7;

// Find maximum
float max = temperatures[0];
for (int i = 1; i < 7; i++) {
    if (temperatures[i] > max) {
        max = temperatures[i];
    }
}`,
        visualDescription: 'Visual: Examples of arrays in real applications - image pixels, game boards, data charts, showing how arrays are the foundation of many systems.'
      }
    ],
    keyTakeaways: [
      'Arrays store elements of the same type in contiguous memory locations',
      'Array access by index is O(1) - extremely fast constant time',
      'Arrays have fixed size in most languages, making them memory-efficient but less flexible',
      'Insertion and deletion operations are O(n) because they require shifting elements',
      'Arrays are the foundation for many other data structures and algorithms'
    ]
  },

  // C++ - Variables & Data Types - Introduction to Variables
  'cpp-variables-intro': {
    title: 'Introduction to Variables',
    overview: 'Variables are fundamental building blocks in C++ programming. They act as containers that store data values in memory. Understanding variables is the first step to writing meaningful programs. In this section, you\'ll learn what variables are, how to declare them, and how to use them effectively.',
    sections: [
      {
        heading: 'What are Variables?',
        content: `A variable is a named storage location in memory that holds a value. Think of it like a labeled box where you can store and retrieve information. The name of the variable is like the label on the box, and the value is what's inside.

Key Concepts:
- Variables have a name (identifier) that you use to access them
- Variables have a data type that determines what kind of data they can store
- Variables must be declared before they can be used
- Variables can be assigned values that can be changed later

Why Variables Matter:
Variables allow programs to store and manipulate data dynamically. Without variables, programs would be static and unable to process different inputs or maintain state.`,
        codeExample: `// Basic variable declaration and usage

int age;           // Declare an integer variable named 'age'
age = 25;          // Assign value 25 to age

int score = 100;   // Declare and initialize in one line

// Using variables in expressions
int total = age + score;  // total = 125

// Displaying variable values
cout << "Age: " << age << endl;
cout << "Score: " << score << endl;
cout << "Total: " << total << endl;`,
        visualDescription: 'Visual: Imagine memory as a grid of boxes. Each variable is a labeled box (age, score, total) that can hold a value. When you use the variable name, you access the value in that box.'
      },
      {
        heading: 'Variable Naming Rules',
        content: `C++ has specific rules for naming variables. Following these rules ensures your code compiles correctly and is readable.

Naming Rules:
- Must start with a letter or underscore
- Can contain letters, digits, and underscores
- Cannot use C++ keywords (like int, if, for, etc.)
- Case-sensitive (age and Age are different)
- No spaces or special characters (except underscore)

Best Practices:
- Use meaningful names that describe the variable's purpose
- Use camelCase or snake_case consistently
- Avoid single-letter names except for loop counters
- Start variable names with lowercase letters`,
        codeExample: `// Valid variable names
int age;
int userAge;
int user_age;
int _count;
int totalScore;
int numberOfStudents;

// Invalid variable names
// int 2age;        // Cannot start with digit
// int user age;    // Cannot have spaces
// int user-age;    // Cannot use hyphens
// int int;         // Cannot use keyword
// int return;      // Cannot use keyword

// Good naming examples
int studentCount;      // Clear and descriptive
int maxTemperature;    // Describes purpose
int totalRevenue;      // Meaningful name`,
        visualDescription: 'Visual: A diagram showing valid variable names (green checkmarks) and invalid names (red X marks) with explanations for each rule.'
      },
      {
        heading: 'Variable Declaration and Initialization',
        content: `In C++, you must declare a variable before using it. Declaration tells the compiler about the variable's name and type. Initialization assigns an initial value to the variable.

Declaration:
- Syntax: data_type variable_name;
- Creates the variable but doesn't assign a value
- Uninitialized variables contain garbage values

Initialization:
- Syntax: data_type variable_name = value;
- Declares and assigns a value in one step
- Ensures variable has a known value from the start

Multiple Declarations:
- You can declare multiple variables of the same type in one statement
- Each variable can be initialized separately`,
        codeExample: `// Declaration only
int x;              // Declared but not initialized (contains garbage)
int y;              // Another declaration

// Declaration with initialization
int age = 25;       // Declared and initialized
int score = 100;    // Another initialized variable

// Multiple declarations
int a, b, c;        // Three variables declared
int p = 10, q = 20; // Two variables declared and initialized

// Using variables
x = 5;              // Now x has value 5
y = x + 10;         // y = 15

cout << "x = " << x << endl;  // Output: x = 5
cout << "y = " << y << endl;  // Output: y = 15`,
        visualDescription: 'Visual: Memory diagram showing variables being declared (empty boxes) and then initialized (boxes with values). Arrows show the assignment process.'
      },
      {
        heading: 'Variable Scope',
        content: `Variable scope determines where in your program a variable can be accessed. Understanding scope prevents errors and helps organize your code.

Local Scope:
- Variables declared inside a function or block
- Only accessible within that function or block
- Destroyed when the block ends

Global Scope:
- Variables declared outside all functions
- Accessible from anywhere in the program
- Exist for the entire program lifetime

Best Practice:
- Prefer local variables over global ones
- Keep variable scope as small as possible
- This makes code easier to understand and debug`,
        codeExample: `// Global variable
int globalVar = 100;  // Accessible everywhere

void myFunction() {
    // Local variable
    int localVar = 50;  // Only accessible in this function
    
    cout << globalVar << endl;  // Can access global
    cout << localVar << endl;   // Can access local
}

int main() {
    int mainVar = 200;  // Local to main
    
    cout << globalVar << endl;  // Can access global
    // cout << localVar << endl;  // ERROR! Not accessible here
    cout << mainVar << endl;    // Can access local
    
    return 0;
}`,
        visualDescription: 'Visual: A diagram showing different scopes as nested boxes. Global scope is the outer box, function scopes are inner boxes. Variables are shown only in their accessible scope.'
      }
    ],
    keyTakeaways: [
      'Variables are named storage locations that hold values in memory',
      'Variables must be declared with a data type before use',
      'Variable names must follow C++ naming rules and conventions',
      'Variables can be declared and initialized separately or together',
      'Understanding variable scope helps prevent errors and organize code'
    ]
  },

  // Java - Java Basics - Hello World
  'java-basics-hello-world': {
    title: 'Hello World - Your First Java Program',
    overview: 'The "Hello World" program is the traditional first program when learning any programming language. It introduces you to the basic structure of a Java program, how to compile and run code, and the fundamental syntax. This is your gateway into Java programming.',
    sections: [
      {
        heading: 'Understanding the Hello World Program',
        content: `Let's break down a simple Hello World program to understand Java's basic structure. Every Java program follows a similar pattern that you'll use throughout your programming journey.

Program Structure:
- Every Java program must have at least one class
- The class name must match the filename
- The main method is the entry point of the program
- System.out.println() is used to display output

Key Components:
- public class: Defines a class accessible from anywhere
- public static void main: The starting point of execution
- String[] args: Command-line arguments (optional)
- System.out.println: Prints text to the console`,
        codeExample: `// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Output:
// Hello, World!`,
        visualDescription: 'Visual: A flowchart showing program execution starting from main method, executing the println statement, and displaying output on the console.'
      },
      {
        heading: 'Compiling and Running Java Programs',
        content: `Java is a compiled language, meaning you must compile your source code before running it. Understanding this process is crucial for Java development.

Compilation Process:
1. Write source code in a .java file
2. Compile using javac command: javac HelloWorld.java
3. This creates a .class file (bytecode)
4. Run using java command: java HelloWorld

Key Points:
- javac compiles Java source code to bytecode
- java runs the bytecode on the Java Virtual Machine (JVM)
- The .class file contains platform-independent bytecode
- JVM interprets bytecode for your specific platform`,
        codeExample: `// Step 1: Write HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Step 2: Compile (in terminal/command prompt)
// javac HelloWorld.java
// This creates HelloWorld.class

// Step 3: Run (in terminal/command prompt)
// java HelloWorld
// Output: Hello, World!

// Note: No .class extension when running`,
        visualDescription: 'Visual: A diagram showing the compilation process: .java file → javac compiler → .class bytecode → JVM → execution and output.'
      },
      {
        heading: 'Understanding Java Syntax',
        content: `Java has specific syntax rules that must be followed. Learning these rules early will help you write correct code and understand error messages.

Syntax Rules:
- Statements end with semicolons
- Code blocks use curly braces
- Class names start with uppercase (convention)
- Method names start with lowercase (convention)
- Java is case-sensitive
- Indentation improves readability (not required but recommended)

Common Syntax Elements:
- Comments: // for single-line, /* */ for multi-line
- String literals: Enclosed in double quotes
- Method calls: object.methodName()
- Package declaration: package name; (optional)`,
        codeExample: `// Single-line comment
/* Multi-line
   comment */

public class SyntaxExample {
    // Method declaration
    public static void main(String[] args) {
        // Statement ending with semicolon
        System.out.println("Hello");
        
        // Multiple statements
        System.out.println("World");
        System.out.println("Java");
        
        // Code block with braces
        if (true) {
            System.out.println("Inside block");
        }
    }
}`,
        visualDescription: 'Visual: An annotated code example highlighting different syntax elements: comments, braces, semicolons, method calls, with color-coded explanations.'
      },
      {
        heading: 'Common Errors and How to Fix Them',
        content: `As a beginner, you'll encounter common errors. Understanding these errors helps you debug your code quickly.

Common Errors:
1. Missing semicolon: Statements must end with ;
2. Mismatched braces: Every { must have a matching }
3. Class name mismatch: Class name must match filename
4. Case sensitivity: Java is case-sensitive (Main ≠ main)
5. Missing main method: Program must have main method

Error Messages:
- Compile-time errors: Found during compilation
- Runtime errors: Found when program runs
- Logical errors: Program runs but produces wrong output`,
        codeExample: `// ERROR 1: Missing semicolon
public class ErrorExample {
    public static void main(String[] args) {
        System.out.println("Hello")  // Missing semicolon
    }
}
// Error: ';' expected

// ERROR 2: Mismatched braces
public class ErrorExample {
    public static void main(String[] args) {
        System.out.println("Hello");
    // Missing closing brace
// Error: '}' expected

// CORRECT VERSION:
public class ErrorExample {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`,
        visualDescription: 'Visual: Side-by-side comparison showing incorrect code with error indicators (red X marks) and correct code with checkmarks, highlighting the fixes.'
      }
    ],
    keyTakeaways: [
      'Every Java program must have a class with a main method',
      'Java source code is compiled to bytecode before execution',
      'The main method is the entry point where program execution begins',
      'System.out.println() is used to display output to the console',
      'Understanding common syntax errors helps in debugging code'
    ]
  },

  // Python - Python Basics - Python Syntax
  'python-basics-syntax': {
    title: 'Python Syntax Fundamentals',
    overview: 'Python is known for its clean and readable syntax. Unlike many languages, Python uses indentation to define code blocks, making it visually intuitive. This section introduces you to Python\'s unique syntax features and how to write your first Python programs.',
    sections: [
      {
        heading: 'Python\'s Unique Syntax Features',
        content: `Python stands out from other programming languages with its emphasis on readability and simplicity. Understanding Python's syntax philosophy will help you write better code.

Key Features:
- Indentation-based blocks (no braces required)
- Dynamic typing (no need to declare variable types)
- Simple and readable syntax
- Minimal punctuation required
- Clear and expressive code structure

Python Philosophy:
- Code should be readable and beautiful
- Simple is better than complex
- Readability counts
- There should be one obvious way to do things`,
        codeExample: `# Python's clean syntax

# Simple print statement
print("Hello, World!")

# Variables (no type declaration needed)
name = "Python"
age = 30
height = 5.9

# Indentation defines blocks (no braces)
if age > 18:
    print("Adult")
    print("Can vote")
else:
    print("Minor")

# Functions are simple
def greet(name):
    print(f"Hello, {name}!")

greet("World")`,
        visualDescription: 'Visual: A comparison diagram showing Python syntax (clean, indented) vs other languages (with braces), highlighting Python\'s simplicity.'
      },
      {
        heading: 'Indentation and Code Blocks',
        content: `Python uses indentation (whitespace) to define code blocks instead of braces or keywords. This is one of Python's most distinctive features.

Indentation Rules:
- Use consistent indentation (spaces or tabs, but not both)
- Standard is 4 spaces per indentation level
- Indentation determines which code belongs to which block
- Incorrect indentation causes IndentationError

Code Blocks:
- if/else statements
- for/while loops
- function definitions
- class definitions
- try/except blocks

Best Practice:
- Always use 4 spaces for indentation
- Configure your editor to use spaces, not tabs`,
        codeExample: `# Correct indentation
if True:
    print("This is indented")
    print("Same level")
    if False:
        print("Nested block")
        print("More indented")
    print("Back to first level")

# Incorrect indentation (will cause error)
# if True:
# print("Not indented")  # ERROR!

# Function with proper indentation
def calculate_sum(a, b):
    result = a + b
    return result

# Loop with proper indentation
for i in range(5):
    print(i)
    if i == 2:
        print("Found 2!")`,
        visualDescription: 'Visual: A diagram showing code blocks with different indentation levels, color-coded to show which statements belong to which block.'
      },
      {
        heading: 'Comments and Documentation',
        content: `Comments help explain your code to others (and yourself). Python supports several ways to add comments and documentation.

Single-line Comments:
- Start with # symbol
- Everything after # on that line is ignored
- Used for short explanations

Multi-line Comments:
- Use triple quotes (""" or ''')
- Can span multiple lines
- Often used for documentation strings (docstrings)

Docstrings:
- Special comments that document functions/classes
- Placed immediately after definition
- Accessible via .__doc__ attribute
- Used by help() function`,
        codeExample: `# This is a single-line comment
name = "Python"  # Inline comment

# Multi-line comment using #
# This explains
# multiple lines
# of code

"""
This is a multi-line string
that can be used as a comment
or documentation
"""

def greet(name):
    """
    This is a docstring - documents the function
    
    Parameters:
    name (str): The name to greet
    
    Returns:
    None: Prints a greeting
    """
    print(f"Hello, {name}!")

# Access docstring
print(greet.__doc__)
help(greet)`,
        visualDescription: 'Visual: Code examples with different types of comments highlighted in different colors, showing single-line, multi-line, and docstring comments.'
      },
      {
        heading: 'Running Python Programs',
        content: `Python is an interpreted language, meaning you can run code directly without compilation. Understanding how to run Python programs is essential.

Running Python:
1. Interactive Mode: Type python in terminal, write code directly
2. Script Mode: Save code in .py file, run with python filename.py
3. IDE/Editor: Use integrated development environments

File Execution:
- Save code with .py extension
- Run from terminal: python script.py
- Or use: python3 script.py (on some systems)

Interactive Mode:
- Great for testing and learning
- Immediate feedback
- Type exit() or Ctrl+D to quit`,
        codeExample: `# Save as hello.py
print("Hello, World!")
print("Python is fun!")

# Run in terminal:
# python hello.py
# Output:
# Hello, World!
# Python is fun!

# Interactive mode example:
# $ python
# >>> print("Hello")
# Hello
# >>> name = "Python"
# >>> print(name)
# Python
# >>> exit()`,
        visualDescription: 'Visual: Screenshots/diagrams showing terminal with Python interactive mode, file editor with .py file, and terminal running the script.'
      }
    ],
    keyTakeaways: [
      'Python uses indentation instead of braces to define code blocks',
      'Python syntax emphasizes readability and simplicity',
      'Consistent indentation (4 spaces) is crucial for Python code',
      'Python is interpreted, allowing immediate execution without compilation',
      'Comments and docstrings help document and explain code'
    ]
  },

  // OOPS - Classes & Objects - Class Concept
  'oops-classes-class-concept': {
    title: 'Understanding Classes and Objects',
    overview: 'Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects. Classes are blueprints for creating objects, and objects are instances of classes. This fundamental concept is the foundation of modern software development.',
    sections: [
      {
        heading: 'What is a Class?',
        content: `A class is a blueprint or template for creating objects. Think of it like an architectural blueprint for a house - the blueprint defines the structure, but you need to build actual houses (objects) from it.

Class Definition:
- A class defines attributes (data) and methods (functions)
- It describes what an object will have and what it can do
- Classes are reusable templates
- One class can create many objects

Real-world Analogy:
- Class: Car blueprint
- Object: Your specific car, neighbor's car, etc.
- Attributes: color, model, year
- Methods: start(), stop(), accelerate()`,
        codeExample: `// Class definition (C++ example)
class Car {
    // Attributes (data members)
    string color;
    string model;
    int year;
    
    // Methods (member functions)
    void start() {
        cout << "Car started!" << endl;
    }
    
    void stop() {
        cout << "Car stopped!" << endl;
    }
};

// Creating objects from the class
Car myCar;        // Object 1
Car neighborCar;  // Object 2

// Each object has its own attributes
myCar.color = "Red";
myCar.model = "Toyota";
neighborCar.color = "Blue";
neighborCar.model = "Honda";`,
        visualDescription: 'Visual: A diagram showing a class blueprint (Car) with attributes and methods, and multiple objects (myCar, neighborCar) created from that blueprint, each with different attribute values.'
      },
      {
        heading: 'What is an Object?',
        content: `An object is an instance of a class. It's a concrete realization of the class blueprint, with actual values for its attributes. Objects are the working entities in object-oriented programming.

Object Characteristics:
- Created from a class using the 'new' keyword (in some languages)
- Has its own set of attribute values
- Can call methods defined in its class
- Each object is independent of other objects
- Objects interact with each other through method calls

Object Lifecycle:
1. Creation: Object is instantiated from class
2. Usage: Object's methods are called, attributes accessed
3. Destruction: Object is removed from memory (automatic in many languages)`,
        codeExample: `// Creating objects
Car car1;  // Object 1
Car car2;  // Object 2

// Setting attributes (each object has its own)
car1.color = "Red";
car1.model = "Toyota";
car1.year = 2020;

car2.color = "Blue";
car2.model = "Honda";
car2.year = 2021;

// Calling methods on objects
car1.start();  // Output: Car started!
car2.start();  // Output: Car started!

// Each object maintains its own state
cout << car1.color << endl;  // Output: Red
cout << car2.color << endl;  // Output: Blue`,
        visualDescription: 'Visual: Memory diagram showing multiple objects (car1, car2) in memory, each with its own attribute values, demonstrating that objects are independent instances.'
      },
      {
        heading: 'Class vs Object',
        content: `Understanding the difference between a class and an object is crucial for OOP. They are related but serve different purposes.

Class:
- Template or blueprint
- Defined once
- Doesn't occupy memory for data
- Defines structure and behavior
- Like a cookie cutter

Object:
- Instance of a class
- Created multiple times
- Occupies memory
- Has actual data values
- Like actual cookies made from the cutter

Key Differences:
- Class is abstract (concept), Object is concrete (real)
- Class is defined once, Objects are created many times
- Class has no memory for data, Objects have memory
- Class defines what objects will have, Objects have actual values`,
        codeExample: `// CLASS: Definition (template)
class Student {
    string name;
    int age;
    float gpa;
    
    void study() {
        cout << "Studying..." << endl;
    }
};

// OBJECTS: Instances (actual entities)
Student student1;  // Object 1
Student student2;  // Object 2
Student student3;  // Object 3

// Each object has its own data
student1.name = "Alice";
student1.age = 20;
student1.gpa = 3.8;

student2.name = "Bob";
student2.age = 21;
student2.gpa = 3.5;

// All objects can use class methods
student1.study();  // Alice is studying
student2.study();  // Bob is studying`,
        visualDescription: 'Visual: A side-by-side comparison showing the class definition (abstract template) on the left and multiple objects (concrete instances with data) on the right.'
      },
      {
        heading: 'Benefits of Classes and Objects',
        content: `Object-Oriented Programming provides several advantages that make code more organized, reusable, and maintainable.

Key Benefits:
- Code Reusability: Write a class once, create many objects
- Modularity: Code is organized into logical units
- Encapsulation: Data and methods are bundled together
- Maintainability: Easier to update and fix code
- Real-world Modeling: Programs model real-world entities

Organization:
- Related data and functions are grouped together
- Clear structure and relationships
- Easier to understand and navigate
- Better code organization

Real-world Application:
- Classes model real-world entities (Car, Student, BankAccount)
- Objects represent specific instances
- Methods represent actions these entities can perform`,
        codeExample: `// Example: Bank Account class
class BankAccount {
    string accountNumber;
    double balance;
    
    void deposit(double amount) {
        balance += amount;
        cout << "Deposited: $" << amount << endl;
    }
    
    void withdraw(double amount) {
        if (balance >= amount) {
            balance -= amount;
            cout << "Withdrawn: $" << amount << endl;
        } else {
            cout << "Insufficient funds!" << endl;
        }
    }
    
    void displayBalance() {
        cout << "Balance: $" << balance << endl;
    }
};

// Create multiple accounts (objects)
BankAccount account1;
BankAccount account2;

// Each account is independent
account1.deposit(1000);
account2.deposit(500);
account1.displayBalance();  // Shows account1's balance
account2.displayBalance();  // Shows account2's balance`,
        visualDescription: 'Visual: A diagram showing how classes enable code reuse - one BankAccount class creating multiple account objects, each maintaining its own balance.'
      }
    ],
    keyTakeaways: [
      'A class is a blueprint that defines attributes and methods for objects',
      'An object is an instance of a class with actual data values',
      'One class can create multiple independent objects',
      'Classes promote code reusability and organization',
      'OOP models real-world entities as classes and objects'
    ]
  },

  // DBMS - DBMS Introduction - What is DBMS?
  'dbms-introduction-what-is-dbms': {
    title: 'What is Database Management System (DBMS)?',
    overview: 'A Database Management System (DBMS) is software that manages databases. It provides an interface for storing, retrieving, and managing data efficiently. Understanding DBMS is essential for anyone working with data, from web applications to enterprise systems.',
    sections: [
      {
        heading: 'Introduction to DBMS',
        content: `A Database Management System (DBMS) is software that allows users to create, maintain, and control access to databases. It acts as an intermediary between users and the database, providing a systematic way to manage data.

What is DBMS?
- Software system for managing databases
- Provides tools for data storage, retrieval, and manipulation
- Ensures data integrity and security
- Supports multiple users simultaneously
- Handles data relationships and constraints

Key Components:
- Database: Collection of related data
- DBMS Software: Manages the database
- Users: People or applications that interact with the database
- Hardware: Computers and storage devices`,
        codeExample: `// Conceptual example of DBMS operations

// Creating a database
CREATE DATABASE SchoolDB;

// Creating a table (structure)
CREATE TABLE Students (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    grade VARCHAR(10)
);

// Inserting data
INSERT INTO Students VALUES (1, 'Alice', 20, 'A');
INSERT INTO Students VALUES (2, 'Bob', 19, 'B');

// Retrieving data
SELECT * FROM Students;

// Output:
// id | name  | age | grade
// 1  | Alice | 20  | A
// 2  | Bob   | 19  | B`,
        visualDescription: 'Visual: A diagram showing DBMS as a central system managing a database, with users and applications connecting to it, and data being stored, retrieved, and managed.'
      },
      {
        heading: 'Why Do We Need DBMS?',
        content: `Before DBMS, data was stored in files, which led to many problems. DBMS solves these issues and provides a better way to manage data.

Problems with File System:
- Data redundancy: Same data stored multiple times
- Data inconsistency: Different copies have different values
- Difficult data access: Need to write custom programs
- No data integrity: No enforcement of rules
- Concurrent access issues: Multiple users cause problems
- Security problems: No centralized access control

Benefits of DBMS:
- Data independence: Data separate from applications
- Reduced redundancy: Data stored once
- Data consistency: Single source of truth
- Better security: Access control and authorization
- Concurrent access: Multiple users can work simultaneously
- Data integrity: Rules and constraints enforced`,
        codeExample: `// File System Approach (Problems)
// student1.txt: Alice, 20, A
// student2.txt: Bob, 19, B
// student3.txt: Alice, 20, A+  // Inconsistency!

// DBMS Approach (Solutions)
// Single source of truth
Students Table:
id | name  | age | grade
1  | Alice | 20  | A
2  | Bob   | 19  | B

// Update once, reflects everywhere
UPDATE Students SET grade = 'A+' WHERE id = 1;

// All queries now show consistent data
SELECT * FROM Students WHERE name = 'Alice';
// Always returns: Alice, 20, A+`,
        visualDescription: 'Visual: A comparison diagram showing file system problems (multiple files, redundancy, inconsistency) vs DBMS benefits (single database, consistency, integrity).'
      },
      {
        heading: 'Types of DBMS',
        content: `DBMS can be classified based on how data is organized and stored. Understanding different types helps you choose the right system for your needs.

Relational DBMS (RDBMS):
- Data stored in tables (rows and columns)
- Tables related through keys
- Most common type (MySQL, PostgreSQL, Oracle)
- Uses SQL for queries
- ACID properties for reliability

NoSQL DBMS:
- Non-relational databases
- Flexible data models
- Types: Document, Key-Value, Graph, Column-family
- Good for big data and real-time applications
- Examples: MongoDB, Cassandra, Redis

Hierarchical DBMS:
- Tree-like structure
- Parent-child relationships
- Less common now
- Example: IMS (IBM)

Network DBMS:
- Graph-like structure
- More flexible than hierarchical
- Less common now`,
        codeExample: `// Relational DBMS (RDBMS) Example
// Tables with relationships
Students Table:
id | name  | course_id
1  | Alice | 101
2  | Bob   | 102

Courses Table:
id | name
101| Math
102| Science

// Query with JOIN (relationship)
SELECT s.name, c.name 
FROM Students s
JOIN Courses c ON s.course_id = c.id;

// NoSQL Example (Document-based)
{
  "student_id": 1,
  "name": "Alice",
  "courses": ["Math", "Science"],
  "grades": {"Math": "A", "Science": "B"}
}`,
        visualDescription: 'Visual: Diagrams showing different DBMS types: relational (tables with relationships), NoSQL (document structure), hierarchical (tree structure), with examples.'
      },
      {
        heading: 'DBMS Architecture',
        content: `DBMS architecture defines how users interact with the database system. Understanding architecture helps you work effectively with databases.

Three-Tier Architecture:
1. Presentation Layer: User interface (web browser, mobile app)
2. Application Layer: Business logic and processing
3. Database Layer: DBMS and actual data storage

Two-Tier Architecture:
- Client directly connects to database
- Simpler but less scalable
- Good for small applications

Key Components:
- Query Processor: Processes SQL queries
- Storage Manager: Manages data storage
- Transaction Manager: Handles transactions
- Buffer Manager: Manages memory
- Security Manager: Handles authentication`,
        codeExample: `// Three-Tier Architecture Flow

// Tier 1: Presentation (Browser)
User clicks "View Students"

// Tier 2: Application (Server)
function getStudents() {
    // Business logic
    const query = "SELECT * FROM Students";
    return db.execute(query);
}

// Tier 3: Database (DBMS)
// Executes query, returns results
SELECT * FROM Students;

// Results flow back:
// Database → Application → Presentation → User`,
        visualDescription: 'Visual: Architecture diagram showing three tiers (Presentation, Application, Database) with data flow arrows, and key DBMS components (Query Processor, Storage Manager, etc.).'
      }
    ],
    keyTakeaways: [
      'DBMS is software that manages databases and provides data access',
      'DBMS solves problems of data redundancy, inconsistency, and security',
      'Relational DBMS (RDBMS) is the most common type, using tables and SQL',
      'DBMS provides data independence, integrity, and concurrent access',
      'Understanding DBMS architecture helps in effective database design'
    ]
  }
}

/**
 * Get theory content for a specific subject, unit, and subtopic
 * Handles both subtopic names and IDs
 */
export function getTheoryForSubtopic(
  subject: string,
  unit: string,
  subtopic: string
): TheoryContent | null {
  // Normalize keys: convert to lowercase and replace spaces/special chars
  let normalizedSubject = subject.toLowerCase().replace(/\s+/g, '-')
  let normalizedUnit = unit.toLowerCase().replace(/\s+/g, '-')
  let normalizedSubtopic = subtopic.toLowerCase().replace(/\s+/g, '-').replace(/[?.,!;:]/g, '') // Remove punctuation
  
  // Handle subject name variations
  if (normalizedSubject.includes('data-structures') || normalizedSubject.includes('dsa')) {
    normalizedSubject = 'dsa'
  }
  
  // Handle subject name variations
  if (normalizedSubject.includes('c++') || normalizedSubject.includes('cpp') || normalizedSubject === 'c-fundamentals') {
    normalizedSubject = 'cpp'
  }
  if (normalizedSubject.includes('object-oriented') || normalizedSubject.includes('oops') || normalizedSubject.includes('oop')) {
    normalizedSubject = 'oops'
  }
  if (normalizedSubject.includes('database') || normalizedSubject.includes('dbms')) {
    normalizedSubject = 'dbms'
  }
  
  // Handle unit name variations - remove subject prefix if present
  if (normalizedUnit.startsWith('dbms-')) {
    normalizedUnit = normalizedUnit.replace(/^dbms-/, '')
  }
  if (normalizedUnit.startsWith('cpp-') || normalizedUnit.startsWith('c++-') || normalizedUnit.startsWith('c-fundamentals-')) {
    normalizedUnit = normalizedUnit.replace(/^(cpp-|c\+\+-|c-fundamentals-)/, '')
  }
  if (normalizedUnit.startsWith('java-') || normalizedUnit.startsWith('java-basics-')) {
    normalizedUnit = normalizedUnit.replace(/^(java-|java-basics-)/, '')
  }
  if (normalizedUnit.startsWith('python-') || normalizedUnit.startsWith('python-basics-')) {
    normalizedUnit = normalizedUnit.replace(/^(python-|python-basics-)/, '')
  }
  if (normalizedUnit.startsWith('oops-') || normalizedUnit.startsWith('oop-')) {
    normalizedUnit = normalizedUnit.replace(/^(oops-|oop-)/, '')
  }
  
  // Handle subtopic name variations - map common names to IDs
  const subtopicMappings: Record<string, string> = {
    'introduction-to-arrays': 'intro',
    'introduction': 'intro',
    'intro': 'intro',
    'array-operations': 'operations',
    'operations': 'operations',
    'searching-in-arrays': 'searching',
    'searching': 'searching',
    'sorting-arrays': 'sorting',
    'sorting': 'sorting',
    'introduction-to-variables': 'intro',
    'hello-world': 'hello-world',
    'python-syntax': 'syntax',
    'syntax': 'syntax',
    'class-concept': 'class-concept',
    'what-is-dbms': 'what-is-dbms',
    'what-is-dbms?': 'what-is-dbms'
  }
  
  // Try to map the subtopic name to an ID
  if (subtopicMappings[normalizedSubtopic]) {
    normalizedSubtopic = subtopicMappings[normalizedSubtopic]
  }
  
  // Try with the mapped ID first
  let key = `${normalizedSubject}-${normalizedUnit}-${normalizedSubtopic}` as TheoryKey
  let theory = theoryDatabase[key]
  
  // If not found, try with the original normalized name (without mapping)
  if (!theory) {
    const originalSubtopic = subtopic.toLowerCase().replace(/\s+/g, '-').replace(/[?.,!;:]/g, '')
    key = `${normalizedSubject}-${normalizedUnit}-${originalSubtopic}` as TheoryKey
    theory = theoryDatabase[key]
  }
  
  // If still not found, try alternative unit names
  if (!theory) {
    // Try with "variables" instead of "variables-data-types"
    if (normalizedUnit.includes('variables')) {
      const altUnit = 'variables'
      key = `${normalizedSubject}-${altUnit}-${normalizedSubtopic}` as TheoryKey
      theory = theoryDatabase[key]
    }
    // Try with "basics" instead of "java-basics" or "python-basics"
    if (!theory && (normalizedUnit.includes('basics') || normalizedUnit === 'basics')) {
      const altUnit = 'basics'
      key = `${normalizedSubject}-${altUnit}-${normalizedSubtopic}` as TheoryKey
      theory = theoryDatabase[key]
    }
  }
  
  return theory || null
}

/**
 * Check if theory exists for a subtopic
 */
export function hasTheoryForSubtopic(
  subject: string,
  unit: string,
  subtopic: string
): boolean {
  return getTheoryForSubtopic(subject, unit, subtopic) !== null
}

/**
 * Get all available theory topics
 */
export function getAllTheoryTopics(): Array<{ subject: string; unit: string; subtopic: string }> {
  return Object.keys(theoryDatabase).map(key => {
    const parts = key.split('-')
    return {
      subject: parts[0],
      unit: parts[1],
      subtopic: parts.slice(2).join('-')
    }
  })
}

