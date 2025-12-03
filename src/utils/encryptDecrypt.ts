
// ===============================
// AES Encryption / Decryption 
// ===============================
// Uses CryptoJS to securely encrypt and decrypt data using a 256-bit key
// Includes integrity check via HMAC (to detect tampering)
// ===============================


import CryptoJS from "crypto-js";

// Load the secret key from env
const rawKey = import.meta.env.VITE_SECRET_KEY as string
let SECRET_KEY: CryptoJS.lib.WordArray;

// Check if key is hex-encoded (64 characters, all hex digits)
if (rawKey.length === 64 && /^[0-9a-fA-F]{64}$/.test(rawKey)) {
    SECRET_KEY = CryptoJS.enc.Hex.parse(rawKey);
} else {
    SECRET_KEY = CryptoJS.enc.Utf8.parse(rawKey);
}

// Verify key is 32 bytes (256 bits)
if (SECRET_KEY.sigBytes !== 32) {
    throw new Error("SECRET_KEY must be 32 bytes (256 bits)");
}


// ------------------------------------------------------
// Encrypttion Function
// ------------------------------------------------------
// Encrypts JSON payload using AES-CBC and generates an HMAC for data integrity.
export function encrypt(payload: any) {
    const iv = CryptoJS.lib.WordArray.random(16); 
    const plaintext = JSON.stringify(payload);

    const encrypted = CryptoJS.AES.encrypt(plaintext, SECRET_KEY, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const ciphertext = encrypted.ciphertext;

    const toMac = iv.clone().concat(ciphertext);
    const mac = CryptoJS.HmacSHA256(toMac, SECRET_KEY);

    return {
        iv: CryptoJS.enc.Base64.stringify(iv),
        data: CryptoJS.enc.Base64.stringify(ciphertext),
        mac: CryptoJS.enc.Base64.stringify(mac),
    };
}


// ------------------------------------------------------
// Decrypttion Function
// ------------------------------------------------------
// Decrypts payload back into the original data object.
// Also verifies MAC before decryption to ensure authenticity.
export function decrypt(payload: any) {
    const iv = CryptoJS.enc.Base64.parse(payload.iv);
    const ciphertext = CryptoJS.enc.Base64.parse(payload.data);
    const mac = CryptoJS.enc.Base64.parse(payload.mac);

    const toMac = iv.clone().concat(ciphertext);
    const calcMac = CryptoJS.HmacSHA256(toMac, SECRET_KEY);
    
    if (!hashEquals(calcMac, mac)) {
        throw new Error("MAC verification failed - data may have been tampered with");
    }

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext } as any,
        SECRET_KEY,
        {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedStr) {
        throw new Error("Decryption failed - invalid key or corrupted data");
    }

    return JSON.parse(decryptedStr);
}


// ------------------------------------------------------
// Constant-Time Comparison
// ------------------------------------------------------
// Prevents timing attacks when comparing two hashes (MACs)
function hashEquals(a: CryptoJS.lib.WordArray, b: CryptoJS.lib.WordArray): boolean {
    const aHex = CryptoJS.enc.Hex.stringify(a);
    const bHex = CryptoJS.enc.Hex.stringify(b);
    
    if (aHex.length !== bHex.length) {
        return false;
    }
    
    let result = 0;
    for (let i = 0; i < aHex.length; i++) {
        result |= aHex.charCodeAt(i) ^ bHex.charCodeAt(i);
    }
    
    return result === 0;
}