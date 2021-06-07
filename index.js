const countDecimals = (value) => {
    return value % 1 ? value.toString().split(".")[1].length : 0;
}

const MySqrt = (number) => {
    return number ** 0.5
}

const extractFunc = (exp, inverseCoeff = false) => {
    let poly = []
    //console.log("exp : ",exp)
    const spl = exp.split(/(([+-] )?\d*\.?\d+ \* X\^\d+ ?)/)
    //console.log("spl :",spl)
    spl.forEach(term => {
        if(term && term.match(/(([+-] )?\d*\.?\d+ \* X\^\d+ ?)/)){
            //console.log(term)
            let termSpl = term.split('*')
            //console.log(termSpl)
            let polyTerm = {}
            termSpl.forEach(e => {
                //console.log("e : ",e)
                if(e.match(/^[+-] \d*\.?\d+ $/)){
                    const r = e.match(/([+-] )?\d*\.?\d+ /g)[0].replace(/\s/g, '')
                    //console.log('str : ',e.match(/([+-] )?\d*\.?\d+ /g)[0])
                    //console.log('r : ',r)
                    const res = parseFloat(r)
                    polyTerm.coeff = inverseCoeff === true ? res * -1 : res
                }
                else if(e.match(/^\d*\.?\d+ $/)){
                    const res = parseFloat(e.match(/\d*\.?\d+ /g)[0])
                    polyTerm.coeff = inverseCoeff === true ? res * -1 : res
                }
                else if(e.match(/^ X\^\d+ $/)){
                    const r = e.match(/\^\d*\.?\d+ $/g)[0].replace(/\s|\^/g, '')
                    const res = parseFloat(r)
                    polyTerm.power = res
                }
                else if(e.match(/^ X\^\d+$/)){
                    const r = e.match(/\^\d*\.?\d+$/g)[0].replace(/\s|\^/g, '')
                    const res = parseFloat(r)
                    polyTerm.power = res

                }
            });
            poly.push(polyTerm)
        }
    });
    return poly
}

const reduceFunc = polyn => {
    let reducedPol = []
    let passedPowers = []
    polyn.forEach(e => {
        if(!passedPowers.includes(e.power)){
            let matches = polyn.filter(item => item.power === e.power)
            if(matches.length > 1){
                let sum = 0
                matches.forEach(element => {
                    sum += element.coeff
                });
                if(sum !== 0)
                    reducedPol.push({coeff: sum, power: e.power})
                passedPowers.push(e.power)
            }
            else if(matches.length === 1){
                if(e.coeff !== 0)
                    reducedPol.push({coeff: e.coeff, power: e.power})
                passedPowers.push(e.power)
            }
        }
    });

    let maxPow = 0
    //console.log("reducedPol" ,reducedPol)
    let sorted = reducedPol.sort((a,b) => {return a.power - b.power})
    //console.log("sorted : ",sorted)
    let reducedStr = ''
    let c = 0
    sorted.forEach((element, i) => {
        if(element.coeff != 0 && element.power === 0){
            reducedStr += element.coeff + ' '
            c++
        }
        else if(element.coeff >= 0 && i === 0){
            reducedStr += element.coeff + ' * X^' + element.power + ' '
            c++
        } 
        else if(element.coeff >= 0){
            if(element.coeff === 1)
                reducedStr += '+ ' + 'X^' + element.power + ' '
            else
                reducedStr += '+ ' + element.coeff + ' * X^' + element.power + ' '
            c++
        } 
        else if(element.coeff < 0){
            if(element.coeff === -1)
                reducedStr += '- ' + 'X^' + element.power + ' '
            else
                reducedStr += '- ' + -element.coeff + ' * X^' + element.power + ' '
            c++
        } 
        if(element.power > maxPow)
            maxPow = element.power
    });
    reducedStr += c > 0 ? '= 0' : '0 = 0'
    console.log("\x1b[36m", "- Reduced form : ", "\x1b[33m" + reducedStr)
    console.log("\x1b[36m", "- Polynomial degree: ", "\x1b[33m" + maxPow)
    return {degree: maxPow, reducedPol: sorted}
}

