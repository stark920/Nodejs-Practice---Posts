const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { successHandler, errorHandler } = require('./resHandler');
const Posts = require('./model/posts');
const validatePost = require('./validateHandler');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection success!'))
  .catch((error) => console.log(error));

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.method === 'OPTIONS') {
    successHandler(res);
  } else if (req.url === '/posts' && req.method === 'GET') {
    const allPosts = await Posts.find();
    successHandler(res, allPosts);
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const validateResult = validatePost(data);
        if (validateResult) {
          errorHandler(res, validateResult, 400);
        } else {
          const addPosts = await Posts.create(data);
          successHandler(res, addPosts);
        }
      } catch (error) {
        errorHandler(res, '傳入資料異常', 400);
      }
    });
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    const delAllPosts = await Posts.deleteMany({});
    successHandler(res, delAllPosts);
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    try {
      const delPosts = await Posts.findByIdAndDelete(id);
      delPosts
        ? successHandler(res, delPosts)
        : errorHandler(res, '這筆資料已經刪除', 400);
    } catch (error) {
      errorHandler(res, 'ID 錯誤', 400);
    }
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        const validateResult = validatePost(data);
        if (validateResult) {
          errorHandler(res, validateResult, 400);
        } else {
          const updatePosts = await Posts.findByIdAndUpdate(id, data, {
            new: true,
          });
          successHandler(res, updatePosts);
        }
      } catch (error) {
        errorHandler(res, '傳入 ID 或資料異常', 400);
      }
    });
  } else {
    errorHandler(res, '路由錯誤', 404);
  }
};
const server = http.createServer(requestListener);
server.listen(process.env.PORT);
