const Posts = require('./model/posts');

const validatePost = (data) => {
  const testData = new Posts(data);
  const errors = testData.validateSync();
  if (errors) {
    return Object.values(errors.errors).map((err) => err.message);
  } else {
    return errors;
  }
};

module.exports = validatePost;
