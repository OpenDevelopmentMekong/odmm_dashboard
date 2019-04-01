def main():
    mainFile = open("mbei.html", 'r', encoding='utf-8')
    writeFile = open("mbei_pasted.html", 'w+', encoding='utf-8')
    classId = 'class="internal"'
    cssId = '<link rel='

    for line in mainFile:
        if (classId in line):
            pasteScript(line, writeFile)
        elif (cssId in line):
            pasteCSS(line, writeFile)
        else:
            writeFile.write(line)

    writeFile.close()

def pasteCSS(line, writeFile):
    filename = line.split('"')[-2]
    importFile = open(filename, 'r', encoding='utf-8')
    writeFile.write("<style>\n")
    for row in importFile:
        writeFile.write(row)
    writeFile.write("</style>\n")
    
def pasteScript(line, writeFile):
    filename = line.strip().split(" ")[2].split('"')[1]
    importFile = open(filename, 'r', encoding='utf-8')
    writeFile.write("<script>\n")
    for row in importFile:
        writeFile.write(row)
    writeFile.write("</script>\n")

main()
