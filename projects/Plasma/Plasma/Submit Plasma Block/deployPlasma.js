const { bytecode, abi } = require('./Plasma.json');
const { web3 } = require('./web3Util.js');

const PlasmaContract = new web3.eth.Contract(abi);

const deploy = (operator) => {
    const deployParameters = {
        data: bytecode
    }
    return PlasmaContract.deploy(deployParameters).estimateGas().then((gas) => {
        return PlasmaContract.deploy(deployParameters).sendAsync({
            from: operator,
            gas,
        }, () => {});
    })
}

module.exports = deploy;