const path = require("path")
const WebpackPwaManifest = require('webpack-pwa-manifest')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const config = require("./config")

module.exports = {
    entry: {
        app: "./src/index.jsx",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/index.html"),
            favicon: path.resolve(__dirname, "../src/icon/icon.png")
        }),
        new WebpackPwaManifest({
            name: "东北大学HDTV管理平台",
            short_name: "HDTV-ADMIN",
            start_url: "/",
            description: "HDTV, 管理, admin",
            background_color: "#fff",
            dir: "ltr",
            display: "standalone",
            icons: [
                {
                    src: path.resolve("./src/icon/icon.png"),
                    sizes: [36, 48, 72, 96, 128, 256],
                    ios: true
                },
                {
                    src: path.resolve("./src/icon/icon.png"),
                    sizes: [36, 48, 72, 96, 128, 256],
                    ios: "startup"
                },
                {
                    src: path.resolve("./src/icon/icon.svg"),
                    sizes: [36, 48, 72, 96, 128, 256],
                    ios: true
                }
            ],
            ios: {
                "apple-mobile-web-app-title": "东北大学HDTV管理平台",
                'apple-mobile-web-app-status-bar-style': 'black'
            },
            lang: "zh-CN",
            theme_color: "#2196f3"
        }),

    ],
    module: {
        rules: [{
            test: /\.css$/,
            loader: "style-loader!css-loader",
            // include: path.resolve(__dirname, "../src"),
            // exclude: path.resolve(__dirname, "../node_modules")
        }, {
            test: /\.(png|jpg|gif|svg|woff2|ttf|woff|eot|swf)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',
            }
        }]
    }
}

