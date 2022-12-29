// import * as reparse from "./reparse.js";
import * as reparse from "https://deno.land/x/reparse@v0.02-5/reparse.js";

const rules = {
    match: [
        //comment
        // ["comment", /#.*/],
        ["comment",/[#](?:\\[#\\]|[^\n#\\])*[#|\n]/],
        //string
        ["string", [
            /['](?:\\['\\]|[^\n'\\])*[']/,
            /["](?:\\["\\]|[^\n"\\])*["]/]],
        //operequals
        //operators
        ["operator", [
            /\+/, /-/,
            /\*/, /\//,
            /\|\|/, /&&/,
            /%/, /\^\^/]],
        //comma
        ["comma",/,/],
        //cpartalism
        ["dollar",/\$/],
        //assort
        ["cropen", /\{/],
        ["crclose", /\}/],
        ["blopen", /\[/],
        ["blclose", /\]/],
        ["propen", /\(/],
        ["prclose", /\)/],
        //i1-mod
        ["incrementor", /\+\+/],
        ["decrementor", /--/],
        //dotcall
        ["call", /\.[a-zA-Z_]+/],
        //type
        ["type", /:[a-zA-Z_]+:/],
        //number
        ["hex-number", /0x-?(0|[1-9]|[0-9]|[a-f]|[A-F])+/],//0x-43fF4
        ["number", /-?(?:0|[1-9][0-9]*)\.?(?:0|[1-9][0-9]*)?/],
        //nl
        ["newline", /\r?\n/],
        ["whitespace", /\s|\t/],
        //word
        ["pointer", /~[a-zA-Z_]+/],
        ["word", /[a-zA-Z_]+/],
    ],

    callback: {
        string: (inp) => {
            return inp.slice(1, -1);
        },
        number: (inp) => {
            return parseFloat(inp)
        },
        "hex-number": (inp) => {
            return parseInt(inp.slice(2),16)
        },
        pointer: (inp) => {
            return inp.slice(1)
        }
    },

    blocks: [
        ["cropen", "crclose", "block"],
        ["blopen", "blclose", "array"],
        ["propen", "prclose", "parameter"],
    ],

    linecount: ["newline"],
    specresolve: (unres) => {
        return unres;
    },

    blockcallback:{
        block: (tkns) => remw(tkns),
        array: (tkns) => {
            for (let i = 0; i < tkns.length; i++) {
                if (tkns[i]) {
                    tkns[i] = {
                        type:tkns[i].type,
                        value:tkns[i].value
                    }
                }
            }
        },
        parameter: (tkns)=>{
            const rns = []
            for (let i = 0; i < tkns.length; i++) {
                if (tkns[i].type != "type") {
                    //todo: error
                }
                rns.push(tkns[i].value)
            }
            return tkns
        }
    },
    errorcallback: (token, error,t) => { console.log(error+": "+t+": "+JSON.stringify(token)) },
};

export async function parse(file,out) {
    const decoder = new TextDecoder("utf-8")
    const data = decoder.decode(await Deno.readFile(file))
    const pdat = remw(reparse.lex(data, rules))
    
    if (out)
    Deno.writeTextFile(out, JSON.stringify(pdat))

    return pdat
}

function remw(tks) {
    const ns = []
    for (let i = 0; i < tks.length; i++) {
        if (!(["newline", "whitespace", "comment","dollar"].includes(tks[i].type))) {
            ns.push(tks[i])
        }
    }
    
    return ns
}


// //string comment array|params|block|object

// async function parse(file) {
//     const decoder = new TextDecoder("utf-8")
//     const data = decoder.decode(await Deno.readFile(file))

//     let incomment = false
//     let instring = false
//     let inparam = false
//     let inblock = false
//     let inobj = false
//     for (let i = 0; i < data.length; i++) {
//         if (!instring && data[i] == '#') {
//             incomment = true
//         }

//         if (!incomment &&
//             (data[i] == "'" || data[i] == '"') &&
//             (data[i - 1] != "\\" ? true : data[i - 2] == "\\")
//         ) {
//             instring = !instring;
//         }
//     }
// }

