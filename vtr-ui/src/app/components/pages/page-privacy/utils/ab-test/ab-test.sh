#!/bin/sh

currentDirectory=$(dirname $(readlink -f $0))

#!/usr/bin/env node
node $currentDirectory/index.js

npx json-schema-to-typescript --no-enableConstEnums $currentDirectory/mySchema.json > $currentDirectory/ab-tests.type.ts

[ -f $currentDirectory/mySchema.json ] && rm $currentDirectory/mySchema.json
