export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt", "decrypt"]
  );
  return keyPair;
}

export async function encryptMessage(message, publicKey) {
  const encodedMessage = new TextEncoder().encode(message);
  const encryptedMessage = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    publicKey,
    encodedMessage
  );
  return encryptedMessage;
}
export async function importPrivateKey(arrayBuffer) {
  return await window.crypto.subtle.importKey(
    "pkcs8", // Private key format
    arrayBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" }, // Must match the encryption algorithm
    },
    true, // Whether the key is extractable
    ["decrypt"] // The key can only be used for decryption
  );
}
export async function decryptMessageWithPrivateKey(
  encryptedArrayBuffer,
  privateKey
) {
  console.log("1");
  try {
    const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      privateKey,
      encryptedArrayBuffer // This is the encrypted message as an ArrayBuffer
    );

    console.log("2");
    // Convert decrypted ArrayBuffer to a string
    const decryptedMessage = new TextDecoder().decode(decryptedArrayBuffer);
    console.log("3");
    return decryptedMessage;
  } catch (error) {
    console.error("Decryption failed:", error);
  }
}

export async function decryptMessage(base64PrivateKey, base64EncryptedMessage) {
  // Step 1: Import the private key
  const privateKeyArrayBuffer = base64ToArrayBuffer(base64PrivateKey);
  const privateKey = await importPrivateKey(privateKeyArrayBuffer);

  // Step 2: Convert the encrypted message from Base64 to ArrayBuffer
  const encryptedArrayBuffer = base64ToArrayBuffer(base64EncryptedMessage);

  // Step 3: Decrypt the message
  const decryptedMessage = await decryptMessageWithPrivateKey(
    encryptedArrayBuffer,
    privateKey
  );
  return decryptedMessage;
}

export async function exportPublicKey(publicKey) {
  const exportedKey = await window.crypto.subtle.exportKey(
    "spki", // This format is suitable for public keys
    publicKey
  );
  return exportedKey;
}
export async function exportPrivateKeyToBase64(privateKey) {
  // Step 1: Export the private key to an ArrayBuffer
  const exportedKey = await window.crypto.subtle.exportKey(
    "pkcs8", // Specify the format
    privateKey // The CryptoKey object
  );

  // Step 2: Convert ArrayBuffer to binary string
  const binaryString = String.fromCharCode(...new Uint8Array(exportedKey));

  // Step 3: Convert binary string to Base64
  const base64String = window.btoa(binaryString);

  return base64String;
}

export function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function parsePublicKey(base64PublicKey) {
  // console.log(base64PublicKey);
  const publicKeyArrayBuffer = base64ToArrayBuffer(base64PublicKey);
  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    publicKeyArrayBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt"]
  );

  return publicKey;
}
