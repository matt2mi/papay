const messages = [];

const addMessage = (msg, io) => {
  console.log('addMessage');
  messages.push(msg);
  io.emit('new-message', messages);
};

const getMessages = () => {
  return messages;
};

module.exports = { addMessage, getMessages };
