import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';

export default {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(process.cwd(), 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react',
        }),
        // new webpack.EnvironmentPlugin(["WSS_URL", "API_KEY"]),
        new HtmlWebpackPlugin({
            template: './static/index.html',
            inject: 'body',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(process.cwd(), 'static', 'favicon.png'),
                    to: 'favicon.png',
                },
            ],
        }),
    ],
};