
num = int(input("Enter the number of terms: "))

a = 0
b = 1

if num <= 0:
    print("Please enter a positive number")
else:
    for i in range(num):
        print(a, end=" ")
        c = a + b
        a = b
        b = c
