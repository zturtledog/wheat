import { parse } from "./parser.js"
import * as run from "./run.js"
import * as pretty from "./pretty.js"

if (Deno.args.length) {
    if (Deno.args[0] == "tutorial") {
        //todo: someday
    } else if (Deno.args[0] == "help") {
        console.log(pretty.assemble(`/@c;/yellow/commands: 
   /@cl/FF0080/wheat/ /@c;/cyan/./slsh/file.wheat        /@c;/grey/#run a file
   /@cl/FF0080/wheat/ /@c;/cyan/help/               /@c;/grey/#print this message/*r`))//   /@cl/FF0080/wheat/ /@c;/cyan/tutorial/           /@c;/grey/#take a quick walkthrough of the language
    } else {
        const data = await parse(Deno.args[0])
        run.run(data)
    }
} else {
    console.log("you forgor the file path")
}
