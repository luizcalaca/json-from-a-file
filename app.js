const f4 = require("./f4")

function f1() {
    return undefined
}

function f2() {
    f1()
    f2()
    f4()
    return undefined
}

function f3() {
    f1()
}

f2()