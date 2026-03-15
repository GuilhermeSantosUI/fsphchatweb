(function () {
  function createWidget(rootPath, options) {
    if (typeof rootPath === 'object') {
      options = rootPath;
      rootPath = options && options.rootPath;
    }
    options = options || {};
    var widgetUrlBase = rootPath
      ? rootPath.replace(/\/+$|\/$/, '') + '/'
      : './';
    var widgetUrl =
      options.widgetUrl ||
      (options.useApp ? widgetUrlBase : widgetUrlBase + 'widget.html');
    var position = options.position || 'R';

    // container
    var container = document.createElement('div');
    container.setAttribute('ag', '');
    container.className = 'ag-container ag-pos-' + position;

    // access button
    var button = document.createElement('div');
    button.setAttribute('ag-access-button', '');
    button.className = 'ag-access-button';
    button.innerHTML =
      '<div class="ag-access-icon"><img src="' +
      widgetUrlBase +
      'logo.png" alt="" style="width: 45px;position: absolute;height: 45px;top: 0px;bottom: 0px;" /></div>';

    // plugin wrapper
    var wrapper = document.createElement('div');
    wrapper.setAttribute('ag-plugin-wrapper', '');
    wrapper.className = 'ag-plugin-wrapper';

    var iframe = document.createElement('iframe');
    iframe.setAttribute('ag-iframe', '');
    // make iframe allow transparency so host shows through transparent areas
    try {
      iframe.setAttribute('allowTransparency', 'true');
    } catch (e) {}
    iframe.style.background = 'transparent';
    iframe.style.setProperty('background', 'transparent');
    // Build iframe src and append known query params when provided
    var iframeSrc = widgetUrl;
    var addParam = function (key, val) {
      if (val == null) return;
      iframeSrc +=
        (iframeSrc.indexOf('?') === -1 ? '?' : '&') +
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(val);
    };
    if (options && options.value) addParam('agvalue', options.value);
    if (options && options.agc) addParam('agc', options.agc);
    if (options && options.token) addParam('token', options.token);
    iframe.src = iframeSrc;
    iframe.style.border = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.borderRadius = '8px';

    wrapper.appendChild(iframe);
    container.appendChild(button);
    container.appendChild(wrapper);

    // basic styles
    var css =
      '\n' +
      'div[ag]{position:fixed;z-index:2147483645;display:block;bottom:20px;right:20px;max-width:95vw;}\n' +
      'div[ag] .ag-access-button{width:45px;position:relative;height:45px;border-radius:50%;background:#2b2b2b;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.4);}\n' +
      'div[ag] .ag-access-button:hover{background:#3a3a3a;}\n' +
      'div[ag] .ag-access-button.active{background:#2b2b2b;}\n' +
      'div[ag] .ag-access-icon{display:flex;align-items:center;justify-content:center;width:100%;height:100%;}\n' +
      'div[ag] .ag-access-icon img{width:38px;height:38px;object-fit:contain;display:block;}\n' +
      // outer wrapper is transparent so only iframe content shows; keep shadow and radius
      'div[ag] .ag-plugin-wrapper{display:none;border:1px solid #ccc;position:fixed;bottom:20px;right:20px;width:400px;height:480px;background:none;border-radius:12px;overflow:hidden;}\n' +
      'div[ag] .ag-plugin-wrapper.active{display:block;}\n' +
      // hide floating button when widget is open
      'div[ag].ag-open .ag-access-button{display:none;}\n' +
      // sidebar mode
      'div[ag].ag-mode-sidebar{bottom:0!important;right:0!important;left:auto!important;top:0!important;width:400px;height:100vh;max-width:100vw;position:fixed;}\n' +
      'div[ag].ag-mode-sidebar .ag-access-button{display:none!important;}\n' +
      'div[ag].ag-mode-sidebar .ag-plugin-wrapper{display:block!important;position:fixed;top:0;right:0;left:auto;bottom:0;width:400px;height:100vh;border-radius:0;max-width:100vw;}\n' +
      'div[ag].ag-mode-sidebar iframe[ag-iframe]{border-radius:0!important;}\n' +
      'div[ag].ag-mode-sidebar.ag-pos-L{left:0!important;right:auto!important;}\n' +
      'div[ag].ag-mode-sidebar.ag-pos-L .ag-plugin-wrapper{left:0;right:auto;}\n' +
      'div[ag].ag-pos-L{left:20px;right:auto;}\n' +
      'div[ag].ag-pos-L .ag-plugin-wrapper{left:20px;right:auto;}\n' +
      '@media(max-width:480px){div[ag] .ag-plugin-wrapper{right:10px;left:10px;width:calc(100% - 20px);height:60vh;bottom:80px}}\n';
    var style = document.createElement('style');
    style.setAttribute('data-ag-widget', '');
    style.appendChild(document.createTextNode(css));

    var appended = false;
    var onReadyListener = null;
    var appendToDom = function () {
      if (appended) return;
      var head =
        document.head ||
        document.getElementsByTagName('head')[0] ||
        document.documentElement;
      try {
        if (head && head.appendChild) head.appendChild(style);
      } catch (e) {
        try {
          document.documentElement.appendChild(style);
        } catch (e) {}
      }
      var body =
        document.body ||
        document.getElementsByTagName('body')[0] ||
        document.documentElement;
      try {
        if (body && body.appendChild) body.appendChild(container);
      } catch (e) {
        try {
          document.documentElement.appendChild(container);
        } catch (e) {}
      }
      // attach button listener after elements are in DOM
      button.addEventListener('click', function () {
        button.classList.toggle('active');
        wrapper.classList.toggle('active');
        container.classList.toggle('ag-open');
      });

      // listen for messages from the iframe (e.g. minimize button, view mode)
      window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'ag-minimize') {
          if (container.classList.contains('ag-mode-sidebar')) {
            // sai do modo sidebar, volta ao flutuante com o círculo
            container.classList.remove('ag-mode-sidebar');
            container.classList.remove('ag-sidebar-minimized');
            container.classList.remove('ag-open');
            wrapper.classList.remove('active');
            button.classList.remove('active');
            document.body.style.marginRight = '';
            document.body.style.marginLeft = '';
            // notifica o iframe que saiu do modo sidebar
            try {
              iframe.contentWindow.postMessage(
                { type: 'ag-exited-sidebar' },
                '*',
              );
            } catch (e) {}
          } else {
            button.classList.remove('active');
            wrapper.classList.remove('active');
            container.classList.remove('ag-open');
          }
        }
        if (event.data && event.data.type === 'ag-view-mode') {
          var mode = event.data.mode;
          if (mode === 'sidebar') {
            container.classList.add('ag-mode-sidebar');
            wrapper.classList.add('active');
            button.classList.add('active');
            container.classList.add('ag-open');
            // push page body content
            var pushSide = position === 'L' ? 'marginLeft' : 'marginRight';
            document.body.style[pushSide] = '400px';
            document.body.style.transition = 'margin 0.3s ease';
          } else {
            // floating mode
            container.classList.remove('ag-mode-sidebar');
            // restore body margins
            document.body.style.marginRight = '';
            document.body.style.marginLeft = '';
          }
        }
      });

      appended = true;
    };

    if (document.readyState === 'loading') {
      onReadyListener = function () {
        appendToDom();
        document.removeEventListener('DOMContentLoaded', onReadyListener);
      };
      document.addEventListener('DOMContentLoaded', onReadyListener);
    } else {
      appendToDom();
    }

    return {
      open: function () {
        button.classList.add('active');
        wrapper.classList.add('active');
        container.classList.add('ag-open');
      },
      close: function () {
        button.classList.remove('active');
        wrapper.classList.remove('active');
        container.classList.remove('ag-open');
      },
      toggle: function () {
        button.classList.toggle('active');
        wrapper.classList.toggle('active');
        container.classList.toggle('ag-open');
      },
      destroy: function () {
        try {
          if (appended) {
            if (style && style.parentNode) style.parentNode.removeChild(style);
            if (container && container.parentNode)
              container.parentNode.removeChild(container);
          } else {
            // if not appended yet, remove pending listener
            var removeListener = function () {};
            try {
              document.removeEventListener('DOMContentLoaded', removeListener);
            } catch (e) {}
          }
        } catch (e) {}
      },
    };
  }

  window.Agnotifica = window.Agnotifica || {};
  window.Agnotifica.Widget = function (rootPath, options) {
    return createWidget(rootPath, options);
  };

  // Auto-initialize when the script is included via <script src="...">.
  try {
    var currentScript = document.currentScript;
    if (!currentScript) {
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        var s = scripts[i];
        if (s.src && /agnotifica-widget\.js(\?|$)/.test(s.src)) {
          currentScript = s;
          break;
        }
      }
    }

    if (currentScript) {
      var dataRoot =
        currentScript.getAttribute('data-root') ||
        currentScript.getAttribute('data-rootpath');
      var inferredRoot = null;
      if (!dataRoot && currentScript.src) {
        inferredRoot = currentScript.src.replace(
          /embed\/agnotifica-widget\.js(\?.*)?$/,
          '',
        );
      }
      var rootToUse = dataRoot || inferredRoot || './';

      var opts = {};
      var pos = currentScript.getAttribute('data-position');
      if (pos) opts.position = pos;
      var opacity = currentScript.getAttribute('data-opacity');
      if (opacity) opts.opacity = parseFloat(opacity) || undefined;
      var useApp = currentScript.getAttribute('data-use-app');
      if (useApp === 'true') opts.useApp = true;
      var dataValue =
        currentScript.getAttribute('data-value') ||
        currentScript.getAttribute('data-prop');
      if (dataValue != null) opts.value = dataValue;
      var dataAgc = currentScript.getAttribute('data-agc');
      if (dataAgc != null) opts.agc = dataAgc;
      var dataToken = currentScript.getAttribute('data-token');
      if (dataToken != null) opts.token = dataToken;

      try {
        var instance = createWidget(rootToUse, opts);
        window.Agnotifica._default = instance;
        window.Agnotifica.instance = instance;
      } catch (e) {
        console.error('Agnotifica: failed to auto-initialize widget', e);
      }
    }
  } catch (e) {
    console.error('Agnotifica: auto-init error', e);
  }
})();
