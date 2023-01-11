import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogPostSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title field is mandatory and must be a string",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category field is mandatory and must be a string",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content field is mandatory and must be a string",
    },
  },
};

export const checksBlogPostSchema = checkSchema(blogPostSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  console.log(errors.array);

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during blog post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};