// tests.js

const tests = [];
let testsPassed = 0;
let testsFailed = 0;

// Helper function to define a test case
function it(description, testFn) {
    tests.push({ description, testFn });
}

// Simple assertion helper
function expect(actual) {
    return {
        toBe: (expected) => {
            if (actual !== expected) {
                throw new Error(`Expected ${actual} to be ${expected}`);
            }
        },
        toEqual: (expected) => { // For objects/arrays (simple deep comparison)
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
            }
        },
        toBeCloseTo: (expected, precision = 2) => {
            const epsilon = Math.pow(10, -precision) / 2;
            if (Math.abs(actual - expected) > epsilon) {
                throw new Error(`Expected ${actual} to be close to ${expected} (within ${epsilon})`);
            }
        },
        toBeNull: () => {
            if (actual !== null) {
                throw new Error(`Expected ${actual} to be null`);
            }
        },
        toBeTruthy: () => {
            if (!actual) {
                throw new Error(`Expected ${actual} to be truthy`);
            }
        },
        toBeGreaterThan: (expected) => {
            if (!(actual > expected)) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
            }
        }
    };
}

// Function to run all tests
function runAllTests() {
    testsPassed = 0;
    testsFailed = 0;
    console.clear(); // Clear console for new test run
    console.log("%c=== Running All Tests ===", "font-weight: bold; font-size: 1.2em;");

    tests.forEach(test => {
        try {
            test.testFn();
            console.log(`%c  PASS: ${test.description}`, "color: green;");
            testsPassed++;
        } catch (error) {
            console.error(`%c  FAIL: ${test.description}`, "color: red; font-weight: bold;");
            console.error("    Error:", error.message);
            testsFailed++;
        }
    });

    console.log("%c------------------------", "font-weight: bold;");
    console.log(`%cResults: ${testsPassed} passed, ${testsFailed} failed.`, testsFailed > 0 ? "color: red;" : "color: green; font-weight: bold;");
    console.log("%c=== Tests Complete ===", "font-weight: bold; font-size: 1.2em;");

    // Optionally, display results on the page too, but console is fine for now.
    const errorMsgDiv = document.getElementById('errorMessage'); // Reuse error message div for test summary
    if (errorMsgDiv) {
        if (testsFailed > 0) {
            errorMsgDiv.innerHTML = `<strong style="color: red;">Tests Failed: ${testsFailed} (Passed: ${testsPassed}). Check console.</strong>`;
        } else {
            errorMsgDiv.innerHTML = `<strong style="color: green;">All ${testsPassed} Tests Passed!</strong>`;
        }
    }
}

// Example test (will be replaced by actual tests later)
// it("Example: 1 should be 1", () => {
//    expect(1).toBe(1);
// });

// --- Add actual test definitions below in subsequent steps ---

// Make runAllTests globally accessible if called from HTML button directly,
// or ensure it's called via an event listener set up in main.js
window.runAllTests = runAllTests;


// --- Tests for getScaledCoordinates ---
// Assumes getScaledCoordinates is globally available as window.getScaledCoordinates
// and its signature is getScaledCoordinates(event, canvasEl)

it("getScaledCoordinates: No scaling, mouse event, no offset", () => {
    const mockCanvas = {
        width: 800,
        height: 600,
        getBoundingClientRect: () => ({
            left: 0,
            top: 0,
            width: 800,
            height: 600,
        }),
    };
    const mockEvent = { clientX: 100, clientY: 50 };

    const coords = window.getScaledCoordinates(mockEvent, mockCanvas);

    expect(coords.x).toBe(100);
    expect(coords.y).toBe(50);
});

it("getScaledCoordinates: Uniform scaling (2x), mouse event, with offset", () => {
    const mockCanvas = {
        width: 1600, // Double the display size
        height: 1200,
        getBoundingClientRect: () => ({
            left: 10,  // Canvas is offset on the page
            top: 20,
            width: 800, // Display size
            height: 600,
        }),
    };
    const mockEvent = { clientX: 110, clientY: 70 }; // Click at (100,50) relative to display canvas

    const coords = window.getScaledCoordinates(mockEvent, mockCanvas);
    expect(coords.x).toBe(200); // (110 - 10) * (1600 / 800)
    expect(coords.y).toBe(100); // (70 - 20) * (1200 / 600)
});

it("getScaledCoordinates: Non-uniform scaling, touch event, no offset", () => {
    const mockCanvas = {
        width: 1600, // 2x display width
        height: 1800, // 3x display height
        getBoundingClientRect: () => ({
            left: 0,
            top: 0,
            width: 800,
            height: 600,
        }),
    };
    const mockEvent = { touches: [{ clientX: 100, clientY: 50 }] };

    const coords = window.getScaledCoordinates(mockEvent, mockCanvas);
    expect(coords.x).toBe(200); // 100 * (1600 / 800)
    expect(coords.y).toBe(150); // 50 * (1800 / 600)
});

it("getScaledCoordinates: No scaling, touch event, with offset", () => {
    const mockCanvas = {
        width: 800,
        height: 600,
        getBoundingClientRect: () => ({
            left: 50,
            top: 50,
            width: 800,
            height: 600,
        }),
    };
    const mockEvent = { touches: [{ clientX: 150, clientY: 100 }] };

    const coords = window.getScaledCoordinates(mockEvent, mockCanvas);
    expect(coords.x).toBe(100); // (150-50) * (800/800)
    expect(coords.y).toBe(50);  // (100-50) * (600/600)
});

it("getScaledCoordinates: Handles event with no touches array (plain mouse event)", () => {
    const mockCanvas = {
        width: 800,
        height: 600,
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
    };
    const mockEvent = { clientX: 10, clientY: 20 };

    const coords = window.getScaledCoordinates(mockEvent, mockCanvas);
    expect(coords.x).toBe(10);
    expect(coords.y).toBe(20);
});

