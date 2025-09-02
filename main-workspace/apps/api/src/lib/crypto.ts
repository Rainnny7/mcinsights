import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

// Ensure we have a valid encryption key
const getEncryptionKey = () => {
    // Ensure the key is 32 bytes (256 bits)
    return Buffer.from(env.ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32));
};

export const encrypt = (text: string): string => {
    const iv = randomBytes(IV_LENGTH);
    const salt = randomBytes(SALT_LENGTH);
    const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    // Combine IV, salt, tag, and encrypted data
    return Buffer.concat([iv, salt, tag, encrypted]).toString("base64");
};

export const decrypt = (encryptedText: string): string => {
    const buffer = Buffer.from(encryptedText, "base64");

    // Extract IV, salt, tag, and encrypted data
    const iv = buffer.subarray(0, IV_LENGTH);
    // const salt = buffer.subarray(IV_LENGTH, IV_LENGTH + SALT_LENGTH);
    const tag = buffer.subarray(
        IV_LENGTH + SALT_LENGTH,
        IV_LENGTH + SALT_LENGTH + TAG_LENGTH
    );
    const encrypted = buffer.subarray(IV_LENGTH + SALT_LENGTH + TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]).toString("utf8");
};
