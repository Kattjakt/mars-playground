module.exports = {
  plugins: ["@snowpack/plugin-sass"],
  mount: {
    public: { url: "/", static: true },
    src: "/",
  },
};
