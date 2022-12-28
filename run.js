import { std_lib } from "./std_lib.js";
import * as pretty from "./pretty.js"

export function run(tkns) {
    const vartac = {};
    const stack = []
    const ddl = !true

    for (let i = 0; i < std_lib.length; i++) {
        libs[std_lib[i].name] = {
            src: std_lib[i].src,
            exec: std_lib[i].exec
        }
    }

    const _tmp = cycle(tkns, stack, vartac, ddl);

    // console.log(tmp.stack);
}

let depth = 0
export const libs = {}
export const cycle = (tks, stack, vartac, ddl) => {
    if (ddl && depth != 0) console.log(".new cycle  _ " + depth + " _________________________")
        depth++

    for (let i = 0; i < tks.length; i++) {
        if (tks[i].type == "call") {
            if (libs[tks[i].value]) {
                const temp = libs[tks[i].value].exec(stack, vartac, tks[i], ddl)
                if (temp) {
                    if (temp.vartac) vartac = temp.vartac
                    if (temp.stack) stack = temp.stack
                    if (temp.ddl != undefined) ddl = temp.ddl
                }
            } else if (vartac[tks[i].value.slice(1)] && vartac[tks[i].value.slice(1)].stype == "function") {
                const temp = cycle(vartac[tks[i].value.slice(1)].call, stack, vartac, ddl)
                if (temp) {
                    if (temp.vartac) vartac = temp.vartac
                    if (temp.stack) stack = temp.stack
                    if (temp.ddl != undefined) ddl = temp.ddl
                }
            } else {
                console.log(pretty.assemble("/@c;/red//>b/error/*r/: function undefined\n  token: ")+stringify(tks[i]))
            }
        } else {
            //todo: more specific pushing
            if (tks[i]) {
                stack.push({
                    type:tks[i].type,
                    value:tks[i].value
                })
            }
        }
        
        if (ddl)
            console.log(typ(stack) + ": " + tks[i].value + " (" + tks[i].type + ")")
    }

    depth--
    if (ddl && depth != 0)
        console.log(".end cycle  _ " + depth + " _________________________")

    return {
        stack: stack,
        vartac: vartac,
        ddl: ddl
    }
};

function typ(vl) {
    let str = "["
    for (let i = 0; i < vl.length; i++) {
        if (vl[i])
            str += vl[i].type + (i + 1 < vl.length ? " " : "")
        else
            console.log(vl[i])
    }
    return str + "]"
}

function stringify(token) {
    return pretty.assemble("/*n/    type: /@c;/blue/"+token.type+"/*r/*n/    val: /@c;/green/"+token.value+"/*r/*n/    ln: /@c;/orange/"+token.line+"/*r/*n/    col: /@c;/orange/"+token.col+"/*r/")
}