const hmacSHA = require("crypto-js/hmac-sha256");
const Base64 = require("crypto-js/enc-base64");

export const signatureData = (data, key) => {
	const hmacDigit = Base64.stringify(hmacSHA(data, key));
	return hmacDigit;
};

export const verifyData = (signatureData, data, key) => {
	const hmacDigit = Base64.stringify(hmacSHA(data, key));
	return signatureData === hmacDigit;
};
