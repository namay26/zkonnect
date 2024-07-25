const fs = require('fs');

const data = JSON.parse(fs.readFileSync("../../build/pubkeygen/public.json", "utf8"));

function toHexString(num) {
    return BigInt(num).toString(16);
}

let public_key = '';
data.forEach(element => {
    public_key += toHexString(element);
});

console.log("Public key: ",public_key);
