const orinCommandData = {

    "Core Language": {
        description:
            "Core Orin syntax available without importing a library.",

        commands: [
            {
                name: "import",
                syntax: "import <module>;",
                description:
                    "Imports an Orin standard-library module, project file or project folder.",
                example:
                    "import mathematics.basic;"
            },
            {
                name: "import folder",
                syntax: "import <folder>;",
                description:
                    "Imports every direct module or Orin file inside a folder.",
                example:
                    "import mathematics;"
            },
            {
                name: "create",
                syntax: "create <type> <name> = <value>;",
                description:
                    "Creates a typed variable.",
                example:
                    "create integer age = 18;"
            },
            {
                name: "create object",
                syntax: "create <module> <name>;",
                description:
                    "Creates an object reference to an imported module.",
                example:
                    "create terminal.access termAccess;"
            },
            {
                name: "assignment",
                syntax: "<name> = <expression>;",
                description:
                    "Changes the value of an existing variable while keeping its declared type.",
                example:
                    "x = x + 1;"
            },
            {
                name: "define function",
                syntax: "define function <name>(<parameters>) {",
                description:
                    "Defines a user function. Parameters may optionally have built-in or user-defined Orin types.",
                example:
                    "define function addNumbers(integer a, integer b) {\n    return a + b;\n}"
            },
            {
                name: "return",
                syntax: "return <expression>;",
                description:
                    "Returns a value from a user-defined function.",
                example:
                    "return value;"
            },
            {
                name: "return",
                syntax: "return;",
                description:
                    "Ends a user-defined function without returning a value.",
                example:
                    "return;"
            },
            {
                name: "addition",
                syntax: "<a> + <b>",
                description:
                    "Adds two values. Numeric values are added and strings may be joined.",
                example:
                    "x = x + 1;"
            },
            {
                name: "subtraction",
                syntax: "<a> - <b>",
                description:
                    "Subtracts the second number from the first.",
                example:
                    "x = x - 1;"
            },
            {
                name: "multiplication",
                syntax: "<a> * <b>",
                description:
                    "Multiplies two numbers.",
                example:
                    "x = x * 2;"
            },
            {
                name: "division",
                syntax: "<a> / <b>",
                description:
                    "Divides the first number by the second.",
                example:
                    "x = x / 2;"
            },
            {
                name: "remainder",
                syntax: "<a> % <b>",
                description:
                    "Returns the remainder after division.",
                example:
                    "x = x % 2;"
            }
        ]
    },


    "Objects": {
        description:
            "Built-in syntax for defining custom object types with fields, constructors and methods. No import is required.",

        commands: [
            {
                name: "define object",
                syntax: "define object <name> {",
                description:
                    "Defines a new user-created object type.",
                example:
                    "define object Person {\n    create private string name;\n}"
            },
            {
                name: "private field",
                syntax: "create private <type> <name>;",
                description:
                    "Creates a field that can only be accessed from inside the object.",
                example:
                    "create private integer age;"
            },
            {
                name: "public field",
                syntax: "create public <type> <name>;",
                description:
                    "Creates a field that can be read or changed from outside the object.",
                example:
                    "create public string label;"
            },
            {
                name: "constructor",
                syntax: "constructor(<parameters>) {",
                description:
                    "Defines how a new instance of the object is initialised. An object may have one constructor.",
                example:
                    "constructor(string name, integer age) {\n    this.name = name;\n    this.age = age;\n}"
            },
            {
                name: "object method",
                syntax: "define function <name>(<parameters>) {",
                description:
                    "Defines a method belonging to the object.",
                example:
                    "define function getAge() {\n    return this.age;\n}"
            },
            {
                name: "this",
                syntax: "this.<field>",
                description:
                    "Refers to the current object from inside its constructor or methods.",
                example:
                    "this.age"
            },
            {
                name: "field assignment",
                syntax: "this.<field> = <expression>;",
                description:
                    "Changes a field on the current object.",
                example:
                    "this.age = age;"
            },
            {
                name: "create object instance",
                syntax: "create <ObjectType> <name> = <ObjectType>(<arguments>);",
                description:
                    "Creates an instance of a user-defined object and runs its constructor.",
                example:
                    "create Person person = Person(\"name1\", 18);"
            },
            {
                name: "call object method",
                syntax: "<object>.<method>(<arguments>)",
                description:
                    "Calls a method defined by a user-created object type.",
                example:
                    "person.getAge()"
            },
            {
                name: "read public field",
                syntax: "<object>.<field>",
                description:
                    "Reads a public field from a user-defined object.",
                example:
                    "person.label"
            },
            {
                name: "set public field",
                syntax: "<object>.<field> = <expression>;",
                description:
                    "Changes a public field on a user-defined object.",
                example:
                    "test.value = 20;"
            }
        ]
    },


    "Control Flow": {
        description:
            "Built-in Orin conditions and loops. These do not require an import.",

        commands: [
            {
                name: "if",
                syntax: "if(<condition>){",
                description:
                    "Runs a block when its condition evaluates to true.",
                example:
                    "if(x == 5){\n    println(\"five\");\n}"
            },
            {
                name: "else if",
                syntax: "else if(<condition>){",
                description:
                    "Tests another condition when the preceding if or else-if condition was false.",
                example:
                    "else if(x > 5){\n    println(\"large\");\n}"
            },
            {
                name: "else",
                syntax: "else{",
                description:
                    "Runs when none of the preceding conditions in the chain were true.",
                example:
                    "else{\n    println(\"other\");\n}"
            },
            {
                name: "while",
                syntax: "while(<condition>){",
                description:
                    "Repeats a block while its condition remains true.",
                example:
                    "while(x < 5){\n    println(x);\n    x = x + 1;\n}"
            },
            {
                name: "repeat",
                syntax: "repeat(<count>){",
                description:
                    "Repeats a block a fixed number of times.",
                example:
                    "repeat(3){\n    println(\"Hello\");\n}"
            },
            {
                name: "for",
                syntax: "for(<initialiser>; <condition>; <update>){",
                description:
                    "Runs an initialiser, checks a condition before each iteration and runs an update afterwards.",
                example:
                    "for(create integer i = 0; i < 5; i = i + 1){\n    println(i);\n}"
            },
            {
                name: "equal",
                syntax: "<a> == <b>",
                description:
                    "Checks whether two values are equal.",
                example:
                    "if(x == 5){"
            },
            {
                name: "not equal",
                syntax: "<a> != <b>",
                description:
                    "Checks whether two values are not equal.",
                example:
                    "if(x != 5){"
            },
            {
                name: "greater than",
                syntax: "<a> > <b>",
                description:
                    "Checks whether the first value is greater than the second.",
                example:
                    "if(x > 5){"
            },
            {
                name: "less than",
                syntax: "<a> < <b>",
                description:
                    "Checks whether the first value is less than the second.",
                example:
                    "if(x < 5){"
            },
            {
                name: "greater than or equal",
                syntax: "<a> >= <b>",
                description:
                    "Checks whether the first value is greater than or equal to the second.",
                example:
                    "if(x >= 5){"
            },
            {
                name: "less than or equal",
                syntax: "<a> <= <b>",
                description:
                    "Checks whether the first value is less than or equal to the second.",
                example:
                    "if(x <= 5){"
            },
            {
                name: "not",
                syntax: "!<condition>",
                description:
                    "Reverses a boolean condition.",
                example:
                    "if(!active){"
            },
            {
                name: "and",
                syntax: "<condition> & <condition>",
                description:
                    "Requires both conditions to be true. Orin uses a single ampersand.",
                example:
                    "if(active & ready){"
            },
            {
                name: "or",
                syntax: "<condition> | <condition>",
                description:
                    "Requires at least one condition to be true. Orin uses a single vertical bar.",
                example:
                    "if(admin | owner){"
            },
            {
                name: "break",
                syntax: "break;",
                description:
                    "Immediately exits the nearest loop or switch block.",
                example:
                    "break;"
            },
            {
                name: "continue",
                syntax: "continue;",
                description:
                    "Skips the rest of the current loop iteration and continues with the next iteration.",
                example:
                    "continue;"
            },
            {
                name: "switch",
                syntax: "switch(<expression>){",
                description:
                    "Selects a block to run by comparing an expression against case values.",
                example:
                    "switch(number){\n    case 1 {\n        println(\"one\");\n        break;\n    }\n}"
            },
            {
                name: "case",
                syntax: "case <value> {",
                description:
                    "Defines a value that can be matched inside a switch statement.",
                example:
                    "case 2 {\n    println(\"two\");\n    break;\n}"
            },
            {
                name: "default",
                syntax: "default {",
                description:
                    "Runs when no case in a switch statement matches.",
                example:
                    "default {\n    println(\"other\");\n}"
            },
            {
                name: "try",
                syntax: "try {",
                description:
                    "Runs a block that may produce an error.",
                example:
                    "try {\n    throw \"Something went wrong\";\n}"
            },
            {
                name: "catch",
                syntax: "catch(<errorName>) {",
                description:
                    "Runs when an error occurs in the preceding try block and stores the caught error in a local variable.",
                example:
                    "catch(error) {\n    println(error);\n}"
            },
            {
                name: "finally",
                syntax: "finally {",
                description:
                    "Runs after a try block regardless of whether an error occurred.",
                example:
                    "finally {\n    println(\"Finished\");\n}"
            },
            {
                name: "throw",
                syntax: "throw <expression>;",
                description:
                    "Creates an error that can be caught by a surrounding catch block.",
                example:
                    "throw \"Invalid value\";"
            }
        ]
    },


    "integer": {
        description:
            "Built-in whole-number type. No import is required.",

        commands: [
            {
                name: "create integer",
                syntax: "create integer <name> = <value>;",
                description:
                    "Creates an integer variable.",
                example:
                    "create integer age = 18;"
            },
            {
                name: "getValue",
                syntax: "<integer>.getValue()",
                description:
                    "Returns the raw value stored in an integer.",
                example:
                    "age.getValue()"
            },
            {
                name: "compare",
                syntax: "<integer>.compare(<value>)",
                description:
                    "Compares the integer with another numeric value.",
                example:
                    "age.compare(18)"
            }
        ]
    },


    "double": {
        description:
            "Built-in decimal-number type. No import is required.",

        commands: [
            {
                name: "create double",
                syntax: "create double <name> = <value>;",
                description:
                    "Creates a double variable.",
                example:
                    "create double price = 12.5;"
            },
            {
                name: "getValue",
                syntax: "<double>.getValue()",
                description:
                    "Returns the raw value stored in a double.",
                example:
                    "price.getValue()"
            },
            {
                name: "compare",
                syntax: "<double>.compare(<value>)",
                description:
                    "Compares the double with another numeric value.",
                example:
                    "price.compare(10.0)"
            }
        ]
    },


    "string": {
        description:
            "Built-in text type. No import is required.",

        commands: [
            {
                name: "create string",
                syntax: "create string <name> = <value>;",
                description:
                    "Creates a string variable.",
                example:
                    "create string name = \"name\";"
            },
            {
                name: "getValue",
                syntax: "<string>.getValue()",
                description:
                    "Returns the raw text stored in a string.",
                example:
                    "name.getValue()"
            },
            {
                name: "toString",
                syntax: "<string>.toString()",
                description:
                    "Returns the string representation of the value.",
                example:
                    "name.toString()"
            }
        ]
    },


    "boolean": {
        description:
            "Built-in true/false type. No import is required.",

        commands: [
            {
                name: "create boolean",
                syntax: "create boolean <name> = <value>;",
                description:
                    "Creates a boolean variable.",
                example:
                    "create boolean active = true;"
            },
            {
                name: "getValue",
                syntax: "<boolean>.getValue()",
                description:
                    "Returns the raw boolean value.",
                example:
                    "active.getValue()"
            },
            {
                name: "toString",
                syntax: "<boolean>.toString()",
                description:
                    "Returns the boolean as text.",
                example:
                    "active.toString()"
            }
        ]
    },


    "char": {
        description:
            "Built-in single-character type. No import is required.",

        commands: [
            {
                name: "create char",
                syntax: "create char <name> = <value>;",
                description:
                    "Creates a character variable.",
                example:
                    "create char letter = 'A';"
            },
            {
                name: "getValue",
                syntax: "<char>.getValue()",
                description:
                    "Returns the raw character.",
                example:
                    "letter.getValue()"
            },
            {
                name: "toString",
                syntax: "<char>.toString()",
                description:
                    "Returns the character as text.",
                example:
                    "letter.toString()"
            }
        ]
    },

    "array": {
        description:
            "Built-in homogeneous array type. Arrays store values of one element type.",

        commands: [
            {
                name: "create array",
                syntax: "create array <name> = <type>[];",
                description:
                    "Creates an empty typed array.",
                example:
                    "create array numbers = integer[];"
            },
            {
                name: "getValue",
                syntax: "<array>.getValue()",
                description:
                    "Returns the raw values stored in the array.",
                example:
                    "numbers.getValue()"
            },
            {
                name: "getType",
                syntax: "<array>.getType()",
                description:
                    "Returns the element type of the array.",
                example:
                    "numbers.getType()"
            },
            {
                name: "get",
                syntax: "<array>.get(<index>)",
                description:
                    "Returns the value at the specified index.",
                example:
                    "numbers.get(0)"
            },
            {
                name: "set",
                syntax: "<array>.set(<index>, <value>)",
                description:
                    "Replaces the value at an existing index.",
                example:
                    "numbers.set(0, 10);"
            },
            {
                name: "add",
                syntax: "<array>.add(<value>)",
                description:
                    "Adds a value to the end of the array.",
                example:
                    "numbers.add(5);"
            },
            {
                name: "remove",
                syntax: "<array>.remove(<index>)",
                description:
                    "Removes and returns the value at the specified index.",
                example:
                    "numbers.remove(0);"
            },
            {
                name: "length",
                syntax: "<array>.length()",
                description:
                    "Returns the number of values in the array.",
                example:
                    "numbers.length()"
            }
        ]
    },


    "terminal.output": {
        description:
            "Functions for writing to and controlling the terminal.",

        commands: [
            {
                name: "print",
                syntax: "print(<value>)",
                description:
                    "Prints a value without automatically adding a new line.",
                example:
                    "print(\"Hello\");"
            },
            {
                name: "println",
                syntax: "println(<value>)",
                description:
                    "Prints a value followed by a new line.",
                example:
                    "println(\"Hello\");"
            },
            {
                name: "clear",
                syntax: "clear()",
                description:
                    "Clears or resets the terminal session.",
                example:
                    "clear();"
            }
        ]
    },


    "terminal.access": {
        description:
            "Functions for reading typed input from the terminal.",

        commands: [
            {
                name: "getLine",
                syntax: "getLine()",
                description:
                    "Waits for and returns a line of terminal input.",
                example:
                    "create string name = getLine();"
            },
            {
                name: "getInt",
                syntax: "getInt()",
                description:
                    "Waits for and returns an integer entered in the terminal.",
                example:
                    "create integer age = getInt();"
            },
            {
                name: "getDouble",
                syntax: "getDouble()",
                description:
                    "Waits for and returns a decimal number entered in the terminal.",
                example:
                    "create double price = getDouble();"
            },
            {
                name: "getBoolean",
                syntax: "getBoolean()",
                description:
                    "Waits for and returns a boolean entered in the terminal.",
                example:
                    "create boolean active = getBoolean();"
            },
            {
                name: "getChar",
                syntax: "getChar()",
                description:
                    "Waits for and returns a single character entered in the terminal.",
                example:
                    "create char letter = getChar();"
            }
        ]
    },


    "mathematics.basic": {
        description:
            "Basic mathematical operations and calculations",

        commands: [
            {
                name: "mod",
                syntax: "mod(<a>, <b>)",
                description:
                    "Returns the remainder after dividing a by b.",
                example:
                    "mod(10, 3)"
            },
            {
                name: "absolute",
                syntax: "absolute(<value>)",
                description:
                    "Returns the absolute value of a number.",
                example:
                    "absolute(-12)"
            },
            {
                name: "sign",
                syntax: "sign(<value>)",
                description:
                    "Returns -1 for a negative value, 0 for zero, and 1 for a positive value.",
                example:
                    "sign(-8)"
            },
            {
                name: "percentage",
                syntax: "percentage(<value>, <total>)",
                description:
                    "Returns a value as a percentage of a total.",
                example:
                    "percentage(25, 200)"
            },
            {
                name: "percentageChange",
                syntax: "percentageChange(<old>, <current>)",
                description:
                    "Returns the percentage change from an old value to a current value.",
                example:
                    "percentageChange(100, 125)"
            },
            {
                name: "difference",
                syntax: "difference(<a>, <b>)",
                description:
                    "Returns the absolute difference between two values.",
                example:
                    "difference(20, 13)"
            },
            {
                name: "average",
                syntax: "average(<a>, <b>)",
                description:
                    "Returns the arithmetic mean of two values.",
                example:
                    "average(10, 20)"
            },
            {
                name: "reciprocal",
                syntax: "reciprocal(<value>)",
                description:
                    "Returns the reciprocal of a value.",
                example:
                    "reciprocal(4)"
            }
        ]
    },


    "mathematics.power": {
        description:
            "Powers, roots and logarithms.",

        commands: [
            {
                name: "power",
                syntax: "power(<base>, <exponent>)",
                description:
                    "Raises a base to an exponent.",
                example: "power(2, 8)"
            },
            {
                name: "square",
                syntax: "square(<value>)",
                description: "Squares a value.",
                example: "square(5)"
            },
            {
                name: "cube",
                syntax: "cube(<value>)",
                description: "Cubes a value.",
                example: "cube(5)"
            },
            {
                name: "squareRoot",
                syntax: "squareRoot(<value>)",
                description:
                    "Returns the square root of a value.",
                example: "squareRoot(25)"
            },
            {
                name: "cubeRoot",
                syntax: "cubeRoot(<value>)",
                description:
                    "Returns the cube root of a value.",
                example: "cubeRoot(27)"
            },
            {
                name: "root",
                syntax: "root(<base>, <rootValue>)",
                description:
                    "Returns a chosen root of a value.",
                example: "root(16, 4)"
            },
            {
                name: "ln",
                syntax: "ln(<value>)",
                description:
                    "Returns the natural logarithm.",
                example: "ln(10)"
            },
            {
                name: "log2",
                syntax: "log2(<value>)",
                description:
                    "Returns the base-2 logarithm.",
                example: "log2(8)"
            },
            {
                name: "log10",
                syntax: "log10(<value>)",
                description:
                    "Returns the base-10 logarithm.",
                example: "log10(100)"
            },
            {
                name: "log",
                syntax: "log(<value>, <base>)",
                description:
                    "Returns a logarithm using a chosen base.",
                example: "log(8, 2)"
            }
        ]
    },


    "mathematics.round": {
        description:
            "Numeric rounding functions.",

        commands: [
            {
                name: "round",
                syntax: "round(<value>)",
                description:
                    "Rounds a value to the nearest integer.",
                example: "round(4.6)"
            },
            {
                name: "truncate",
                syntax: "truncate(<value>)",
                description:
                    "Removes the decimal part of a value.",
                example: "truncate(4.9)"
            },
            {
                name: "floor",
                syntax: "floor(<value>)",
                description:
                    "Rounds a value downward.",
                example: "floor(4.9)"
            },
            {
                name: "ceiling",
                syntax: "ceiling(<value>)",
                description:
                    "Rounds a value upward.",
                example: "ceiling(4.1)"
            },
            {
                name: "roundTo",
                syntax: "roundTo(<value>, <decimalPlaces>)",
                description:
                    "Rounds a value to a chosen number of decimal places.",
                example: "roundTo(3.14159, 2)"
            }
        ]
    },


    "mathematics.compare": {
        description:
            "Numeric comparison and range functions.",

        commands: [
            {
                name: "minimum",
                syntax: "minimum(<a>, <b>)",
                description:
                    "Returns the smaller of two values.",
                example: "minimum(5, 10)"
            },
            {
                name: "maximum",
                syntax: "maximum(<a>, <b>)",
                description:
                    "Returns the larger of two values.",
                example: "maximum(5, 10)"
            },
            {
                name: "clamp",
                syntax: "clamp(<value>, <minimum>, <maximum>)",
                description:
                    "Restricts a value to a range.",
                example: "clamp(15, 0, 10)"
            },
            {
                name: "between",
                syntax: "between(<value>, <minimum>, <maximum>)",
                description:
                    "Checks whether a value is within a range.",
                example: "between(5, 1, 10)"
            },
            {
                name: "greaterThan",
                syntax: "greaterThan(<a>, <b>)",
                description:
                    "Returns whether a is greater than b.",
                example: "greaterThan(10, 5)"
            },
            {
                name: "greaterThanOrEqual",
                syntax: "greaterThanOrEqual(<a>, <b>)",
                description:
                    "Returns whether a is greater than or equal to b.",
                example: "greaterThanOrEqual(10, 10)"
            },
            {
                name: "lessThan",
                syntax: "lessThan(<a>, <b>)",
                description:
                    "Returns whether a is less than b.",
                example: "lessThan(5, 10)"
            },
            {
                name: "lessThanOrEqual",
                syntax: "lessThanOrEqual(<a>, <b>)",
                description:
                    "Returns whether a is less than or equal to b.",
                example: "lessThanOrEqual(10, 10)"
            }
        ]
    },

    "mathematics.random": {
        description:
            "Random-number functions.",

        commands: [
            {
                name: "random",
                syntax: "random()",
                description:
                    "Returns a random decimal from 0 up to 1.",
                example: "random()"
            },
            {
                name: "randInt",
                syntax: "randInt(<minimum>, <maximum>)",
                description:
                    "Returns a random integer within a range.",
                example: "randInt(1, 10)"
            },
            {
                name: "randDouble",
                syntax: "randDouble(<minimum>, <maximum>)",
                description:
                    "Returns a random decimal within a range.",
                example: "randDouble(1, 10)"
            }
        ]
    },


    "mathematics.trigonometry": {
        description:
            "Trigonometric functions and angle conversion.",

        commands: [
            {
                name: "sin",
                syntax: "sin(<value>)",
                description: "Returns the sine of a value.",
                example: "sin(pi())"
            },
            {
                name: "cos",
                syntax: "cos(<value>)",
                description: "Returns the cosine of a value.",
                example: "cos(0)"
            },
            {
                name: "tan",
                syntax: "tan(<value>)",
                description: "Returns the tangent of a value.",
                example: "tan(1)"
            },
            {
                name: "asin",
                syntax: "asin(<value>)",
                description: "Returns the inverse sine.",
                example: "asin(1)"
            },
            {
                name: "acos",
                syntax: "acos(<value>)",
                description: "Returns the inverse cosine.",
                example: "acos(1)"
            },
            {
                name: "atan",
                syntax: "atan(<value>)",
                description: "Returns the inverse tangent.",
                example: "atan(1)"
            },
            {
                name: "atan2",
                syntax: "atan2(<y>, <x>)",
                description:
                    "Returns an angle using x and y coordinates.",
                example: "atan2(1, 1)"
            },
            {
                name: "degreesToRadians",
                syntax: "degreesToRadians(<degrees>)",
                description:
                    "Converts degrees to radians.",
                example: "degreesToRadians(180)"
            },
            {
                name: "radiansToDegrees",
                syntax: "radiansToDegrees(<radians>)",
                description:
                    "Converts radians to degrees.",
                example: "radiansToDegrees(3.14159)"
            }
        ]
    },


    "mathematics.constants": {
        description:
            "Common mathematical constants.",

        commands: [
            {
                name: "pi",
                syntax: "pi()",
                description: "Returns π.",
                example: "pi()"
            },
            {
                name: "e",
                syntax: "e()",
                description:
                    "Returns Euler's number.",
                example: "e()"
            },
            {
                name: "tau",
                syntax: "tau()",
                description:
                    "Returns two times π.",
                example: "tau()"
            },
            {
                name: "phi",
                syntax: "phi()",
                description:
                    "Returns the golden ratio.",
                example: "phi()"
            }
        ]
    },


    "mathematics.statistics": {
        description:
            "Functions for summarising numerical data.",

        commands: [
            {
                name: "sum",
                syntax: "sum(<values>)",
                description:
                    "Returns the total of the supplied values.",
                example: "sum(numbers)"
            },
            {
                name: "mean",
                syntax: "mean(<values>)",
                description:
                    "Returns the arithmetic mean.",
                example: "mean(numbers)"
            },
            {
                name: "median",
                syntax: "median(<values>)",
                description:
                    "Returns the median.",
                example: "median(numbers)"
            },
            {
                name: "mode",
                syntax: "mode(<values>)",
                description:
                    "Returns the most frequently occurring value.",
                example: "mode(numbers)"
            },
            {
                name: "range",
                syntax: "range(<values>)",
                description:
                    "Returns the difference between the largest and smallest values.",
                example: "range(numbers)"
            },
            {
                name: "variance",
                syntax: "variance(<values>)",
                description:
                    "Returns the variance of the values.",
                example: "variance(numbers)"
            },
            {
                name: "standardDeviation",
                syntax: "standardDeviation(<values>)",
                description:
                    "Returns the standard deviation of the values.",
                example: "standardDeviation(numbers)"
            }
        ]
    },


    "mathematics.numberTheory": {
        description:
            "Integer and number-theory functions.",

        commands: [
            {
                name: "factorial",
                syntax: "factorial(<value>)",
                description:
                    "Returns the factorial of a non-negative integer.",
                example: "factorial(5)"
            },
            {
                name: "isEven",
                syntax: "isEven(<value>)",
                description:
                    "Returns whether an integer is even.",
                example: "isEven(10)"
            },
            {
                name: "isOdd",
                syntax: "isOdd(<value>)",
                description:
                    "Returns whether an integer is odd.",
                example: "isOdd(5)"
            },
            {
                name: "gcd",
                syntax: "gcd(<a>, <b>)",
                description:
                    "Returns the greatest common divisor.",
                example: "gcd(12, 18)"
            },
            {
                name: "lcm",
                syntax: "lcm(<a>, <b>)",
                description:
                    "Returns the least common multiple.",
                example: "lcm(4, 6)"
            },
            {
                name: "isPrime",
                syntax: "isPrime(<value>)",
                description:
                    "Returns whether an integer is prime.",
                example: "isPrime(17)"
            },
            {
                name: "factors",
                syntax: "factors(<value>)",
                description:
                    "Returns the positive factors of an integer.",
                example: "factors(12)"
            },
            {
                name: "primeFactors",
                syntax: "primeFactors(<value>)",
                description:
                    "Returns the prime factors of an integer.",
                example: "primeFactors(12)"
            },
            {
                name: "isPerfectSquare",
                syntax: "isPerfectSquare(<value>)",
                description:
                    "Returns whether an integer is a perfect square.",
                example: "isPerfectSquare(25)"
            },
            {
                name: "isCoprime",
                syntax: "isCoprime(<a>, <b>)",
                description:
                    "Returns whether two integers are coprime.",
                example: "isCoprime(8, 15)"
            },
            {
                name: "isPerfectNumber",
                syntax: "isPerfectNumber(<value>)",
                description:
                    "Returns whether an integer is a perfect number.",
                example: "isPerfectNumber(28)"
            }
        ]
    },

    "mathematics.probability": {
        description:
            "Functions for probability calculations and random probability events.",

        commands: [
            {
                name: "chance",
                syntax: "chance(probability)",
                description:
                    "Returns true with the supplied probability, where probability is between 0 and 1.",
                example:
                    "chance(0.25)"
            },
            {
                name: "percentChance",
                syntax: "percentChance(percent)",
                description:
                    "Returns true with the supplied percentage chance, where percent is between 0 and 100.",
                example:
                    "percentChance(75)"
            },
            {
                name: "coinFlip",
                syntax: "coinFlip()",
                description:
                    "Returns true or false with an equal 50 percent chance.",
                example:
                    "coinFlip()"
            },
            {
                name: "weightedChoice",
                syntax: "weightedChoice(values, weights)",
                description:
                    "Returns a randomly selected value using the supplied relative weights.",
                example:
                    'weightedChoice(["Common", "Rare", "Legendary"], [80, 18, 2])'
            },
            {
                name: "expectedSuccesses",
                syntax: "expectedSuccesses(probability, trials)",
                description:
                    "Returns the expected number of successes across a number of independent trials.",
                example:
                    "expectedSuccesses(0.25, 100)"
            },
            {
                name: "binomialProbability",
                syntax: "binomialProbability(trials, successes, probability)",
                description:
                    "Returns the probability of getting exactly the supplied number of successes across independent trials.",
                example:
                    "binomialProbability(10, 3, 0.5)"
            }
        ]
    },

    "text.general": {
        description:
            "General text manipulation functions.",

        commands: [
            {
                name: "length",
                syntax: "length(<value>)",
                description:
                    "Returns the length of a string.",
                example:
                    "length(\"hello\")"
            },
            {
                name: "upper",
                syntax: "upper(<value>)",
                description:
                    "Converts a string to uppercase.",
                example:
                    "upper(\"hello\")"
            },
            {
                name: "lower",
                syntax: "lower(<value>)",
                description:
                    "Converts a string to lowercase.",
                example:
                    "lower(\"HELLO\")"
            },
            {
                name: "trim",
                syntax: "trim(<value>)",
                description:
                    "Removes whitespace from both ends of a string.",
                example:
                    "trim(\"  hello  \")"
            },
            {
                name: "trimStart",
                syntax: "trimStart(<value>)",
                description:
                    "Removes whitespace from the start of a string.",
                example:
                    "trimStart(\"  hello\")"
            },
            {
                name: "trimEnd",
                syntax: "trimEnd(<value>)",
                description:
                    "Removes whitespace from the end of a string.",
                example:
                    "trimEnd(\"hello  \")"
            },
            {
                name: "contains",
                syntax: "contains(<value>, <search>)",
                description:
                    "Returns whether a string contains another string.",
                example:
                    "contains(\"hello world\", \"world\")"
            },
            {
                name: "startsWith",
                syntax: "startsWith(<value>, <search>)",
                description:
                    "Returns whether a string starts with another string.",
                example:
                    "startsWith(\"hello\", \"he\")"
            },
            {
                name: "endsWith",
                syntax: "endsWith(<value>, <search>)",
                description:
                    "Returns whether a string ends with another string.",
                example:
                    "endsWith(\"hello\", \"lo\")"
            },
            {
                name: "replace",
                syntax: "replace(<value>, <search>, <replacement>)",
                description:
                    "Replaces the first matching piece of text.",
                example:
                    "replace(\"one two one\", \"one\", \"three\")"
            },
            {
                name: "replaceAll",
                syntax: "replaceAll(<value>, <search>, <replacement>)",
                description:
                    "Replaces every matching piece of text.",
                example:
                    "replaceAll(\"one two one\", \"one\", \"three\")"
            },
            {
                name: "substring",
                syntax: "substring(<value>, <start>, <end>)",
                description:
                    "Returns part of a string between two indexes.",
                example:
                    "substring(\"hello\", 0, 2)"
            },
            {
                name: "charAt",
                syntax: "charAt(<value>, <index>)",
                description:
                    "Returns the character at an index.",
                example:
                    "charAt(\"hello\", 1)"
            },
            {
                name: "indexOf",
                syntax: "indexOf(<value>, <search>)",
                description:
                    "Returns the first index of matching text.",
                example:
                    "indexOf(\"hello\", \"l\")"
            },
            {
                name: "lastIndexOf",
                syntax: "lastIndexOf(<value>, <search>)",
                description:
                    "Returns the final index of matching text.",
                example:
                    "lastIndexOf(\"hello\", \"l\")"
            },
            {
                name: "repeat",
                syntax: "repeat(<value>, <count>)",
                description:
                    "Repeats a string a chosen number of times.",
                example:
                    "repeat(\"hi\", 3)"
            }
        ]
    },


    "text.convert": {
        description:
            "Converting between all basic data types",

        commands: [
            {
                name: "toString",
                syntax: "toString(<value>)",
                description:
                    "Converts a value to a string.",
                example:
                    "toString(42)"
            },
            {
                name: "toInteger",
                syntax: "toInteger(<value>)",
                description:
                    "Converts a value to an integer.",
                example:
                    "toInteger(\"42\")"
            },
            {
                name: "toDouble",
                syntax: "toDouble(<value>)",
                description:
                    "Converts a value to a double.",
                example:
                    "toDouble(\"42.5\")"
            },
            {
                name: "toBoolean",
                syntax: "toBoolean(<value>)",
                description:
                    "Converts a value to a boolean.",
                example:
                    "toBoolean(\"true\")"
            },
            {
                name: "toChar",
                syntax: "toChar(<value>)",
                description:
                    "Converts a value to a single character.",
                example:
                    "toChar(\"A\")"
            }
        ]
    },


    "text.split": {
        description:
            "Splitting text into parts and joining values together",

        commands: [
            {
                name: "split",
                syntax: "split(<value>, <separator>)",
                description:
                    "Splits a string into an array using a separator.",
                example:
                    "split(\"one,two,three\", \",\")"
            },
            {
                name: "join",
                syntax: "join(<array>, <separator>)",
                description:
                    "Joins the values in an array into a single string.",
                example:
                    "join(parts, \"-\")"
            },
            {
                name: "lines",
                syntax: "lines(<value>)",
                description:
                    "Splits a string into an array of lines.",
                example:
                    "lines(\"first\\nsecond\\nthird\")"
            },
            {
                name: "words",
                syntax: "words(<value>)",
                description:
                    "Splits a string into an array of words.",
                example:
                    "words(\"hello from orin\")"
            }
        ]
    },

    "text.format": {
        description: "Functions for formatting and transforming text.",
        commands: [
            {
                name: "capitalize",
                syntax: "capitalize(value)",
                description: "Capitalizes the first character of a string.",
                example: 'capitalize("hello")'
            },
            {
                name: "titleCase",
                syntax: "titleCase(value)",
                description: "Capitalizes the first character of each word in a string.",
                example: 'titleCase("hello world")'
            },
            {
                name: "reverse",
                syntax: "reverse(value)",
                description: "Reverses the characters in a string.",
                example: 'reverse("hello")'
            },
            {
                name: "padStart",
                syntax: "padStart(value, padding, times)",
                description: "Adds the padding string to the start of a string a specified number of times.",
                example: 'padStart("Hi", "-", 3)'
            },
            {
                name: "padEnd",
                syntax: "padEnd(value, padding, times)",
                description: "Adds the padding string to the end of a string a specified number of times.",
                example: 'padEnd("Hi", "-", 3)'
            },
            {
                name: "center",
                syntax: "center(value, padding, times)",
                description: "Adds padding around a string, splitting the requested padding amount between the left and right sides.",
                example: 'center("Hi", "-", 5)'
            },
            {
                name: "repeatText",
                syntax: "repeatText(value, times)",
                description: "Repeats a string a specified number of times.",
                example: 'repeatText("Ha", 3)'
            }
        ]
    },

    "time.general": {
        description: "Functions for reading the current date and time.",
        commands: [
            {
                name: "currentDate",
                syntax: "currentDate()",
                description: "Returns the current date in day/month/year format.",
                example: "currentDate()"
            },
            {
                name: "currentTime",
                syntax: "currentTime()",
                description: "Returns the current time in hours:minutes:seconds format.",
                example: "currentTime()"
            },
            {
                name: "currentYear",
                syntax: "currentYear()",
                description: "Returns the current year.",
                example: "currentYear()"
            },
            {
                name: "currentMonth",
                syntax: "currentMonth()",
                description: "Returns the current month as a number from 1 to 12.",
                example: "currentMonth()"
            },
            {
                name: "currentDay",
                syntax: "currentDay()",
                description: "Returns the current day of the month.",
                example: "currentDay()"
            },
            {
                name: "currentHour",
                syntax: "currentHour()",
                description: "Returns the current hour.",
                example: "currentHour()"
            },
            {
                name: "currentMinute",
                syntax: "currentMinute()",
                description: "Returns the current minute.",
                example: "currentMinute()"
            },
            {
                name: "currentSecond",
                syntax: "currentSecond()",
                description: "Returns the current second.",
                example: "currentSecond()"
            },
            {
                name: "getWeekDay",
                syntax: "getWeekDay()",
                description: "Returns the name of the current weekday.",
                example: "getWeekDay()"
            }
        ]
    },

    "time.timer": {
        description: "Functions for measuring elapsed time and pausing execution.",
        commands: [
            {
                name: "startTimer",
                syntax: "startTimer()",
                description: "Starts or resets the timer.",
                example: "startTimer()"
            },
            {
                name: "elapsed",
                syntax: "elapsed()",
                description: "Returns the number of milliseconds elapsed since the timer was started.",
                example: "elapsed()"
            },
            {
                name: "elapsedSeconds",
                syntax: "elapsedSeconds()",
                description: "Returns the number of seconds elapsed since the timer was started.",
                example: "elapsedSeconds()"
            },
            {
                name: "sleep",
                syntax: "sleep(time, units)",
                description: "Pauses execution for a specified amount of time. Units can be 'ms', 'cs', 'ds', or 's'.",
                example: 'sleep(2, "s")'
            }
        ]
    },

    "collections.search": {
        description: "Functions for searching and inspecting arrays.",
        commands: [
            {
                name: "contains",
                syntax: "contains(array, value)",
                description: "Returns true if the array contains the specified value, otherwise false.",
                example: "contains(numbers, 5)"
            },
            {
                name: "findIndex",
                syntax: "findIndex(array, value)",
                description: "Returns the index of the first matching value, or -1 if the value is not found.",
                example: "findIndex(numbers, 5)"
            },
            {
                name: "find",
                syntax: "find(array, value)",
                description: "Returns the first matching value, or null if the value is not found.",
                example: "find(numbers, 5)"
            },
            {
                name: "count",
                syntax: "count(array, value)",
                description: "Returns the number of times a value appears in an array.",
                example: "count(numbers, 5)"
            },
            {
                name: "first",
                syntax: "first(array)",
                description: "Returns the first value in an array, or null if the array is empty.",
                example: "first(numbers)"
            },
            {
                name: "last",
                syntax: "last(array)",
                description: "Returns the last value in an array, or null if the array is empty.",
                example: "last(numbers)"
            }
        ]
    },

    "collections.sort": {
        description: "Functions for sorting, reversing and checking the order of arrays.",
        commands: [
            {
                name: "sortAscending",
                syntax: "sortAscending(array)",
                description: "Returns a new array sorted from smallest to largest without changing the original array.",
                example: "sortAscending(numbers)"
            },
            {
                name: "sortDescending",
                syntax: "sortDescending(array)",
                description: "Returns a new array sorted from largest to smallest without changing the original array.",
                example: "sortDescending(numbers)"
            },
            {
                name: "reverseOrder",
                syntax: "reverseOrder(array)",
                description: "Returns a new array with the elements in the opposite order without changing the original array.",
                example: "reverseOrder(numbers)"
            },
            {
                name: "isSortedAscending",
                syntax: "isSortedAscending(array)",
                description: "Returns true if the array is ordered from smallest to largest.",
                example: "isSortedAscending(numbers)"
            },
            {
                name: "isSortedDescending",
                syntax: "isSortedDescending(array)",
                description: "Returns true if the array is ordered from largest to smallest.",
                example: "isSortedDescending(numbers)"
            }
        ]
    },

    "collections.transform": {
        description: "Functions for copying and transforming arrays.",
        commands: [
            {
                name: "copy",
                syntax: "copy(array)",
                description: "Returns a new copy of the array.",
                example: "copy(numbers)"
            },
            {
                name: "removeDuplicates",
                syntax: "removeDuplicates(array)",
                description: "Returns a new array with duplicate values removed.",
                example: "removeDuplicates(numbers)"
            },
            {
                name: "take",
                syntax: "take(array, amount)",
                description: "Returns a new array containing the first amount values.",
                example: "take(numbers, 3)"
            },
            {
                name: "drop",
                syntax: "drop(array, amount)",
                description: "Returns a new array with the first amount values removed.",
                example: "drop(numbers, 2)"
            },
            {
                name: "slice",
                syntax: "slice(array, start, end)",
                description: "Returns a new array containing values from start up to, but not including, end.",
                example: "slice(numbers, 1, 4)"
            }
        ]
    },

    "data.validation": {
        description:
            "Functions for checking the type of a value.",

        commands: [
            {
                name: "isInteger",
                syntax: "isInteger(value)",
                description:
                    "Returns true if the value is an integer.",
                example:
                    "isInteger(10)"
            },
            {
                name: "isDouble",
                syntax: "isDouble(value)",
                description:
                    "Returns true if the value is a non-integer finite number.",
                example:
                    "isDouble(10.5)"
            },
            {
                name: "isNumber",
                syntax: "isNumber(value)",
                description:
                    "Returns true if the value is a finite number.",
                example:
                    "isNumber(10.5)"
            },
            {
                name: "isString",
                syntax: "isString(value)",
                description:
                    "Returns true if the value is a string.",
                example:
                    "isString(\"Hello\")"
            },
            {
                name: "isBoolean",
                syntax: "isBoolean(value)",
                description:
                    "Returns true if the value is a boolean.",
                example:
                    "isBoolean(true)"
            },
            {
                name: "isChar",
                syntax: "isChar(value)",
                description:
                    "Returns true if the value is a single character.",
                example:
                    "isChar(\"A\")"
            },
            {
                name: "isArray",
                syntax: "isArray(value)",
                description:
                    "Returns true if the value is an array.",
                example:
                    "isArray(numbers)"
            },
            {
                name: "isNull",
                syntax: "isNull(value)",
                description:
                    "Returns true if the value is null.",
                example:
                    "isNull(null)"
            }
        ]
    },

    "data.range": {
        description:
            "Functions for creating ranges of integer values.",

        commands: [
            {
                name: "range",
                syntax: "range(end)",
                description:
                    "Returns an array of integers from 0 up to, but not including, end.",
                example:
                    "range(5)"
            },
            {
                name: "rangeBetween",
                syntax: "rangeBetween(start, end)",
                description:
                    "Returns an array of integers from start up to, but not including, end.",
                example:
                    "rangeBetween(3, 7)"
            },
            {
                name: "rangeStep",
                syntax: "rangeStep(start, end, step)",
                description:
                    "Returns an array of integers between start and end using the specified step.",
                example:
                    "rangeStep(0, 10, 2)"
            }
        ]
    },

    "data.inspect": {
        description:
            "Functions for inspecting values without changing them.",

        commands: [
            {
                name: "typeOf",
                syntax: "typeOf(value)",
                description:
                    "Returns the Orin runtime type of a value.",
                example:
                    "typeOf(10)"
            },
            {
                name: "isEmpty",
                syntax: "isEmpty(value)",
                description:
                    "Returns true if a string or array is empty.",
                example:
                    "isEmpty(\"\")"
            },
            {
                name: "sizeOf",
                syntax: "sizeOf(value)",
                description:
                    "Returns the number of characters in a string or the number of values in an array.",
                example:
                    "sizeOf(\"Hello\")"
            },
            {
                name: "sameType",
                syntax: "sameType(a, b)",
                description:
                    "Returns true if both values have the same runtime type.",
                example:
                    "sameType(10, 20)"
            }
        ]
    },

    "data.base": {
        description:
            "Functions for converting non-negative integers between numerical bases.",

        commands: [
            {
                name: "toBinary",
                syntax: "toBinary(value)",
                description:
                    "Converts a non-negative integer into a binary string.",
                example:
                    "toBinary(10)"
            },
            {
                name: "toOctal",
                syntax: "toOctal(value)",
                description:
                    "Converts a non-negative integer into an octal string.",
                example:
                    "toOctal(64)"
            },
            {
                name: "toHex",
                syntax: "toHex(value)",
                description:
                    "Converts a non-negative integer into an uppercase hexadecimal string.",
                example:
                    "toHex(255)"
            },
            {
                name: "fromBinary",
                syntax: "fromBinary(value)",
                description:
                    "Converts a binary string into a decimal integer.",
                example:
                    'fromBinary("1010")'
            },
            {
                name: "fromOctal",
                syntax: "fromOctal(value)",
                description:
                    "Converts an octal string into a decimal integer.",
                example:
                    'fromOctal("100")'
            },
            {
                name: "fromHex",
                syntax: "fromHex(value)",
                description:
                    "Converts a hexadecimal string into a decimal integer.",
                example:
                    'fromHex("FF")'
            },
            {
                name: "convertBase",
                syntax: "convertBase(value, fromBase, toBase)",
                description:
                    "Converts a number represented as a string from one base to another. Supports bases 2 to 36.",
                example:
                    'convertBase("1010", 2, 16)'
            }
        ]
    },

    "system.debug": {
        description:
            "Functions for testing assumptions and deliberately producing errors.",

        commands: [
            {
                name: "assert",
                syntax: "assert(condition)",
                description:
                    "Does nothing when the condition is true and throws an error when the condition is false.",
                example:
                    "assert(age >= 18)"
            },
            {
                name: "assertEqual",
                syntax: "assertEqual(a, b)",
                description:
                    "Throws an error unless both values are strictly equal.",
                example:
                    "assertEqual(result, 10)"
            },
            {
                name: "assertNotEqual",
                syntax: "assertNotEqual(a, b)",
                description:
                    "Throws an error when both values are strictly equal.",
                example:
                    "assertNotEqual(result, 0)"
            },
            {
                name: "fail",
                syntax: "fail(message)",
                description:
                    "Always throws an error using the supplied message.",
                example:
                    "fail(\"Unexpected state\")"
            }
        ]
    },

    "logic.check": {
        description:
            "Functions for checking boolean collections and comparing array values.",

        commands: [
            {
                name: "allTrue",
                syntax: "allTrue(array)",
                description:
                    "Returns true if every value in the array is true.",
                example:
                    "allTrue(values)"
            },
            {
                name: "anyTrue",
                syntax: "anyTrue(array)",
                description:
                    "Returns true if at least one value in the array is true.",
                example:
                    "anyTrue(values)"
            },
            {
                name: "noneTrue",
                syntax: "noneTrue(array)",
                description:
                    "Returns true if every value in the array is false.",
                example:
                    "noneTrue(values)"
            },
            {
                name: "allEqual",
                syntax: "allEqual(array)",
                description:
                    "Returns true if every value in the array is strictly equal.",
                example:
                    "allEqual(numbers)"
            }
        ]
    },

    "logic.compare": {
        description:
            "Functions for performing boolean logic operations.",

        commands: [
            {
                name: "and",
                syntax: "and(a, b)",
                description:
                    "Returns true only when both boolean values are true.",
                example:
                    "and(true, false)"
            },
            {
                name: "or",
                syntax: "or(a, b)",
                description:
                    "Returns true when at least one boolean value is true.",
                example:
                    "or(true, false)"
            },
            {
                name: "nor",
                syntax: "nor(a, b)",
                description:
                    "Returns true only when both boolean values are false.",
                example:
                    "nor(false, false)"
            },
            {
                name: "xor",
                syntax: "xor(a, b)",
                description:
                    "Returns true when exactly one boolean value is true.",
                example:
                    "xor(true, false)"
            },
            {
                name: "nand",
                syntax: "nand(a, b)",
                description:
                    "Returns false only when both boolean values are true.",
                example:
                    "nand(true, true)"
            },
            {
                name: "xnor",
                syntax: "xnor(a, b)",
                description:
                    "Returns true when both boolean values are the same.",
                example:
                    "xnor(true, true)"
            }
        ]
    },

    "logic.conditional": {
        description:
            "Functions for selecting values and checking null values.",

        commands: [
            {
                name: "ifTrue",
                syntax: "ifTrue(condition, trueValue, falseValue)",
                description:
                    "Returns trueValue when the condition is true, otherwise returns falseValue.",
                example:
                    "ifTrue(score >= 50, \"Pass\", \"Fail\")"
            },
            {
                name: "coalesce",
                syntax: "coalesce(a, b)",
                description:
                    "Returns a unless it is null, otherwise returns b.",
                example:
                    "coalesce(value, \"Default\")"
            },
            {
                name: "firstNotNull",
                syntax: "firstNotNull(array)",
                description:
                    "Returns the first non-null value in the array.",
                example:
                    "firstNotNull(values)"
            },
            {
                name: "allNotNull",
                syntax: "allNotNull(array)",
                description:
                    "Returns true if every value in the array is non-null.",
                example:
                    "allNotNull(values)"
            },
            {
                name: "anyNull",
                syntax: "anyNull(array)",
                description:
                    "Returns true if at least one value in the array is null.",
                example:
                    "anyNull(values)"
            },
            {
                name: "noneNull",
                syntax: "noneNull(array)",
                description:
                    "Returns true if the array contains no null values.",
                example:
                    "noneNull(values)"
            }
        ]
    },

    "random.choice": {
        description:
            "Functions for randomly selecting and reordering values from arrays.",

        commands: [
            {
                name: "choice",
                syntax: "choice(array)",
                description:
                    "Returns one randomly selected value from an array.",
                example:
                    "choice(values)"
            },
            {
                name: "sample",
                syntax: "sample(array, amount)",
                description:
                    "Returns a new array containing a chosen number of unique random values from the input array.",
                example:
                    "sample(values, 3)"
            },
            {
                name: "shuffle",
                syntax: "shuffle(array)",
                description:
                    "Returns a new array containing the same values in a random order without changing the original array.",
                example:
                    "shuffle(values)"
            },
            {
                name: "pickIndex",
                syntax: "pickIndex(array)",
                description:
                    "Returns a random valid index from an array.",
                example:
                    "pickIndex(values)"
            }
        ]
    },

    "random.generate": {
        description:
            "Functions for generating random digits, characters and strings.",

        commands: [
            {
                name: "randomDigit",
                syntax: "randomDigit()",
                description:
                    "Returns a random integer from 0 to 9.",
                example:
                    "randomDigit()"
            },
            {
                name: "randomChar",
                syntax: "randomChar()",
                description:
                    "Returns a random uppercase or lowercase English letter.",
                example:
                    "randomChar()"
            },
            {
                name: "randomAlphaNumeric",
                syntax: "randomAlphaNumeric(length)",
                description:
                    "Returns a random string containing letters and digits with the specified positive length.",
                example:
                    "randomAlphaNumeric(8)"
            },
            {
                name: "randomString",
                syntax: "randomString(length)",
                description:
                    "Returns a random string containing uppercase and lowercase English letters with the specified positive length.",
                example:
                    "randomString(8)"
            },
            {
                name: "randomFromCharset",
                syntax: "randomFromCharset(characters, length)",
                description:
                    "Returns a random string built from values in the supplied character array.",
                example:
                    'randomFromCharset(["A", "B", "C", "1", "2", "3"], 6)'
            }
        ]
    },
 
    "file.create": {
        description:
            "Functions for creating files, folders and complete project paths.",

        commands: [
            {
                name: "createFile",
                syntax: "createFile(path)",
                description:
                    "Creates a new file at the specified project path. The parent folder must already exist.",
                example:
                    'createFile("/folder1/file.txt")'
            },
            {
                name: "createFolder",
                syntax: "createFolder(path)",
                description:
                    "Creates a new folder at the specified project path. The parent folder must already exist.",
                example:
                    'createFolder("/folder1/folder2")'
            },
            {
                name: "createPath",
                syntax: "createPath(path)",
                description:
                    "Creates every missing folder in the supplied path. If the final part has a file extension, a file is created at the end.",
                example:
                    'createPath("/folder1/folder2/file.txt")'
            }
        ]
    },

    "file.read": {
        description:
            "Functions for reading project files and checking whether files or folders exist.",

        commands: [
            {
                name: "readText",
                syntax: "readText(path)",
                description:
                    "Returns the full contents of a file as a string.",
                example:
                    'readText("/folder1/file.txt")'
            },
            {
                name: "readLines",
                syntax: "readLines(path)",
                description:
                    "Returns the contents of a file as an array, with one value for each line.",
                example:
                    'readLines("/folder1/file.txt")'
            },
            {
                name: "exists",
                syntax: "exists(path)",
                description:
                    "Returns true if a file exists at the specified project path.",
                example:
                    'exists("/folder1/file.txt")'
            },
            {
                name: "folderExists",
                syntax: "folderExists(path)",
                description:
                    "Returns true if a folder exists at the specified project path.",
                example:
                    'folderExists("/folder1")'
            }
        ]
    },

    "file.write": {
        description:
            "Functions for replacing, appending and writing lines to existing project files.",

        commands: [
            {
                name: "writeText",
                syntax: "writeText(path, content)",
                description:
                    "Replaces the full contents of an existing file with the supplied string.",
                example:
                    'writeText("/folder1/file.txt", "Hello Orin")'
            },
            {
                name: "appendText",
                syntax: "appendText(path, content)",
                description:
                    "Adds text to the end of an existing file without removing its current contents.",
                example:
                    'appendText("/folder1/file.txt", "\\nMore text")'
            },
            {
                name: "writeLines",
                syntax: "writeLines(path, lines)",
                description:
                    "Writes an array of strings to a file, placing each value on a separate line.",
                example:
                    'writeLines("/folder1/names.txt", ["name1", "name2", "name3"])'
            }
        ]
    },

    "file.delete": {
        description:
            "Functions for deleting files, folders and file contents.",

        commands: [
            {
                name: "deleteFile",
                syntax: "deleteFile(path)",
                description:
                    "Deletes the file at the specified project path.",
                example:
                    'deleteFile("/folder1/file.txt")'
            },
            {
                name: "deleteFolder",
                syntax: "deleteFolder(path)",
                description:
                    "Deletes the specified folder and everything contained inside it.",
                example:
                    'deleteFolder("/folder1/folder2")'
            },
            {
                name: "deleteContents",
                syntax: "deleteContents(path)",
                description:
                    "Removes all contents from a file while keeping the file itself.",
                example:
                    'deleteContents("/folder1/file.txt")'
            }
        ]
    },

    "file.content": {
        description:
            "Functions for inspecting the files and folders contained inside project folders.",

        commands: [
            {
                name: "getContent",
                syntax: "getContent(path)",
                description:
                    "Returns an array containing the names of the files and folders directly inside the specified folder.",
                example:
                    'getContent("/folder1")'
            },
            {
                name: "getContentPaths",
                syntax: "getContentPaths(path)",
                description:
                    "Returns an array containing the full project paths of the files and folders directly inside the specified folder.",
                example:
                    'getContentPaths("/folder1")'
            },
            {
                name: "getAll",
                syntax: "getAll(path)",
                description:
                    "Returns an array containing the paths of everything inside the specified folder, including items inside nested folders.",
                example:
                    'getAll("/")'
            }
        ]
    },

    "polynomial.create": {
        description:
            "Functions for creating and inspecting polynomial functions.",

        commands: [
            {
                name: "createPolynomial",
                syntax: "createPolynomial(value)",
                description:
                    "Creates a polynomial from a string and automatically combines terms with matching exponents.",
                example:
                    'createPolynomial("4x^2+10x-3")'
            },
            {
                name: "getCoefficients",
                syntax: "getCoefficients(polynomial)",
                description:
                    "Returns an array containing the coefficients of the polynomial.",
                example:
                    "getCoefficients(func)"
            },
            {
                name: "getExponents",
                syntax: "getExponents(polynomial)",
                description:
                    "Returns an array containing the exponents of the polynomial.",
                example:
                    "getExponents(func)"
            },
            {
                name: "polynomialToString",
                syntax: "polynomialToString(polynomial)",
                description:
                    "Converts a polynomial back into its mathematical string representation.",
                example:
                    "polynomialToString(func)"
            }
        ]
    },

    "polynomial.modify": {
        description:
            "Functions for dynamically modifying an existing polynomial.",

        commands: [
            {
                name: "add",
                syntax: "add(polynomial, value)",
                description:
                    "Adds one or more polynomial terms to an existing polynomial and combines matching exponents.",
                example:
                    'add(func, "3x+2x^2")'
            },
            {
                name: "remove",
                syntax: "remove(polynomial, value)",
                description:
                    "Subtracts one or more polynomial terms from an existing polynomial and combines matching exponents.",
                example:
                    'remove(func, "3x")'
            },
            {
                name: "setCoefficient",
                syntax: "setCoefficient(polynomial, exponent, coefficient)",
                description:
                    "Sets the coefficient for a specific exponent. A coefficient of zero removes the term.",
                example:
                    "setCoefficient(func, 2, 5)"
            },
            {
                name: "removeExponent",
                syntax: "removeExponent(polynomial, exponent)",
                description:
                    "Completely removes the term with the specified exponent from the polynomial.",
                example:
                    "removeExponent(func, 2)"
            }
        ]
    },

    "polynomial.evaluate": {
        description:
            "Functions for evaluating and inspecting polynomial values.",

        commands: [
            {
                name: "evaluate",
                syntax: "evaluate(polynomial, x)",
                description:
                    "Evaluates the polynomial at the supplied value of x.",
                example:
                    "evaluate(func, 5)"
            },
            {
                name: "getCoefficient",
                syntax: "getCoefficient(polynomial, exponent)",
                description:
                    "Returns the coefficient associated with the specified exponent, or zero if the term does not exist.",
                example:
                    "getCoefficient(func, 2)"
            },
            {
                name: "getDegree",
                syntax: "getDegree(polynomial)",
                description:
                    "Returns the highest exponent currently present in the polynomial.",
                example:
                    "getDegree(func)"
            }
        ]
    },

    "graph.terminal": {
        description:
            "Functions for displaying polynomial and expression graphs inside the terminal using text characters.",

        commands: [
            {
                name: "displayCharacters",
                syntax: "displayCharacters(function)",
                description:
                    "Displays a polynomial or mathematical expression in the terminal using text characters with default graph bounds and size.",
                example:
                    "displayCharacters(func)"
            },
            {
                name: "displayCharacters",
                syntax: "displayCharacters(function, xMin, xMax, yMin, yMax)",
                description:
                    "Displays a polynomial or mathematical expression in the terminal using custom x and y bounds.",
                example:
                    "displayCharacters(func, -10, 10, -10, 10)"
            },
            {
                name: "displayCharacters",
                syntax: "displayCharacters(function, xMin, xMax, yMin, yMax, width, height)",
                description:
                    "Displays a polynomial or mathematical expression in the terminal using custom bounds and terminal graph dimensions.",
                example:
                    "displayCharacters(func, -10, 10, -10, 10, 61, 25)"
            },
            {
                name: "getCharacters",
                syntax: "getCharacters(function)",
                description:
                    "Returns a polynomial or mathematical expression graph as a string instead of displaying it.",
                example:
                    "getCharacters(func)"
            },
            {
                name: "getCharacters",
                syntax: "getCharacters(function, xMin, xMax, yMin, yMax)",
                description:
                    "Returns a polynomial or mathematical expression graph as a string using custom x and y bounds.",
                example:
                    "getCharacters(func, -10, 10, -10, 10)"
            },
            {
                name: "getCharacters",
                syntax: "getCharacters(function, xMin, xMax, yMin, yMax, width, height)",
                description:
                    "Returns a polynomial or mathematical expression graph as a string using custom bounds and graph dimensions.",
                example:
                    "getCharacters(func, -10, 10, -10, 10, 61, 25)"
            }
        ]
    },

    "graph.window": {
        description:
            "Functions for displaying polynomial and expression graphs in a separate browser window using a canvas.",

        commands: [
            {
                name: "display",
                syntax: "display(function)",
                description:
                    "Opens a new browser window and displays a polynomial or mathematical expression as a smooth graph using default bounds and window dimensions.",
                example:
                    "display(func)"
            },
            {
                name: "display",
                syntax: "display(function, xMin, xMax, yMin, yMax)",
                description:
                    "Opens a new browser window and displays a polynomial or mathematical expression using the specified x and y bounds.",
                example:
                    "display(func, -10, 10, -10, 10)"
            },
            {
                name: "display",
                syntax: "display(function, xMin, xMax, yMin, yMax, width, height)",
                description:
                    "Opens a new browser window and displays a polynomial or mathematical expression using custom graph bounds and window dimensions.",
                example:
                    "display(func, -10, 10, -10, 10, 800, 600)"
            }
        ]
    },

    "expression.create": {
        description:
            "Functions for creating mathematical expressions from text.",

        commands: [
            {
                name: "createExpression",
                syntax: "createExpression(value)",
                description:
                    "Creates a mathematical expression from a string. Supports arithmetic, grouping, implicit multiplication, powers, absolute values, logarithms, trigonometric functions, hyperbolic functions, roots and rounding functions.",
                example:
                    'createExpression("(x+x^2)/(x-1)")'
            }
        ]
    },

    "expression.evaluate": {
        description:
            "Functions for evaluating mathematical expressions.",

        commands: [
            {
                name: "evaluate",
                syntax: "evaluate(expression, x)",
                description:
                    "Evaluates an expression using the supplied value of x.",
                example:
                    "evaluate(func, 2)"
            },
            {
                name: "isDefined",
                syntax: "isDefined(expression, x)",
                description:
                    "Returns true if the expression produces a finite real value at the supplied value of x.",
                example:
                    "isDefined(func, 2)"
            }
        ]
    },

    "expression.modify": {
        description:
            "Functions for dynamically modifying an existing mathematical expression.",

        commands: [
            {
                name: "add",
                syntax: "add(expression, value)",
                description:
                    "Adds another expression to the existing expression.",
                example:
                    'add(func, "3x")'
            },
            {
                name: "remove",
                syntax: "remove(expression, value)",
                description:
                    "Subtracts another expression from the existing expression.",
                example:
                    'remove(func, "2")'
            },
            {
                name: "multiply",
                syntax: "multiply(expression, value)",
                description:
                    "Multiplies the existing expression by another expression.",
                example:
                    'multiply(func, "2x")'
            },
            {
                name: "divide",
                syntax: "divide(expression, value)",
                description:
                    "Divides the existing expression by another expression.",
                example:
                    'divide(func, "x+1")'
            },
            {
                name: "power",
                syntax: "power(expression, value)",
                description:
                    "Raises the existing expression to another expression.",
                example:
                    'power(func, "x-1")'
            },
            {
                name: "negate",
                syntax: "negate(expression)",
                description:
                    "Negates the entire expression.",
                example:
                    "negate(func)"
            }
        ]
    },

    "expression.inspect": {
        description:
            "Functions for inspecting mathematical expressions and the syntax supported by the expression system.",

        commands: [
            {
                name: "toString",
                syntax: "toString(expression)",
                description:
                    "Returns a string representation of the expression tree.",
                example:
                    "toString(func)"
            },
            {
                name: "getNodeCount",
                syntax: "getNodeCount(expression)",
                description:
                    "Returns the number of nodes contained in the expression tree.",
                example:
                    "getNodeCount(func)"
            },
            {
                name: "getDepth",
                syntax: "getDepth(expression)",
                description:
                    "Returns the maximum depth of the expression tree.",
                example:
                    "getDepth(func)"
            },
            {
                name: "getNodeTypes",
                syntax: "getNodeTypes(expression)",
                description:
                    "Returns an array containing the type of every node in the expression tree.",
                example:
                    "getNodeTypes(func)"
            },
            {
                name: "getOriginal",
                syntax: "getOriginal(expression)",
                description:
                    "Returns the original expression string, or null if the expression has since been modified.",
                example:
                    "getOriginal(func)"
            },
            {
                name: "getSupportedSyntax",
                syntax: "getSupportedSyntax()",
                description:
                    "Returns a formatted string listing the operators, grouping, constants, implicit multiplication and mathematical functions supported inside expressions.",
                example:
                    "getSupportedSyntax()"
            }
        ]
    },

    "window.page": {
        description:
            "Functions for creating and controlling a graphical window page.",

        commands: [
            {
                name: "add",
                syntax: "<page>.add(element)",
                description:
                    "Adds a window element to the page.",
                example:
                    "window1.add(button1)"
            },
            {
                name: "remove",
                syntax: "<page>.remove(element)",
                description:
                    "Removes a window element from the page.",
                example:
                    "window1.remove(button1)"
            },
            {
                name: "addAll",
                syntax: "<page>.addAll(element1, element2, ...)",
                description:
                    "Adds multiple window elements to the page.",
                example:
                    "window1.addAll(text1, button1)"
            },
            {
                name: "removeAll",
                syntax: "<page>.removeAll(element1, element2, ...)",
                description:
                    "Removes multiple window elements from the page.",
                example:
                    "window1.removeAll(text1, button1)"
            },
            {
                name: "clear",
                syntax: "<page>.clear()",
                description:
                    "Removes every element from the page.",
                example:
                    "window1.clear()"
            },
            {
                name: "show",
                syntax: "<page>.show()",
                description:
                    "Opens and displays the page in a separate browser window.",
                example:
                    "window1.show()"
            },
            {
                name: "close",
                syntax: "<page>.close()",
                description:
                    "Closes the page window.",
                example:
                    "window1.close()"
            },
            {
                name: "setStyle",
                syntax: "<page>.setStyle(path)",
                description:
                    "Applies a CSS project file to the page. Calling setStyle again replaces the current stylesheet.",
                example:
                    'window1.setStyle("style.css")'
            },
            {
                name: "removeStyle",
                syntax: "<page>.removeStyle()",
                description:
                    "Removes the currently active CSS stylesheet from the page.",
                example:
                    "window1.removeStyle()"
            }
        ]
    },

    "window.node.button": {
        description:
            "Functions for creating and controlling buttons inside window pages.",

        commands: [
            {
                name: "setClass",
                syntax: "<button>.setClass(className)",
                description:
                    "Sets the CSS class assigned to the button.",
                example:
                    'button1.setClass("button")'
            },
            {
                name: "setX",
                syntax: "<button>.setX(x)",
                description:
                    "Sets the horizontal position of the button in pixels.",
                example:
                    "button1.setX(10)"
            },
            {
                name: "setY",
                syntax: "<button>.setY(y)",
                description:
                    "Sets the vertical position of the button in pixels.",
                example:
                    "button1.setY(10)"
            },
            {
                name: "setText",
                syntax: "<button>.setText(text)",
                description:
                    "Changes the text displayed by the button.",
                example:
                    'button1.setText("Press")'
            },
            {
                name: "onClick",
                syntax: "<button>.onClick(action)",
                description:
                    "Sets the Orin function call that runs when the button is clicked.",
                example:
                    'button1.onClick("pressed()")'
            }
        ]
    },

    "window.node.text": {
        description:
            "Functions for creating and controlling text inside window pages.",

        commands: [
            {
                name: "setClass",
                syntax: "<text>.setClass(className)",
                description:
                    "Sets the CSS class assigned to the text element.",
                example:
                    'text1.setClass("text")'
            },
            {
                name: "setX",
                syntax: "<text>.setX(x)",
                description:
                    "Sets the horizontal position of the text in pixels.",
                example:
                    "text1.setX(10)"
            },
            {
                name: "setY",
                syntax: "<text>.setY(y)",
                description:
                    "Sets the vertical position of the text in pixels.",
                example:
                    "text1.setY(10)"
            },
            {
                name: "setText",
                syntax: "<text>.setText(text)",
                description:
                    "Changes the text displayed by the element.",
                example:
                    'text1.setText("Changed")'
            }
        ]
    },

    "window.node.input": {
        commands: [
            {
                name: "setClass",
                syntax: "<input>.setClass(className)",
                description: "Sets the CSS class of the input."
            },
            {
                name: "setX",
                syntax: "<input>.setX(x)",
                description: "Sets the horizontal position of the input."
            },
            {
                name: "setY",
                syntax: "<input>.setY(y)",
                description: "Sets the vertical position of the input."
            },
            {
                name: "setValue",
                syntax: "<input>.setValue(value)",
                description: "Sets the current text in the input."
            },
            {
                name: "getValue",
                syntax: "<input>.getValue()",
                description: "Returns the current text in the input."
            },
            {
                name: "setPlaceholder",
                syntax: "<input>.setPlaceholder(value)",
                description: "Sets the placeholder text of the input."
            },
            {
                name: "setDisabled",
                syntax: "<input>.setDisabled(value)",
                description: "Enables or disables the input."
            },
            {
                name: "onInput",
                syntax: "<input>.onInput(action)",
                description: "Runs an Orin action whenever the input value changes."
            },
            {
                name: "onChange",
                syntax: "<input>.onChange(action)",
                description: "Runs an Orin action when the input change is committed."
            }
        ]
    },

    "window.node.textarea": {
        commands: [
            {
                name: "setClass",
                syntax: "<textarea>.setClass(className)",
                description: "Sets the CSS class of the textarea."
            },
            {
                name: "setX",
                syntax: "<textarea>.setX(x)",
                description: "Sets the horizontal position of the textarea."
            },
            {
                name: "setY",
                syntax: "<textarea>.setY(y)",
                description: "Sets the vertical position of the textarea."
            },
            {
                name: "setValue",
                syntax: "<textarea>.setValue(value)",
                description: "Sets the current text in the textarea."
            },
            {
                name: "getValue",
                syntax: "<textarea>.getValue()",
                description: "Returns the current text in the textarea."
            },
            {
                name: "setPlaceholder",
                syntax: "<textarea>.setPlaceholder(value)",
                description: "Sets the placeholder text of the textarea."
            },
            {
                name: "setDisabled",
                syntax: "<textarea>.setDisabled(value)",
                description: "Enables or disables the textarea."
            },
            {
                name: "onInput",
                syntax: "<textarea>.onInput(action)",
                description: "Runs an Orin action whenever the textarea value changes."
            },
            {
                name: "onChange",
                syntax: "<textarea>.onChange(action)",
                description: "Runs an Orin action when the textarea change is committed."
            }
        ]
    },

    "window.node.radiobutton": {
        commands: [
            {
                name: "setClass",
                syntax: "<radiobutton>.setClass(className)",
                description:
                    "Sets the CSS class of the radio button."
            },
            {
                name: "setX",
                syntax: "<radiobutton>.setX(x)",
                description:
                    "Sets the horizontal position of the radio button."
            },
            {
                name: "setY",
                syntax: "<radiobutton>.setY(y)",
                description:
                    "Sets the vertical position of the radio button."
            },
            {
                name: "setText",
                syntax: "<radiobutton>.setText(text)",
                description:
                    "Sets the label text of the radio button."
            },
            {
                name: "setValue",
                syntax: "<radiobutton>.setValue(value)",
                description:
                    "Sets whether the radio button is selected."
            },
            {
                name: "getValue",
                syntax: "<radiobutton>.getValue()",
                description:
                    "Returns true if this radio button is selected, otherwise false."
            },
            {
                name: "setGroup",
                syntax: "<radiobutton>.setGroup(group)",
                description:
                    "Places the radio button into a group. Radio buttons in the same group are mutually exclusive. Radio buttons without a group can be selected independently."
            },
            {
                name: "setDisabled",
                syntax: "<radiobutton>.setDisabled(value)",
                description:
                    "Enables or disables the radio button."
            },
            {
                name: "onChange",
                syntax: "<radiobutton>.onChange(action)",
                description:
                    "Runs an Orin action when the selected state changes."
            }
        ]
    },

    "window.node.dropdown": {
        commands: [
            {
                name: "setClass",
                syntax: "<dropdown>.setClass(className)",
                description:
                    "Sets the CSS class of the dropdown."
            },
            {
                name: "setX",
                syntax: "<dropdown>.setX(x)",
                description:
                    "Sets the horizontal position of the dropdown."
            },
            {
                name: "setY",
                syntax: "<dropdown>.setY(y)",
                description:
                    "Sets the vertical position of the dropdown."
            },
            {
                name: "addOptions",
                syntax: "<dropdown>.addOptions(options...)",
                description:
                    "Adds one or more options to the dropdown."
            },
            {
                name: "setOptions",
                syntax: "<dropdown>.setOptions(options...)",
                description:
                    "Removes all existing options and replaces them with the supplied options."
            },
            {
                name: "removeOptions",
                syntax: "<dropdown>.removeOptions(options...)",
                description:
                    "Removes one or more options from the dropdown."
            },
            {
                name: "clearOptions",
                syntax: "<dropdown>.clearOptions()",
                description:
                    "Removes every option from the dropdown."
            },
            {
                name: "setValue",
                syntax: "<dropdown>.setValue(value)",
                description:
                    "Selects an existing dropdown option."
            },
            {
                name: "getValue",
                syntax: "<dropdown>.getValue()",
                description:
                    "Returns the currently selected option."
            },
            {
                name: "setDisabled",
                syntax: "<dropdown>.setDisabled(value)",
                description:
                    "Enables or disables the dropdown."
            },
            {
                name: "onChange",
                syntax: "<dropdown>.onChange(action)",
                description:
                    "Runs an Orin action when the selected option changes."
            }
        ]
    },

    "window.node.list": {
        commands: [
            {
                name: "setClass",
                syntax: "<list>.setClass(className)",
                description:
                    "Sets the CSS class of the list."
            },
            {
                name: "setX",
                syntax: "<list>.setX(x)",
                description:
                    "Sets the horizontal position of the list."
            },
            {
                name: "setY",
                syntax: "<list>.setY(y)",
                description:
                    "Sets the vertical position of the list."
            },
            {
                name: "setOrdered",
                syntax: "<list>.setOrdered(value)",
                description:
                    "Sets whether the list is ordered. True uses a numbered list and false uses a bullet list."
            },
            {
                name: "add",
                syntax: "<list>.add(values...)",
                description:
                    "Adds one or more string values to the end of the list."
            },
            {
                name: "setItems",
                syntax: "<list>.setItems(values...)",
                description:
                    "Replaces all existing list items with the supplied string values."
            },
            {
                name: "set",
                syntax: "<list>.set(index, value)",
                description:
                    "Changes the value at the specified zero-based index."
            },
            {
                name: "remove",
                syntax: "<list>.remove(index)",
                description:
                    "Removes the value at the specified zero-based index."
            },
            {
                name: "getValue",
                syntax: "<list>.getValue(index)",
                description:
                    "Returns the value at the specified zero-based index."
            },
            {
                name: "length",
                syntax: "<list>.length()",
                description:
                    "Returns the number of values in the list."
            },
            {
                name: "clear",
                syntax: "<list>.clear()",
                description:
                    "Removes every value from the list."
            }
        ]
    },

    "window.node.spreadsheet": {
        commands: [
            {
                name: "setClass",
                syntax: "<spreadsheet>.setClass(className)",
                description:
                    "Sets the CSS class of the spreadsheet."
            },
            {
                name: "setX",
                syntax: "<spreadsheet>.setX(x)",
                description:
                    "Sets the horizontal position of the spreadsheet."
            },
            {
                name: "setY",
                syntax: "<spreadsheet>.setY(y)",
                description:
                    "Sets the vertical position of the spreadsheet."
            },
            {
                name: "setSize",
                syntax: "<spreadsheet>.setSize(width, height)",
                description:
                    "Sets the number of columns and rows in the spreadsheet. Existing cells that remain inside the new size are preserved."
            },
            {
                name: "setValue",
                syntax: "<spreadsheet>.setValue(x, y, value)",
                description:
                    "Sets the text value of a text cell. The cell must currently be in text mode."
            },
            {
                name: "getValue",
                syntax: "<spreadsheet>.getValue(x, y)",
                description:
                    "Returns the current value of a text cell. The cell must currently be in text mode."
            },
            {
                name: "clearValue",
                syntax: "<spreadsheet>.clearValue(x, y)",
                description:
                    "Clears the value of a text cell."
            },
            {
                name: "setNode",
                syntax: "<spreadsheet>.setNode()",
                description:
                    "Changes every cell in the spreadsheet to node mode so the cells cannot be typed into."
            },
            {
                name: "setNode",
                syntax: "<spreadsheet>.setNode(x, y)",
                description:
                    "Changes one cell to node mode so the cell cannot be typed into."
            },
            {
                name: "setNode",
                syntax: "<spreadsheet>.setNode(x, y, node)",
                description:
                    "Changes one cell to node mode and places a window node or layout inside it."
            },
            {
                name: "setText",
                syntax: "<spreadsheet>.setText()",
                description:
                    "Changes every cell to text mode. Any nodes currently inside the cells are removed."
            },
            {
                name: "setText",
                syntax: "<spreadsheet>.setText(x, y)",
                description:
                    "Changes one cell to text mode. Any node currently inside that cell is removed."
            },
            {
                name: "setRowNode",
                syntax: "<spreadsheet>.setRowNode(y)",
                description:
                    "Changes every cell in the selected row to node mode."
            },
            {
                name: "setRowText",
                syntax: "<spreadsheet>.setRowText(y)",
                description:
                    "Changes every cell in the selected row to text mode and removes any nodes from those cells."
            },
            {
                name: "setColumnNode",
                syntax: "<spreadsheet>.setColumnNode(x)",
                description:
                    "Changes every cell in the selected column to node mode."
            },
            {
                name: "setColumnText",
                syntax: "<spreadsheet>.setColumnText(x)",
                description:
                    "Changes every cell in the selected column to text mode and removes any nodes from those cells."
            },
            {
                name: "getType",
                syntax: "<spreadsheet>.getType(x, y)",
                description:
                    "Returns the current cell type as either \"text\" or \"node\"."
            },
            {
                name: "getNode",
                syntax: "<spreadsheet>.getNode(x, y)",
                description:
                    "Returns the window node stored in a node cell, or null if the cell does not contain a node."
            },
            {
                name: "setEditable",
                syntax: "<spreadsheet>.setEditable(value)",
                description:
                    "Enables or disables typing in all text cells. Node cells are unaffected."
            },
            {
                name: "clear",
                syntax: "<spreadsheet>.clear()",
                description:
                    "Clears the entire spreadsheet, removes all contained nodes, and resets every cell to blank text mode."
            },
            {
                name: "getWidth",
                syntax: "<spreadsheet>.getWidth()",
                description:
                    "Returns the number of columns in the spreadsheet."
            },
            {
                name: "getHeight",
                syntax: "<spreadsheet>.getHeight()",
                description:
                    "Returns the number of rows in the spreadsheet."
            },
            {
                name: "onChange",
                syntax: "<spreadsheet>.onChange(action)",
                description:
                    "Runs an Orin action whenever the user changes the value of a text cell."
            }
        ]
    },

    "window.node.image": {
        commands: [
            {
                name: "setClass",
                syntax: "<image>.setClass(className)",
                description:
                    "Sets the CSS class of the image."
            },
            {
                name: "setX",
                syntax: "<image>.setX(x)",
                description:
                    "Sets the horizontal position of the image."
            },
            {
                name: "setY",
                syntax: "<image>.setY(y)",
                description:
                    "Sets the vertical position of the image."
            },
            {
                name: "setWidth",
                syntax: "<image>.setWidth(width)",
                description:
                    "Sets the displayed image width in pixels."
            },
            {
                name: "setHeight",
                syntax: "<image>.setHeight(height)",
                description:
                    "Sets the displayed image height in pixels."
            },
            {
                name: "setSource",
                syntax: "<image>.setSource(path)",
                description:
                    "Changes the image to another PNG file stored in the Orin project."
            },
            {
                name: "setAlt",
                syntax: "<image>.setAlt(text)",
                description:
                    "Sets the alternative text for the image."
            }
        ]
    },

    "window.node.checkbox": {
        commands: [
            {
                name: "setClass",
                syntax: "<checkbox>.setClass(className)",
                description:
                    "Sets the CSS class of the checkbox."
            },
            {
                name: "setX",
                syntax: "<checkbox>.setX(x)",
                description:
                    "Sets the horizontal position of the checkbox."
            },
            {
                name: "setY",
                syntax: "<checkbox>.setY(y)",
                description:
                    "Sets the vertical position of the checkbox."
            },
            {
                name: "setText",
                syntax: "<checkbox>.setText(text)",
                description:
                    "Sets the label text of the checkbox."
            },
            {
                name: "setValue",
                syntax: "<checkbox>.setValue(value)",
                description:
                    "Sets whether the checkbox is selected."
            },
            {
                name: "getValue",
                syntax: "<checkbox>.getValue()",
                description:
                    "Returns true if the checkbox is selected, otherwise false."
            },
            {
                name: "setDisabled",
                syntax: "<checkbox>.setDisabled(value)",
                description:
                    "Enables or disables the checkbox."
            },
            {
                name: "onChange",
                syntax: "<checkbox>.onChange(action)",
                description:
                    "Runs an Orin action whenever the checkbox value changes."
            }
        ]
    },

    "window.node.shape": {
        commands: [
            {
                name: "setClass",
                syntax: "<shape>.setClass(className)",
                description:
                    "Sets the CSS class of the shape."
            },
            {
                name: "setX",
                syntax: "<shape>.setX(x)",
                description:
                    "Sets the horizontal position of the shape."
            },
            {
                name: "setY",
                syntax: "<shape>.setY(y)",
                description:
                    "Sets the vertical position of the shape."
            },
            {
                name: "setWidth",
                syntax: "<shape>.setWidth(width)",
                description:
                    "Sets the width of the shape in pixels."
            },
            {
                name: "setHeight",
                syntax: "<shape>.setHeight(height)",
                description:
                    "Sets the height of the shape in pixels."
            },
            {
                name: "setType",
                syntax: "<shape>.setType(type)",
                description:
                    "Changes the shape type. Supports circle, ellipse, square, rectangle, triangle, line, arrow, polygon(n), and star(n)."
            },
            {
                name: "getType",
                syntax: "<shape>.getType()",
                description:
                    "Returns the current shape type."
            },
            {
                name: "rotate",
                syntax: "<shape>.rotate(angle)",
                description:
                    "Rotates the shape to an absolute angle measured in radians."
            },
            {
                name: "rotateDegrees",
                syntax: "<shape>.rotateDegrees(angle)",
                description:
                    "Rotates the shape to an absolute angle measured in degrees."
            },
            {
                name: "setSides",
                syntax: "<shape>.setSides(sides)",
                description:
                    "Changes the number of sides of a polygon. Only works with polygon shapes."
            },
            {
                name: "getSides",
                syntax: "<shape>.getSides()",
                description:
                    "Returns the number of sides of a polygon. Only works with polygon shapes."
            },
            {
                name: "setPoints",
                syntax: "<shape>.setPoints(points)",
                description:
                    "Changes the number of points of a star. Only works with star shapes."
            },
            {
                name: "getPoints",
                syntax: "<shape>.getPoints()",
                description:
                    "Returns the number of points of a star. Only works with star shapes."
            },
            {
                name: "setHeadSize",
                syntax: "<shape>.setHeadSize(size)",
                description:
                    "Changes the size of the arrow head. Only works with arrow shapes."
            }
        ]
    },

    "window.layout.container": {
        commands: [
            {
                name: "setClass",
                syntax: "<container>.setClass(className)",
                description:
                    "Sets the CSS class of the container."
            },
            {
                name: "setX",
                syntax: "<container>.setX(x)",
                description:
                    "Sets the horizontal position of the container."
            },
            {
                name: "setY",
                syntax: "<container>.setY(y)",
                description:
                    "Sets the vertical position of the container."
            },
            {
                name: "setWidth",
                syntax: "<container>.setWidth(width)",
                description:
                    "Sets the width of the container in pixels."
            },
            {
                name: "setHeight",
                syntax: "<container>.setHeight(height)",
                description:
                    "Sets the height of the container in pixels."
            },
            {
                name: "add",
                syntax: "<container>.add(element)",
                description:
                    "Adds a window element to the container."
            },
            {
                name: "addAll",
                syntax: "<container>.addAll(element1, element2, ...)",
                description:
                    "Adds multiple window elements to the container."
            },
            {
                name: "remove",
                syntax: "<container>.remove(element)",
                description:
                    "Removes a window element from the container."
            },
            {
                name: "removeAll",
                syntax: "<container>.removeAll(element1, element2, ...)",
                description:
                    "Removes multiple window elements from the container."
            },
            {
                name: "clear",
                syntax: "<container>.clear()",
                description:
                    "Removes every window element from the container."
            },
            {
                name: "length",
                syntax: "<container>.length()",
                description:
                    "Returns the number of window elements in the container."
            }
        ]
    },

    "window.layout.row": {
        commands: [
            {
                name: "setClass",
                syntax: "<row>.setClass(className)",
                description:
                    "Sets the CSS class of the row."
            },
            {
                name: "setX",
                syntax: "<row>.setX(x)",
                description:
                    "Sets the horizontal position of the row."
            },
            {
                name: "setY",
                syntax: "<row>.setY(y)",
                description:
                    "Sets the vertical position of the row."
            },
            {
                name: "setWidth",
                syntax: "<row>.setWidth(width)",
                description:
                    "Sets the width of the row in pixels."
            },
            {
                name: "setHeight",
                syntax: "<row>.setHeight(height)",
                description:
                    "Sets the height of the row in pixels."
            },
            {
                name: "setGap",
                syntax: "<row>.setGap(gap)",
                description:
                    "Sets the horizontal gap in pixels between elements in the row."
            },
            {
                name: "add",
                syntax: "<row>.add(element)",
                description:
                    "Adds a window element to the end of the row."
            },
            {
                name: "addAll",
                syntax: "<row>.addAll(element1, element2, ...)",
                description:
                    "Adds multiple window elements to the row."
            },
            {
                name: "remove",
                syntax: "<row>.remove(element)",
                description:
                    "Removes a window element from the row."
            },
            {
                name: "removeAll",
                syntax: "<row>.removeAll(element1, element2, ...)",
                description:
                    "Removes multiple window elements from the row."
            },
            {
                name: "clear",
                syntax: "<row>.clear()",
                description:
                    "Removes every window element from the row."
            },
            {
                name: "length",
                syntax: "<row>.length()",
                description:
                    "Returns the number of window elements in the row."
            }
        ]
    },

    "window.layout.column": {
        commands: [
            {
                name: "setClass",
                syntax: "<column>.setClass(className)",
                description:
                    "Sets the CSS class of the column."
            },
            {
                name: "setX",
                syntax: "<column>.setX(x)",
                description:
                    "Sets the horizontal position of the column."
            },
            {
                name: "setY",
                syntax: "<column>.setY(y)",
                description:
                    "Sets the vertical position of the column."
            },
            {
                name: "setWidth",
                syntax: "<column>.setWidth(width)",
                description:
                    "Sets the width of the column in pixels."
            },
            {
                name: "setHeight",
                syntax: "<column>.setHeight(height)",
                description:
                    "Sets the height of the column in pixels."
            },
            {
                name: "setGap",
                syntax: "<column>.setGap(gap)",
                description:
                    "Sets the vertical gap in pixels between elements in the column."
            },
            {
                name: "add",
                syntax: "<column>.add(element)",
                description:
                    "Adds a window element to the bottom of the column."
            },
            {
                name: "addAll",
                syntax: "<column>.addAll(element1, element2, ...)",
                description:
                    "Adds multiple window elements to the column."
            },
            {
                name: "remove",
                syntax: "<column>.remove(element)",
                description:
                    "Removes a window element from the column."
            },
            {
                name: "removeAll",
                syntax: "<column>.removeAll(element1, element2, ...)",
                description:
                    "Removes multiple window elements from the column."
            },
            {
                name: "clear",
                syntax: "<column>.clear()",
                description:
                    "Removes every window element from the column."
            },
            {
                name: "length",
                syntax: "<column>.length()",
                description:
                    "Returns the number of window elements in the column."
            }
        ]
    },
};