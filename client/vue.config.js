// module.exports = {
//     configureWebpack: config => {
//         if (process.env.NODE_ENV === 'production') {
//             return {
//                 // output: {
//                 //     publicPath: ""
//                 // }
//                 baseUrl: "",
//             }
//         } else {
//             return {
//                 devServer: {
//                     proxy: {
//                         "/api": {
//                             target: "http://120.78.221.14:3343",
//                             changeOrigin: true
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }
module.exports = {
    publicPath: "",
    devServer: {
        proxy: {
            "/api": {
                target: "http://120.78.221.14:3343",
                changeOrigin: true
            }
        }
    }
}