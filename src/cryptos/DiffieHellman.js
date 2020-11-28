const DF_Browser = require("diffie-hellman/browser");

export default class DF_Client {
	constructor(group) {
		//Group Diffie-Hellman bao gồm bộ hai số nguyên tố và căn nguyên được chon sẳn
		//link : https://www.watchguard.com/help/docs/help-center/en-US/Content/en-US/Fireware/bovpn/manual/diffie_hellman_c.html
		this.client = DF_Browser.getDiffieHellman(group);
		this.client.generateKeys();
	}

	getPrime() {
		//chuyên thành base64
		const prime = this.client.getPrime().toString("base64");
		return prime;
	}

	getGenerator() {
		//chuyên thành base64
		const generator = this.client.getGenerator().toString("base64");
		return generator;
	}

	getPublicKey() {
		//chuyển thành base64
		const publicKey = this.client.getPublicKey().toString("base64");
		return publicKey;
	}

	getPrivateKey() {
		//chuyên thành base64
		const privateKey = this.client.getPrivateKey().toString("base64");
		return privateKey;
	}

	generateSecretKey(serverPublicKey) {
		//chuyển base thành buffer
		const serverKey = Buffer.from(serverPublicKey, "base64");
		const secretKey = this.client.computeSecret(serverKey).toString("base64");
		return secretKey;
	}
}
