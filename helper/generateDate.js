const generateDate = () => {
  const dateTime = new Date();
  const createDate = dateTime.toISOString();

  return createDate;
};

module.exports = generateDate;
