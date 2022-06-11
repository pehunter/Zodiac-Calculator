import os

def remove_non_ascii(s):
    return "".join(c for c in s if ord(c)<128)

#Template string for CSV
csvLine = "%s-%02d-%02d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d\n"


#Setup month and year tracking
months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
days = ['M', 'W', 'T', 'S', 'F']
chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j','k','l','°']

#Keep track of the current signs. For every letter encountered, this array will be updated.
#Remains after each file!
#Sun,Moon,Mercury,Venus,Mars,Jupiter,Saturn,Uranus,Neptune,Pluto
currentSigns = [0,0,0,0,0,0,0,0,0,0]

#Iterate through each file in raw directory
fileList = os.listdir("data/raw")
print(fileList)
for fileName in fileList:
    #Open file
    file = open("./data/raw/" + fileName, 'r')

    #Move to JANURARY
    file.seek(420)

    #Read first line to establish self
    firstLine = file.readline()

    #Start in Janurary with current year
    currentMonth = 1
    currentYear = firstLine.split(' ')[1]

    #Initialize CSV
    currentCSVFile = open("./data/" + currentYear + ".csv", 'w')
    currentCSVFile.write("Date,Sun,Moon,Mercury,Venus,Mars,Jupiter,Saturn,Uranus,Neptune,Pluto\n")

    #While there is still data...
    for line in file:
        #If line is valid enough
        if(len(line) > 3):
            #If line is a month line
            if(line[0:3] in months):
                #Get month and year
                currentMonth = months.index(line[0:3]) + 1
                #print('month: {}'.format(currentMonth, currentYear))
            #If the line is a data line
            elif(line[0] in days):
                #Add space at beginning
                if(line[1] != ' '):
                    line = line[0] + " " + line[1:]
                
                #For special chars, remove after space.
                for char in chars:
                    idx = line.find(char + " ")
                    while(idx != -1):
                        line = line[0:idx+1] + line[idx+2:]
                        idx = line.find(char + " ")

                #Split
                splitLine = line.split(' ')

                #Update signs
                #Go through each planet column
                for col in range(5, 15):

                    #Iterate through sign letters
                    for charIdx in range(0, len(chars) - 1):
                        
                        #Look for char
                        idx = splitLine[col].find(chars[charIdx])

                        #If the char was found, update the sign table.
                        if(idx > -1):
                            currentSigns[col - 5] = charIdx
                            #print(splitLine[col])
                            #print('Update: column {} is now {}'.format(col - 5, charIdx))
                            break

                #Retrieve day
                currentDay = int(splitLine[1])

                #Format line
                dataLine = csvLine % (currentYear, currentMonth, currentDay, 
                currentSigns[0],
                currentSigns[1],
                currentSigns[2],
                currentSigns[3],
                currentSigns[4],
                currentSigns[5],
                currentSigns[6],
                currentSigns[7],
                currentSigns[8],
                currentSigns[9])

                #print(remove_non_ascii(line), end='')
                #print(splitLine[14], end='\n')
                #print(dataLine)
                currentCSVFile.write(dataLine)
    file.close()
    currentCSVFile.close()