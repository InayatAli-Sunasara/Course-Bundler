import dataURIParser from "datauri/parser.js";
import path, { extname } from "path";
const getDataUri = (file) => {
  const parser = new dataURIParser();
  const extName = path.extname(file.originalname).toString();

  return parser.format(extName, file.buffer);
};
export default getDataUri;
