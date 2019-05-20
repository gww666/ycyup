module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {

        } else {
            return {
                devServer: {
                    proxy: {
                        "/api": {
                            target: "https://www.xswl.ltd:3343"
                        }
                    }
                }
            }
        }
    }
}