import sys
import re

green = '\033[92m'
blue = '\033[94m'
yellow = '\033[93m'
red = "\x1b[31m"

def square(n):
    if n == 1:
        return 1
    elif n < 0:
        return 0
    else:
        res = n**0.5
        return res

def extractPoly(exp, inverseCoef= False):
    polyTerm = []
    polys = re.findall(r'(([+-] )?\d*\.?\d+ \* X\^\d+)',exp)
    pattern = re.compile(r'[*^]')
    for poly in polys:
        x = pattern.split(poly[0])
        nbrTag = re.compile(r'\s')
        y = nbrTag.sub('',x[0])
        z = nbrTag.sub('',x[2])
        polyTerm.append({
        "power": float(z),
        "coef": float(y) if not inverseCoef else -1 * float(y)
        })
    return polyTerm
def maximumPower (poly):
    maxPower = 0
    for item in poly:
        if maxPower < item['power'] and item['coef'] != 0:
            maxPower = int(item['power'])
    return maxPower
def ReducedPoly (poly):
    maxPower = maximumPower (poly)
    polyTerm = []
    
    for i in range(0,maxPower+1):
        coef = 0
        for item in poly:
            if item['power'] == i:
                coef += item['coef']
        if(coef != 0):
            polyTerm.append({
            "power": i,
            "coef": coef
            })
    reduceStr = ''
    c = 0
    maxPower = maximumPower (polyTerm)
    for item in polyTerm:
        if item['power'] == 0:
            if item['coef'] > 0:
                reduceStr += str(item['coef']) + ' '
                c +=1
            else :
                reduceStr += '- ' + str(-item['coef']) + ' '
                c +=1
        else :
            if item['coef'] > 0:
                if item['coef'] == 1:
                    reduceStr += ' + ' + 'X^' + str(item['power']) + ' '
                    c +=1
                else :
                    reduceStr += ' + ' + str(item['coef']) + ' * X^' + str(item['power'])
                    c +=1
            elif item['coef'] < 0:
                if item['coef'] == -1:
                    reduceStr += ' - ' + 'X^' + str(item['power'])
                    c +=1
                else :
                    reduceStr += ' - ' + str(-item['coef']) + ' * X^' + str(item['power'])
                    c +=1
    reduceStr += '= 0' if c > 0 else '0 = 0'
    print(blue + "- Reduced form :  " + green + str(reduceStr))
    print(blue + "- Polynomial degree :  " + green + str(maxPower))
    result =dict()
    result['polyterm'] = polyTerm
    result['degree'] = maxPower
    return result

def resolvePolynom(r):
    polyterm = r['polyterm']
    a = b = c = 0
    degree = r['degree']
    
    if(degree <= 2):
        for item in polyterm:
            if(item['power'] == 2): a = item['coef']
            elif (item['power'] == 1): b = item['coef']
            elif (item['power'] == 0): c = item['coef']
        if(degree <= 1):
            if(b == 0):
                if(c == 0):
                    print(yellow + "\tAll real numbers are a solution")
                else:
                    print(yellow + "\tNo Solution")
            else:
                res = -c / b
                print(yellow + "\tThe solution is :  " + green + str(res))
        elif(degree == 2):
            delta = (b * b) - (4 * a * c)
            if(delta < 0):
                reel = -b / (2 * a)
                imaginary = square(-delta) / (2 * a)
                print(blue + "- Discriminant is strictly negative, the two complex solutions are:")
                print(yellow + "\tThe Solution 1 is :  " + green + str(reel) + ' + ' + str(imaginary) + ' * i')
                print(yellow + "\tThe Solution 2 is :  " + green + str(reel) + ' - ' + str(imaginary) + ' * i')
            elif(delta == 0):
                if(a == 0): print(yellow + '\tAll real numbers are a solution')
                else :
                    res = -b / (2 * a)
                    print(blue + "- Discriminant is null")
                    print(yellow + "\tThe solution is :  " + green + str(res))
            elif (delta > 0):
                res1 = (-b - square(delta)) / (2 * a)
                res2 = (-b + square(delta)) / (2 * a)
                print(blue + "- Discriminant is strictly positive, the two solutions are:")
                print(yellow + "\tThe Solution 1 is :  " + green + str(res1))
                print(yellow + "\tThe Solution 2 is :  " + green + str(res2))
    else:
        print(red + "- The polynomial degree is stricly greater than 2, I can't solve.")
if(len(sys.argv) == 2):
    statement = str(sys.argv[1])
    match = re.search(r'(?P<equation>(?P<firstSide>(([+-] )?\d*\.?\d+ \* X\^\d+ ?)+) = (?P<secondSide>(([+-] )?\d*\.?\d+ \* X\^\d+ ?)+))',statement)
    if(match):
        equation = match.group('equation')
        firstSide = match.group('firstSide')
        secondSide = match.group('secondSide')
        res = extractPoly(firstSide) + extractPoly(secondSide,True)
        r = ReducedPoly(res)
        resolvePolynom(r)
    else:
        print (red + 'Syntax Error')
else:
    print (red + 'Syntax Error')

