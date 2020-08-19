module.exports = {
  alias: {
    '/~/': path.resolve(__dirname, './src'),
    '/Components/': path.resolve(wb.paths.components.src),
    '/CSS/': path.resolve(wb.paths.css.src),
    '/GQL/': path.resolve(`${wb.paths.starter.src}gql/`),
    '/JS/': path.resolve(wb.paths.js.src),
    '/Source/': path.resolve(wb.paths.starter.source),
    '/Starter/': path.resolve(wb.paths.starter.starter),
    '/Views/': path.resolve(`${wb.paths.starter.src}views/`),
  }
}