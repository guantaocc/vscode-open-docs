Object.defineProperty(exports, '__esModule', {
  value: true,
});
// eslint-disable-next-line
const vscode = require('vscode'); // подключаем библиотеку vscode
const customLinksObject = vscode.workspace.getConfiguration().ExternalDocs.links;

// шаблон для веб-отображения
const getWebviewContent = (uri) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>
        body, html
          {
            margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #fff;
          }
      </style>
    </head>
    <body>
      <iframe width="100%" height="100%" src="${uri}" frameborder="0">
        <p>can't display ${uri}</p>
      </iframe>
    </body>
    </html>
    `;
  return html;
};

const getLang = () => {
  const supportedLangs = ['en', 'zh'];
  const configLang = vscode.workspace.getConfiguration().ExternalDocs.lang;
  const interfaceLang = vscode.env.language.includes('zh')
    ? 'zh'
    : vscode.env.language.includes('en')
      ? 'en'
        : null;

  // console.log(interfaceLang);
  if (configLang !== '') {
    return configLang;
  }
  // @ts-ignore
  if (supportedLangs.includes(interfaceLang)) {
    return interfaceLang;
  }
  return 'zh';
};

const getURIof = (item = '', lang = 'en') => {
  if (typeof customLinksObject[item] === 'string') {
    // console.log(customLinksObject[item]);
    return String(customLinksObject[item]);
  }

  const URIof = {
    vue: {
      en: 'https://vuejs.org/v2/guide/',
      zh: 'https://cn.vuejs.org/v2/guide/',
    },
    vuex: {
      en: 'https://vuex.vuejs.org/en/',
      zh: 'https://vuex.vuejs.org/zh/',
    },
    'vue-router': {
      en: 'https://router.vuejs.org/en/',
      zh: 'https://router.vuejs.org/zh/',
    },
    'ant-design-vue': {
      en: 'https://1x.antdv.com/docs/vue/introduce-cn/',
      zh: 'https://1x.antdv.com/docs/vue/introduce-cn/'
    },
    'element-ui': {
      en: 'https://element.eleme.cn/#/zh-CN/component/installation',
      zh: 'https://element.eleme.cn/#/zh-CN/component/installation'
    }
  };
  return String(URIof[item][lang]);
};

// активация расширения
const activate = (context) => {
  const openExternalDocs = vscode.commands.registerCommand('extension.openExternalDocs', () => {
    const customMenuItems = Object.getOwnPropertyNames(customLinksObject);

    const defaultMenuItems = ['vue', 'vuex', 'vue-router', 'ant-design-vue', 'element-ui'];
    const menuItems = [].concat(defaultMenuItems, customMenuItems);

    vscode.window.showQuickPick(menuItems).then((selectedMenuItem) => {
      if (selectedMenuItem) {
        const panel = vscode.window.createWebviewPanel(
          'webDocs',
          selectedMenuItem,
          vscode.ViewColumn.One,
          {
            // https://code.visualstudio.com/docs/extensions/webview#_scripts-and-message-passing
            enableScripts: true,
            // https://code.visualstudio.com/docs/extensions/webview#_persistence
            retainContextWhenHidden: true,
          }
        );

        const lang = getLang();
        // получаем URI соответствующий выбранному пункту меню
        const selectedURI = getURIof(selectedMenuItem, lang);
        panel.webview.html = getWebviewContent(selectedURI); 
      }
    });
  });

  context.subscriptions.push(openExternalDocs);
};

exports.activate = activate;
