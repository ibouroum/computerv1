
const countDecimals = (value) => {
    return value % 1 ? value.toString().split(".")[1].length : 0;
}

const MySqrt = (number) => {
    return number ** 0.5
}
const extractPoly = (exp, inverseCoeff = false) => {
    const v1 = exp.split(/(([+-] )\d*\.?\d+ \* X\^\d+ ?)/);
    let terms = [];
    let poly = [];
    let i = 0;
    
    v1.forEach(term => {
        if(term && term.match(/(([+-] )?\d*\.?\d+ \* X\^\d+ ?)/)){
            terms[i] = term.split(/[*^]+/)
            i++;
        } 
    })
    let j = 0;
    terms.forEach(term =>{
        let polyTerm = {}
        let co = term[0].replace(/\s/g, '');
        let coef = parseFloat(co);
        polyTerm.coeff = inverseCoeff === true ? coef * -1 : coef
        let po = term[2].replace(/\s/g, '');
        let power = parseFloat(po);
        polyTerm.power = power;
        poly.push(polyTerm)
    })
    return poly
}

const ReducedPoly = pol => {
    let poly = [];
    let maxPow = 0
    pol.forEach(element => {
        if(element.power > maxPow)
            maxPow = element.power
    });
    for (let i = 0; i <= maxPow; i++) {
        let polyReducer = {}
        let Reducerpower = 0;
        pol.forEach(term=>{
            if(term.power === i)
            {
                Reducerpower += term.coeff;
                polyReducer.power = i;
                polyReducer.coeff = Reducerpower;
            }
            
        })
        if(Object.keys(polyReducer).length !== 0)
            poly.push(polyReducer) 
    }

    let reducedStr = ''
    let c = 0
    poly.forEach((element, i) => {
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
    });
    reducedStr += c > 0 ? '= 0' : '0 = 0'
    console.log("\x1b[36m", "- Reduced form : ", "\x1b[33m" + reducedStr)
    console.log("\x1b[36m", "- Polynomial degree: ", "\x1b[33m" + maxPow)
    return {degree: maxPow, reducedPol: poly}
}
const resolvePoly = (degree, poly) => {
    
    let deltaValues = {}
    if(degree <= 2)
    {
        deltaValues.a = (poly[2] &&  poly[2].power === 2) ? poly[2].coeff : 0
        deltaValues.b = (poly[1] &&  poly[1].power === 1) ? poly[1].coeff : 0
        deltaValues.c = (poly[0] &&  poly[0].power === 0) ? poly[0].coeff : 0
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
    }
    else
        console.log("\x1b[31m", "  The polynomial degree is stricly greater than 2, I can't solve.")
}

const printSolution = (n) => {
    return n.toFixed(countDecimals(n))
}
if(process.argv.length === 3 && process.argv[2].match(/^(([+-] )?\d*\.?\d+ \* X\^\d+ ?)+ = (([+-] )?\d*\.?\d+ \* X\^\d+ ?)+$/)){
    const poly =  process.argv[2].match(/^(([+-] )?\d*\.?\d+ \* X\^\d+ ?)+ = (([+-] )?\d*\.?\d+ \* X\^\d+ ?)+$/)
    const equation = poly[0].split('=')
    const resPol = [...extractPoly(equation[0]), ...extractPoly(equation[1], true)]
    const reduced = ReducedPoly(resPol)
    resolvePoly(reduced.degree, reduced.reducedPol)
}
else{
    console.log("\x1b[31m", '  Syntxxxxxax Error');
}

