export const badRequestHandler = (err, req, res, next) => {
  //function that takes 4 arguments and handles the type of error
  if (err.status === 400) {
    // if error has status 400 do sth
    res
      .status(400)
      .send({ message: err.message, list: err.errorsList.map((e) => e.msg) }); // we manage the error status and link a message
  } else {
    next(err); // if the error is not 400 jump to the next error handler
  }
};

export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({ message: err.message });
  } else {
    next(err);
  }
};

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};

export const genericErrorHandler = (err, req, res, next) => {
  console.log("Error received from above code:", err);
  res.status(500).send({ message: err.message });
};