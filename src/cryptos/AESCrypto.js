const CryptoJS = require("crypto-js");

export const randomClientKey = (DF) => {
	var clientKey = DF.getPublicKey();

	return clientKey;
};

//generate key AES
export const AESGenerateSecretKey = (DF, serverPublicKey) => {
	// sau khi trao đổi khóa Diffie-Hellman --> tạo AES key
	const AESKey = DF.generateSecretKey(serverPublicKey);

	//lưu vào local storage
	window.localStorage.setItem("AESKey", AESKey);
	return AESKey;
};

export const AESEncrypt = (jsonData) => {
	//láy key AES từ localstorage
	const key = window.localStorage.getItem("AESKey");
	if (key) return CryptoJS.AES.encrypt(JSON.stringify(jsonData), key).toString();
	return "😀";
};

export const AESDecrypt = (encrypt) => {
	//láy key AES từ localstorage
	const key = window.localStorage.getItem("AESKey");
	if (key) return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key)));
	return encrypt;
};

export const AESEncryptMessage = (message) => {
	//láy key AES từ localstorage
	const key = window.localStorage.getItem("AESKey");
	if (key) return CryptoJS.AES.encrypt(message, key).toString();
	return "😀";
};

export const AESDecryptMessage = (encrypt) => {
	//láy key AES từ localstorage
	const key = window.localStorage.getItem("AESKey");
	if (key) return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key));
	return encrypt;
};
