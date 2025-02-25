let messages = []; // [{message: '', color: ''}...]

const addMessage = (message, color, io) => {
  messages.push({message, color});
  io.emit('newMessage', {message, color});
};

const getMessages = () => {
  return messages;
};

const reset = () => {
  messages = [];
};

module.exports = {addMessage, getMessages, reset};
