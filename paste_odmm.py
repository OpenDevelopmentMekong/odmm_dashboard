import os

def main():
    filename = "dashboard.html"
    newFilename = "toPaste.html"
    fRead = open(filename, 'r')
    fWrite = open(newFilename, 'w+')

    for line in fRead:
        if ("<script class='internal'" in line):
            newLine = 

main()