const resolveFunc = (degree, poly) => {
    
    let deltaValues = {}
    const length = poly.length
    console.log("length : ",length)
    console.log("poly : ",poly[length-1])
    deltaValues.a = (poly[length-1] &&  poly[length-1].power === 2) ? poly[length-1].coeff : 0
    deltaValues.b = (poly[1] &&  poly[1].power === 1) ? poly[1].coeff : 0
    deltaValues.c = (poly[0] &&  poly[0].power === 0) ? poly[0].coeff : 0
    console.log("delta : ",deltaValues)
    if(degree <= 1){
        if(deltaValues.b === 0){
		    if(deltaValues.c === 0){
                console.log("\x1b[32m", "  All real numbers are a solution")
            }
            else{
                console.log("\x1b[31m", "  No solution")
            }
        }
        else{
                const sol = -deltaValues.c / deltaValues.b;
                console.log("\x1b[32m", '  The solution is : ', printSolution(sol))
        }
    }
    else if(degree === 2){
        const delta = (deltaValues.b ** 2) - (4 * deltaValues.a * deltaValues.c)
        if(delta < 0){
            const solution1 = {}
            const solution2 = {}
            solution1.reel = (-1 * deltaValues.b / (2 * deltaValues.a))
            solution1.imaginary = - MySqrt(-delta) / (2 * deltaValues.a)
            solution2.imaginary = MySqrt(-delta) / (2 * deltaValues.a)
            console.log("\x1b[36m", "- Discriminant is strictly negative, the two complex solutions are:")
            if(solution1.imaginary >= 0)
                console.log("\x1b[32m", "\tSolution 1 :", printSolution(solution1.reel)+ ' + '+ solution1.imaginary + ' * i' )
            else
                console.log("\x1b[32m", "\tSolution 1 :", printSolution(solution1.reel)+ ' - '+ (-solution1.imaginary) + ' * i' )
            if(solution2.imaginary >= 0)
                console.log("\x1b[32m", "\tSolution 2 :", printSolution(solution1.reel)+ ' + '+ solution2.imaginary + ' * i' )
            else
                console.log("\x1b[32m", "\tSolution 2 :", printSolution(solution1.reel)+ ' - '+ solution2.imaginary + ' * i' )
        }
        else if(delta === 0 && deltaValues.a === 0){
            console.log("\x1b[32m", "  All real numbers are a solution")
        }
        else if(delta === 0){
            const solution = (-1 * deltaValues.b) / (2 * deltaValues.a)
            console.log("\x1b[36m", "- Discriminant is null")
            console.log("\x1b[32m", "  The solution is : ", printSolution(solution))
        }
        else if(delta > 0){
            const solution1 = (-1 * deltaValues.b - MySqrt(delta)) / (2 * deltaValues.a)
            const solution2 = (-1 * deltaValues.b + MySqrt(delta)) / (2 * deltaValues.a)
            console.log("\x1b[36m", "- Discriminant is strictly positive, the two solutions are:")
            console.log("\x1b[32m", "\tSolution 1 :", printSolution(solution1))
            console.log("\x1b[32m", "\tSolution 2 :", printSolution(solution2))
        }
    }
    else
        console.log("\x1b[31m", "  The polynomial degree is stricly greater than 2, I can't solve.")
}

const printSolution = (n) => {
    return n.toFixed(countDecimals(n))
}

if(process.argv.length === 3 && process.argv[2].match(/^(([+-] )?\d*\.?\d+ \* X\^\d+ ?)+ = (([+-] )?\d*\.?\d+ \* X\^\d+ ?)+$/)){
    //console.log(process.argv[2])
    const match =  process.argv[2].match(/^(([+-] )?\d*\.?\d+ \* X\^\d+ ?)+ = (([+-] )?\d*\.?\d+ \* X\^\d+ ?)+$/)
     //console.log(match)
    const splited = match[0].split('=')
    // console.log("splited : ",splited)
    const resPol = [...extractFunc(splited[0]), ...extractFunc(splited[1], true)]
    //console.log("respol : ",resPol)
    const reduced = reduceFunc(resPol)
    //console.log("reduced : ",reduced)
     resolveFunc(reduced.degree, reduced.reducedPol)
}
else{
    console.log("\x1b[31m", '  Syntxxxxxax Error');
}