const headers = {
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-Width',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

const successHandler = (res, data) => {
  res.writeHead(200, headers);
  if (data) {
    res.write(
      JSON.stringify({
        status: 'success',
        data,
      })
    );
  }
  res.end();
};

const errorHandler = (res, msg, errorCode) => {
  res.writeHead(errorCode, headers);
  res.write(
    JSON.stringify({
      status: 'failed',
      msg,
    })
  );
  res.end();
};

module.exports = { successHandler, errorHandler };
