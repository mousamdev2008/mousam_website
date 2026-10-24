
def calculate_sum(numbers):
    """Calculate the sum of the numbers."""
    total = 0
    for num in numbers:
        total += num
    return total

def calculate_average(numbers):
    """Calculate the average of the numbers."""
    return calculate_sum(numbers) / len(numbers)

def calculate_max(numbers):
    """Find the maximum value in the list."""
    maximum = numbers[0]
    for num in numbers:
        if num > maximum:
            maximum = num
    return maximum

# List of numbers
numbers = [45, 12, 78, 23, 12, 90, 34]

# Calculate sum, average, and max
numbers_sum = calculate_sum(numbers)
numbers_average = calculate_average(numbers)
numbers_max = calculate_max(numbers)

# Output results
print("numbers", numbers)
print("sum", numbers_sum)
print("average", numbers_average)
print("max", numbers_max)
