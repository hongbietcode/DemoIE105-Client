const NodeRSA = require("node-rsa");

export const RsaEncrypt = (publicKey, bit, data) => {
	const key = new NodeRSA({b: bit});
	key.importKey(publicKey);
	return key.encrypt(data, "base64");
};
