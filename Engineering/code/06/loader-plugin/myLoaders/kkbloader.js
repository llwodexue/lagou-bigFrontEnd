module.exports = function (source) {
  console.log(source);

  const result = source.replace("开课吧", "kkb");
  console.log(result);
  return source;
};
