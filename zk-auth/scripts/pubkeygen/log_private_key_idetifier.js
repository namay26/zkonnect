const fs = require('fs');
const fileName = process.argv[2];
const data = JSON.parse(fs.readFileSync(`../../build/pubkeygen/outputs/public_${fileName}.json`, "utf8"));

function toHexString(num) {
    return BigInt(num).toString(16);
}

let public_key = '';
data.forEach(element => {
    public_key += toHexString(element);
});

console.log("Public key: ",public_key);
