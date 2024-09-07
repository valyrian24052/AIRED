const withImages = require('next-images');

module.exports = withImages({
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://my.spline.design https://www.youtube.com;",
          },
        ],
      },
    ];
  },
});
