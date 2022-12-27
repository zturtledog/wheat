export const reset = "\x1b[0m"
export const lnup = "\x1b[F"

export const fg = {
    black:"\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    grey: rgb_fore(69, 67, 74)
}

export const bg = {
    black : "\x1b[40m",
    red : "\x1b[41m",
    green : "\x1b[42m",
    yellow : "\x1b[43m",
    blue : "\x1b[44m",
    magenta : "\x1b[45m",
    cyan : "\x1b[46m",
    white : "\x1b[47m",
    grey : rgb_back(69, 67, 74)
}

export function rgb_back(r, g, b) {return "\x1b[48;2;"+r+";"+g+";"+b+"m"}
export function rgb_fore(r, g, b) {return "\x1b[38;2;"+r+";"+g+";"+b+"m"}

export function parse_hex(str) {
    if (str.charAt(0) == "#") {
        str = str.replaceAll("#","")
    }
    if (str.length > 5) {
        return {
            r: parseInt(str.substring(0,2),16),
            g: parseInt(str.substring(2,4),16),
            b: parseInt(str.substring(4,6),16),
            a: str.length > 7 ? 255 : parseInt(str.substring(6,8),16)
        }
    }
}

export function assemble(src) {
    const data = src.split("/")
    let text = ""

    for (let i = 0; i < data.length; i++) {
        if (data[i] == "*n") {
            text+="\n"
        }
        else if (data[i] == "*r") {
            text+=reset
        }
        else if (data[i] == "slsh") {
            text+="/"
        }
        else if (data[i] == "@cl") {//change text color
            const ght = parse_hex(data[i+1])

            text+=rgb_fore(ght.r,ght.g,ght.b)+data[i+2]

            i+=2
        }
        else if (data[i] == "@c;") {//change text color
            text+=fg[data[i+1]]+data[i+2]

            i+=2
        }
        else if (data[i] == "@b;") {//change text color
            text+=bg[data[i+1]]+data[i+2]

            i+=2
        }
        else if (data[i] == "@bl") {//change background color
            const ght = parse_hex(data[i+1])

            text+=rgb_back(ght.r,ght.g,ght.b)+data[i+2]

            i+=2
        }
        else {
            text+=data[i]
        }
    }

    return text
}