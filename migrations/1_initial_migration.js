const CustomERC20 = artifacts.require('CustomERC20');

module.exports = function (deployer) {
    deployer.deploy(CustomERC20, "Salva", "SBR");
}
