import urllib

link = 'https://www.celestrak.com/NORAD/elements/supplemental/starlink.txt'
file = urllib.urlopen(link)
outputFile = open('./data/latest.html','w')
outputFile.write(file.read())