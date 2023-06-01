module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        orange: "#ff9500",
        "dark-orange": "#ff0000",
      },
      fontFamily: {
        'primary': ['"Roboto", Helvetica, Arial, Lucida, sans-serif'],
        'secondary': ['"Libre Franklin", Helvetica, Arial, Lucida, sans-serif'],
      },
      backgroundImage: {
        'mapIcon': "url('../../assets/images/map-icon.svg')",
        'phoneIcon': "url('../../assets/images/phone-icon.svg')",
        'clockIcon': "url('../../assets/images/clock-icon.svg')",
        'caretIcon': "url('../../assets/images/caret.svg')",
      },
    },
  },
  plugins: [],
};
