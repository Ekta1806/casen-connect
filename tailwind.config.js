module.exports = {
   content: [
     './resources/**/*.blade.php',
     './resources/**/*.js',
     './resources/**/*.vue',
   ],
    media: false, // or 'media' or 'class'
    theme: {
      screens: {  
        'xs': {'max': '320px'}, 
        'sm': {'min': '576px'},
        'md': {'min': '768px'},
        'lg': {'min': '1024px'},
        'xl': {'min': '1280px'},
        'xxl': {'min': '1366px'},
      },
      extend: {
        fontFamily: {
          sans: ['Nunito'],
        },
        minHeight: {
          '0': '0',
          '40': '40px',
          'full': '100%',
        },
        maxHeight: {
          '0': '0',
          '600': '600px',
          'full': '100%',
        },
        colors: {
          blue: {
            600: '#4d66db'
          },
          yellow: {
            500: '#fcbd00'
          },
        },
        width: {
          '8': '32px',
          '10': '40px',
          '12': '48px',
          '28': '112px',
          '32': '128px',
          '36': '144px',
          '40': '160px',
          '80': '320px',
        },
        height: {
          '8': '32px',
          '10': '40px',
          '12': '48px',
          '28': '112px',
          '32': '128px',
          '36': '144px',
          '40': '160px',
          '80': '320px',
        },
        inset: {
          '1px': '1px',
          '2px': '2px',
          '3px': '3px',
          '4px': '4px',
          '-1px': '-1px',
          '-2px': '-2px',
          '-3px': '-3px',
          '-4px': '-4px',
        },
        spacing: {
          '1px': '1px',
          '2px': '2px',
          '3px': '3px',
          '4px': '4px',
          '-1px': '-1px',
          '-2px': '-2px',
          '-3px': '-3px',
          '-4px': '-4px',
        },
        margin: {
          '5px': '5px',
          '6px': '6px',
          '7px': '7px',
          '8px': '8px',
          '9px': '9px',
          '10px': '10px',
          '11px': '11px',
          '12px': '12px',
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
}
