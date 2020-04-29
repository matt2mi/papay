const logs = (str, value) => {
  if(process.env.NODE_ENV === 'production') console.log(str, value);
};

module.exports = {logs};
