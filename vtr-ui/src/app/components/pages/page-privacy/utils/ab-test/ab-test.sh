#!/bin/sh

currentDirectory=$(dirname $(readlink -f $0))

#!/usr/bin/env node
node $currentDirectory/index.js

npx json-schema-to-typescript --no-enableConstEnums $currentDirectory/abTestsConfig.json > $currentDirectory/ab-tests.type.ts

[ -f $currentDirectory/abTestsConfig.json ] && rm $currentDirectory/abTestsConfig.json
