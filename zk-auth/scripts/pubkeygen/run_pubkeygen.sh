#!/bin/bash

BUILD_DIR=../../build/pubkeygen
CIRCUIT_NAME=pubkeygen
INPUT_DIRECTORY=../../../server/inputs/
echo "****GENERATING WITNESS FOR NEW INPUT****"
start=`date +%s`
node "$BUILD_DIR"/"$CIRCUIT_NAME"_js/generate_witness.js "$BUILD_DIR"/"$CIRCUIT_NAME"_js/"$CIRCUIT_NAME".wasm $INPUT_DIRECTORY$1 "$BUILD_DIR"/outputs/witness_"$2".wtns
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****GENERATING PROOF FOR NEW INPUT****"
start=`date +%s`

npx snarkjs groth16 prove "$BUILD_DIR"/"$CIRCUIT_NAME".zkey "$BUILD_DIR"/outputs/witness_"$2".wtns "$BUILD_DIR"/outputs/proof_"$2".json "$BUILD_DIR"/outputs/public_"$2".json
end=`date +%s`
echo "DONE ($((end-start))s)"

echo "****VERIFYING PROOF FOR NEW INPUT****"
start=`date +%s`
npx snarkjs groth16 verify "$BUILD_DIR"/vkey.json "$BUILD_DIR"/outputs/public_"$2".json "$BUILD_DIR"/outputs/proof_"$2".json
end=`date +%s`
echo "DONE ($((end-start))s)"

node log_private_key_idetifier.js $2