module.exports = {
    configureWebpack: {
        devServer: {
            proxy: {
                "/api": {
                    target: "http://120.78.221.14:3343",
                    changeOrigin: true
                }
            }
        }
    }
}
// devServer: {
//     proxy: {
//         "/api": {
//             target: "http://120.78.221.14:3343",
//             changeOrigin: true
//         }
//     }
// }