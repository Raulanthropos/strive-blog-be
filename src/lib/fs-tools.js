import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import { createReadStream } from "fs";

const { writeFile, readJSON, writeJSON } = fs;

export const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);
export const usersAvatarImagesPath = join(process.cwd(), "./public/img");
export const coverImagesPath = join(process.cwd(), "./public/blogImgs");

const authorsJSONPath = join(dataFolderPath, "authors.json");
const blogsJSONPath = join(dataFolderPath, "blogs.json");

export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONPath, authorsArray);
export const getBlogs = () => readJSON(blogsJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(blogsJSONPath, blogsArray);

export const saveAuthorsAvatar = (fileName, avatarAsBuffer) =>
  writeFile(join(usersAvatarImagesPath, fileName), avatarAsBuffer);

export const getAuthorsJsonReadableStream = () => createReadStream(authorsJSONPath)

export const saveBlogCoverImage = (fileName, coverAsBuffer) =>
  writeFile(join(coverImagesPath, fileName), coverAsBuffer);