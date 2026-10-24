
numbers = [10, 20, 30, 40, 50]

total = 0

for i in range(len(numbers)):
    total += numbers[i]  # Fixed: accumulate the sum instead of replacing total each time

print("Sum of numbers:", total)
