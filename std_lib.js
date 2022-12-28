import { cycle } from "./run.js"

export const std_lib = [
    // @ external
    // @ ????
    {//loop
        name: ".loop",
        src: "std",
        exec: (stack,vartac) => {// ${} num|str word
            if (stack.length > 2) {
                if (
                    stack[stack.length - 1].type == "word" &&
                    (
                        stack[stack.length - 2].type == "number" ||
                        stack[stack.length - 2].type == "word" ||
                        stack[stack.length - 2].type == "string"
                    ) &&
                    stack[stack.length - 3].type == "block"
                ) {
                    const _block = stack[stack.length - 3].value
                    const varible = stack[stack.length - 1]
                    let nxb = 0

                    switch (stack[stack.length - 2].type) {
                        case "number":
                            nxb = stack[stack.length - 2].value
                            break;
                        case "word":
                            if (vartac[stack[stack.length - 2].value] && 
                                vartac[stack[stack.length - 2].value].stype == "const" && 
                                vartac[stack[stack.length - 2].value].type == "number") {
                                nxb = vartac[stack[stack.length - 2].value].value
                            } else {
                                //todo: error
                            }
                            break;
                        case "string":
                            nxb = parseFloat(stack[stack.length - 2].value)
                            break;
                    }

                    if (vartac[varible.value]) {
                        console.log("error: varible overwrite error\n  name: '" + varible.value + "'")
                    }
                    for (let i = 0; i < nxb; i++) {
                        vartac[varible.value] = {
                            stype: "const",
                            type: "number",
                            value: i
                        }

                        cycle(_block, stack, vartac, false)
                    }
                    vartac[varible.value] = undefined

                    stack.pop()
                    stack.pop()
                    stack.pop()

                    return {
                        stack:stack,
                        vartac:vartac
                    }
                }
            }
            // const temp = cycle(vartac[tks[i].value.slice(1)].call, stack, vartac, ddl)
            // if (temp) {
            //     if (temp.vartac) vartac = temp.vartac
            //     if (temp.stack) stack = temp.stack
            //     if (temp.ddl != undefined) ddl = temp.ddl
            // }
        }
    },
    // @ debug
    {//debug
        name: ".debug",
        src: "std",
        exec: (_s, _v, _t, ddl) => {
            return { ddl: !ddl }
        }
    },
    // @ sai
    {//print
        name: ".print",
        src: "std",
        exec: (stack) => {
            if (stack.length > 0) {
                //todo: type handeling
                console.log(stack[stack.length - 1].value)
                stack.pop()

                return {
                    stack:stack
                }
            }
        }
    },
    // @ vartac
    {//function
        name: ".function",
        src: "std",
        exec: (stack, vartack) => {//${} name () .function
            if (stack.length > 2) {
                if (
                    stack[stack.length - 1].type == "parameter" &&
                    stack[stack.length - 2].type == "word" &&
                    stack[stack.length - 3].type == "block"
                ) {
                    if (vartack[stack[stack.length - 2].value]) {
                        console.log("error: varible overwrite error\n  name: '" + stack[stack.length - 2].value + "'")
                    }
                    vartack[stack[stack.length - 2].value] = {
                        stype: "function",
                        typrg: stack[stack.length - 1].value,
                        call: stack[stack.length - 3].value
                    }
                    stack.pop()
                    stack.pop()
                    stack.pop()
                } else {
                    console.log("error: stack pattern not recognized\n  proper formulation: ${} name () .function")
                }
            }
            return {
                vartac: vartack,
                stack: stack
            }
        }
    },
    {//const
        name: ".const",
        src: "std",
        exec: (stack, vartack) => {//any
            if (stack.length > 1) {
                if (
                    stack[stack.length - 1].type == "word"
                ) {
                    if (vartack[stack[stack.length - 1].value]) {
                        console.log("error: varible overwrite error\n  name: '" + stack[stack.length - 1].value + "'")
                    }
                    vartack[stack[stack.length - 1].value] = {
                        stype: "const",
                        type: stack[stack.length - 2].type,
                        value: stack[stack.length - 2].value
                    }

                    stack.pop()
                    stack.pop()
                } else {
                    console.log("error: stack pattern not recognized\n  proper formulation: any!(block|params) name .const\n  given formation: " + stack[stack.length - 2].type + " " + stack[stack.length - 1].type + " .const")
                }
            }
            return {
                vartac: vartack,
                stack: stack
            }
        }
    }
    // @ string 
    // @ array
]

/**
 * .function ${} word ()
 * .loop ${} num|str word
 * .print any
 * .const any!(block|params) word
*/

/*standard mk 2

@ external
    import string
    export word
@ ????
    loop ${} num|str word
    while
    if
    async usr_func
@ debug
    debug
@ sai
    print any
@ vartac
    function ${} word ()
    const any!(block|params) word
@ string
    @ array
        at
        replace
        push
        pop
        reverse
        remove
        slice
        length
    code
    trim
    uppercase
    lowercase
    array
    array

*/

/**
(fs)        .load_file string -> obj
(fs)        .save_file string string -> none
(var)       .get name -> any
(var)       .set any name -> none
(var)       .const type name -> none
(str)       .split string string -> string
(arr|str)   .at array|string number -> any
(arr|str)   .length string|array -> number
(terminal)  .console_prompt any -> string
 */
