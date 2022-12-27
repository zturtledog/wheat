export const std_lib = [
    // @ external
    // @ ????
    {//loop
        name: ".loop",
        src: "std",
        exec: (_stack) => {
            //
        }
    },
    // @ debug
    {//stackprint
        name: ".stackprint",
        src: "std",
        exec: (_s, _v, _t, ddl) => {
            return {ddl:!ddl}
        }
    },
    // @ sai
    {//print
        name: ".print",
        src: "std",
        exec: (_stack) => {
            //
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
                    stack[stack.length - 1].type == "word" &&
                    stack[stack.length - 2].type != "parameter" &&
                    stack[stack.length - 2].type != "block"
                ) {
                    //remove
                    stack.pop()
                    stack.pop()
                } else {
                    console.log("error: stack pattern not recognized\n  proper formulation: any!(block|params) name .const\n  given formation: "+stack[stack.length - 2].type+" "+stack[stack.length - 1].type+" .const")
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
    setstackprint bool
    stackprint
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
