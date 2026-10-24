
class Student:
    def __init__(self, name, roll_no, branch):
        self.name = name
        self.roll_no = roll_no
        self.branch = branch

student = Student("Mousam", 101, "CSE")

student_dict = student.__dict__

print("Student Dictionary:")
print(student_dict)
