const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

const source = fs.readFileSync(campaignPath, 'utf-8');
const contracts = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contractName in contracts) {
  fs.outputJSONSync(
    path.resolve(buildPath, contractName.replace(':', '') + '.json'),
    contracts[contractName]
  );
}
