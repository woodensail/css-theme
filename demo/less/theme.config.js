module.exports = {
  'placeholder': {
    'dark': '#theme1',
    'light': '#theme2'
  },
  'list': [
    {
      'default': false,
      'targetMap': {

        'dark': '#ff0000',
        'light': '#ff8888',
      },
      'rootClass': 'skin_red'
    },
    {
      'default': false,
      'targetMap': {
        'dark': '#34cf51',
        'light': '#50dc6a',
      },
      'rootClass': 'skin_green'
    },
    {
      'default': true,
      'targetMap': {
        'dark': '#43aff7',
        'light': '#72c7ff',
      },
      'rootClass': 'skin_blue'
    },
  ],
  themeFragmentHandle(fragment, theme){
    return `.${theme.rootClass}{height:100%}\n` + fragment;
  }
};
