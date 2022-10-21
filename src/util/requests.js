import axios from "axios";
import fileDownload from "js-file-download";
import { API_URL } from "../services/config";
/*****************************************************
 * Function
 *****************************************************/
/**
 * @typedef LoginObject
 * @property {number} code Code number
 * @property {string} status ok or error
 * @property {string} description A description about the response
 */

/**
 * Function that executes a POST request to "API_URL_URL/login", returns the server response
 * @async
 * @param {string} user The username
 * @param {string} password The password
 * @returns {Promise<LoginObject>}
 */
const requestLogin = async (user, password) => {
  //to send www-form-urlencoded
  const params = new URLSearchParams();
  params.append("user", user);
  params.append("password", password);
  //make request
  const response = await axios.post(`${API_URL}/login`, params, {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });

  return response.data;
};

/*****************************************************
 * Function
 *****************************************************/
/**
 * Function that executes a GET request to "API_URL/generate-keys", returns a zip file with 2 keys
 * @async
 */
const requestGenerateKeys = async () => {
  //generate keys
  const response = await axios.get(`${API_URL}/generate-keys`, {
    responseType: "blob"
  });

  //download file
  fileDownload(response.data, "keys.zip");
};

/*****************************************************
 * Function
 *****************************************************/
/**
 * @typedef EncryptObject
 * @property {number} code Code number
 * @property {string} status ok or error
 * @property {string} description A description about the response
 * @property {string} encryptedText The encrypted text generated
 */

/**
 * Function that executes a POST request to "API_URL/encrypt", returns the server response
 * @param {string} file File that will be encrypted
 * @param {string} text Text to be encrypted
 * @param {string} publicKey Public key to encrypt content
 * @returns {Promise<EncryptObject>}
 */
const requestEncrypt = async (file, text, publicKey) => {
  const form = new FormData();
  //create form with file, text and public key
  form.append("publicKey", publicKey);
  form.append("textToEncrypt", text);
  //file always on the bottom
  form.append("fileToEncrypt", file);

  const response = await axios.post(`${API_URL}/encrypt`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
};

/*****************************************************
 * Function
 *****************************************************/
/**
 * @typedef DecryptObject
 * @property {number} code Code number
 * @property {string} status ok or error
 * @property {string} description A description about the response
 * @property {string} originalText The decrypted text obtained
 */

/**
 * Function that executes a POST request to "API_URL/decrypt", returns the server response
 * @param {string} file File that will be decrypted
 * @param {string} text Text to be decrypted
 * @param {string} privateKey Private key to decrypt the content
 * @returns {Promise<DecryptObject>}
 */
const requestDecrypt = async (file, text, privateKey) => {
  const form = new FormData();
  //create form with file, text and private key
  form.append("privateKey", privateKey);
  form.append("textToDecrypt", text);
  //file always on the bottom
  form.append("fileToDecrypt", file);

  const response = await axios.post(`${API_URL}/decrypt`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
};

/*****************************************************
 * Function
 *****************************************************/
/**
 * Function that executes a POST request to download the encrypted text into a file
 * @param {*} content Encrypted text to download into a file
 */
const requestDownloadEncrypt = async content => {
  //to send www-form-urlencoded
  const params = new URLSearchParams();
  params.append("encryptedText", content);
  //download file with encrypted text
  const response = await axios.post(`${API_URL}/download-encrypted-text`, params, {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });

  //download file
  fileDownload(response.data, "cifrado.rsa");
};

/*****************************************************
 * Function
 *****************************************************/
/**
 * Function that executes a POST request to download the decrypted text into a file
 * @param {*} content Decrypted text to download into a file
 */
const requestDownloadDecrypt = async content => {
  //to send www-form-urlencoded
  const params = new URLSearchParams();
  params.append("originalText", content);
  //download file with decrypted text
  const response = await axios.post(`${API_URL}/download-decrypted-text`, params, {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });

  //download file
  fileDownload(response.data, "descifrado.rsa");
};

//export functions
export {
  requestLogin,
  requestGenerateKeys,
  requestEncrypt,
  requestDecrypt,
  requestDownloadEncrypt,
  requestDownloadDecrypt
};
