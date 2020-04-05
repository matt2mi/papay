const messages = [];

const addMessage = (msg, io) => {
  messages.push(msg);
  io.emit('newMessage', messages);
};

const getMessages = () => {
  return messages;
};

module.exports = { addMessage, getMessages };