// --- Tests for generateRectangleEquationString ---
// Assumes generateRectangleEquationString is globally available

it("generateRectangleEquationString: Valid rectangle", () => {
    const rect = { x: 10, y: 20, width: 100, height: 50 };
    const expectedString = `
        <p><strong>Rectangle Definition:</strong></p>
        <p>10.00 &le; x &le; 110.00</p>
        <p>20.00 &le; y &le; 70.00</p>
    `;
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();
    expect(normalize(window.generateRectangleEquationString(rect))).toBe(normalize(expectedString));
});

it("generateRectangleEquationString: Rectangle with decimal coordinates and dimensions", () => {
    const rect = { x: 10.123, y: 20.456, width: 100.789, height: 50.321 };
    const expectedString = `
        <p><strong>Rectangle Definition:</strong></p>
        <p>10.12 &le; x &le; 110.91</p>
        <p>20.46 &le; y &le; 70.78</p>
    `;
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();
    expect(normalize(window.generateRectangleEquationString(rect))).toBe(normalize(expectedString));
});

it("generateRectangleEquationString: Rectangle with zero width", () => {
    const rect = { x: 10, y: 20, width: 0, height: 50 };
    const expectedString = "<p>Invalid rectangle dimensions for equation.</p>";
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();
    expect(normalize(window.generateRectangleEquationString(rect))).toBe(normalize(expectedString));
});

it("generateRectangleEquationString: Rectangle with negative height", () => {
    const rect = { x: 10, y: 20, width: 100, height: -50 };
    const expectedString = "<p>Invalid rectangle dimensions for equation.</p>";
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();
    expect(normalize(window.generateRectangleEquationString(rect))).toBe(normalize(expectedString));
});

it("generateRectangleEquationString: Null input", () => {
    const expectedString = "<p>Invalid rectangle dimensions for equation.</p>";
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();
    expect(normalize(window.generateRectangleEquationString(null))).toBe(normalize(expectedString));
});


// --- Tests for fitEllipse ---
// Assumes fitEllipse is globally available as window.fitEllipse

it("fitEllipse: Insufficient points (less than 5)", () => {
    const points = [{x:1, y:1}, {x:2, y:2}, {x:3, y:3}, {x:4, y:4}]; // Only 4 points
    const coeffs = window.fitEllipse(points);
    expect(coeffs).toBeNull();
});

it("fitEllipse: Insufficient points (empty array)", () => {
    const points = [];
    const coeffs = window.fitEllipse(points);
    expect(coeffs).toBeNull();
});

it("fitEllipse: Co-linear points (horizontal line)", () => {
    const points = [
        {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}
    ];
    const coeffs = window.fitEllipse(points);
    if (coeffs) {
        const { A, B, C } = coeffs;
        const discriminant = 4 * A * C - B * B;
        expect(discriminant <= 0.001).toBeTruthy();
    } else {
        // This branch might be taken if fitEllipse is improved to return null for co-linear.
        // For the current SVD based method, it's more likely to return coefficients.
        expect(coeffs).toBeNull();
    }
});

it("fitEllipse: Co-linear points (vertical line)", () => {
    const points = [
        {x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}
    ];
    const coeffs = window.fitEllipse(points);
    if (coeffs) {
        const { A, B, C } = coeffs;
        const discriminant = 4 * A * C - B * B;
        expect(discriminant <= 0.001).toBeTruthy();
    } else {
        expect(coeffs).toBeNull();
    }
});

it("fitEllipse: Points on a simple circle centered at origin (x^2 + y^2 - 4 = 0)", () => {
    const points = [
        {x: 2, y: 0},
        {x: -2, y: 0},
        {x: 0, y: 2},
        {x: 0, y: -2},
        {x: 2 * Math.cos(Math.PI / 4), y: 2 * Math.sin(Math.PI / 4)},
        {x: 2 * Math.cos(3 * Math.PI / 4), y: 2 * Math.sin(3 * Math.PI / 4)}
    ];
    const coeffs = window.fitEllipse(points);
    expect(coeffs).toBeTruthy();

    if (coeffs) {
        const { A, B, C, D, E } = coeffs;
        const discriminant = 4 * A * C - B * B;
        expect(discriminant).toBeGreaterThan(0);
        expect(Math.abs(B)).toBeCloseTo(0, 3);
        expect(Math.abs(D)).toBeCloseTo(0, 3);
        expect(Math.abs(E)).toBeCloseTo(0, 3);
        expect(A * C).toBeGreaterThan(0);
        expect(Math.abs(A / C)).toBeCloseTo(1, 2);
    }
});

it("fitEllipse: Points on an axis-aligned ellipse (x^2/9 + y^2/4 - 1 = 0)", () => {
    const points = [
        {x: 3, y: 0},
        {x: -3, y: 0},
        {x: 0, y: 2},
        {x: 0, y: -2},
        {x: 3 * Math.cos(Math.PI / 4), y: 2 * Math.sin(Math.PI / 4)},
        {x: 3 * Math.cos(3 * Math.PI / 4), y: 2 * Math.sin(3 * Math.PI / 4)}
    ];
    const coeffs = window.fitEllipse(points);
    expect(coeffs).toBeTruthy();

    if (coeffs) {
        const { A, B, C, D, E } = coeffs;
        const discriminant = 4 * A * C - B * B;
        expect(discriminant).toBeGreaterThan(0);
        expect(Math.abs(B)).toBeCloseTo(0, 3);
        expect(Math.abs(D)).toBeCloseTo(0, 3);
        expect(Math.abs(E)).toBeCloseTo(0, 3);
        expect(A * C).toBeGreaterThan(0);
    }
});
