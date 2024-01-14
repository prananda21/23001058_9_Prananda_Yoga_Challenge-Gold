const { nanoid } = require("nanoid");

const generateId = () => {
  return new Promise((resolve) => {
    const id = nanoid(5);
    resolve(id);
  });
};

module.exports = generateId;
