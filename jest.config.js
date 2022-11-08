module.exports = {
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": require.resolve(
      "./test/file-mock.js",
    ),
    "\\.(css|less)$": require.resolve("./test/style-mock.js"),
  },
}