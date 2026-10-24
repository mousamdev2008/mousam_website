# Bug Fixing Using Cursor AI

## Description
This project demonstrates how Cursor AI can help identify and fix a logical error in a Python program.

## Bug Identified
The original program assigned each number to `total` instead of adding it, so it displayed only the last number.

## Fix Applied
Changed the statement to `total += numbers[i]` so that each number is added to the running total.

## Technologies Used
- Python 3
- Cursor AI

## How to Run
1. Install Python 3.
2. Open the terminal in this folder.
3. Run:

```bash
py buggy_program.py
```

## Expected Output

```text
Sum of numbers: 150
```

## Learning Outcome
Learned how to identify a logical error, use AI-assisted debugging, and verify the corrected program's output.
