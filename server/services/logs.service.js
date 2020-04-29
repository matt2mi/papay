const logs = (str, value) => {
  console.log('yop', process.env);
  if(process.env === 'prod') console.log(str, value);
};

module.exports = {logs};
