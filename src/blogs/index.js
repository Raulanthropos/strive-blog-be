import express, { response } from "express";

import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checksBlogPostSchema, triggerBadRequest } from "./validator.js";
import { getAuthors, getBlogs, writeBlogs } from "../lib/fs-tools.js";

const blogsRouter = express.Router();

const { NotFound, Unauthorized, BadRequest } = httpErrors;

// ........................................CRUD operations..................................

async function getBlogPostsWithAuthors() {
  const blogPostsArray = await getBlogs();
  const authors = await getAuthors();
  const blogPostsWithAuthors = blogPostsArray.map((blogPost) => {
    const targetAuthor = authors.find((a) => a.id === blogPost.author);
    if (targetAuthor) {
      blogPost.author = targetAuthor;
    }
    return blogPost;
  });
  return blogPostsWithAuthors;
}

// 1. Create blog
blogsRouter.post(
  "/",
  checksBlogPostSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newBlog = {
        ...req.body,
        _id: uniqid(),
        createdAt: new Date(),
      };
      const blogsArray = await getBlogs();
      blogsArray.push(newBlog);
      await writeBlogs(blogsArray);
      res
        .status(200)
        .send(`Blog with id ${newBlog._id} was created successfully`);
    } catch (error) {
      next(error);
    }
  }
);

// 2. Read all blogs
blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await getBlogPostsWithAuthors();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

// 3. Read a blog by ID
blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const blogsArray = await getBlogs();
    const searchedBlog = blogsArray.find((blog) => blog._id === blogId);
    if (searchedBlog) {
      res.send(searchedBlog);
    } else {
      next(NotFound(`Blog with id ${blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. Update a blog
blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const blogsArray = await getBlogs();
    const oldBlogIndex = blogsArray.findIndex((blog) => blog._id === blogId);
    if (oldBlogIndex !== -1) {
      const oldBlog = blogsArray[oldBlogIndex];
      const updatedBlog = {
        ...oldBlog,
        ...req.body,
        updatedAt: new Date(),
      };
      blogsArray[oldBlogIndex] = updatedBlog;
      await writeBlogs(blogsArray);
      res.send(updatedBlog);
    } else {
      next(NotFound(`Blog with id ${blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. Delete a blog
blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const blogsArray = await getBlogs();
    const filteredBlogsArray = blogsArray.filter((blog) => blog._id !== blogId);
    if (filteredBlogsArray.length !== blogsArray.length) {
      await writeBlogs(filteredBlogsArray);
      res.status(204).send();
    } else {
      next(NotFound(`Blog with id ${blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// 6. Add blog comments
blogsRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const id = req.params.id;
    const blogsArray = await getBlogs();
    console.log(req.body.comment);
    res.send("We have received the comment");
  } catch (error) {
    console.log(error);
  }
});

export default blogsRouter;