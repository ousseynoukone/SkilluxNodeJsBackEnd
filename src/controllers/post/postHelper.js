
// Return strings that are in arrayOfStringA and not in arrayOfStringB
function getStringThatAreInAAndNotInB(arrayOfStringA,arrayOfStringB) {
    return arrayOfStringA.filter(str => !arrayOfStringB.includes(str));
}


// Return strings that are in arrayOfStringA and  in arrayOfStringB
function getStringThatAreInAAndInB(arrayOfStringA,arrayOfStringB) {
    return arrayOfStringA.filter(str => arrayOfStringB.includes(str));
}

module.exports = {getStringThatAreInAAndNotInB,getStringThatAreInAAndInB}