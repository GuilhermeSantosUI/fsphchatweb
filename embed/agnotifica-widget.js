(function(){
  function createWidget(rootPath, options){
    if(typeof rootPath === 'object'){ options = rootPath; rootPath = options && options.rootPath; }
    options = options || {};
    var widgetUrlBase = rootPath? (rootPath.replace(/\/+$|\/$/, '') + '/') : './';
    var widgetUrl = options.widgetUrl || (options.useApp ? widgetUrlBase : widgetUrlBase + 'widget.html');
    var position = options.position || 'R';

    // container
    var container = document.createElement('div');
    container.setAttribute('ag', '');
    container.className = 'ag-container ag-pos-' + position;

    // access button
    var button = document.createElement('div');
    button.setAttribute('ag-access-button', '');
    button.className = 'ag-access-button';
    button.innerHTML = '<div class="ag-access-icon">🔔</div>';

    // plugin wrapper
    var wrapper = document.createElement('div');
    wrapper.setAttribute('ag-plugin-wrapper', '');
    wrapper.className = 'ag-plugin-wrapper';

    var iframe = document.createElement('iframe');
      iframe.setAttribute('ag-iframe','');
      // make iframe allow transparency so host shows through transparent areas
      try { iframe.setAttribute('allowTransparency', 'true'); } catch (e) {}
      iframe.style.background = 'transparent';
      iframe.style.setProperty('background', 'transparent');
      // Build iframe src and append known query params when provided
      var iframeSrc = widgetUrl;
    var addParam = function(key, val) {
      if (val == null) return;
      iframeSrc += (iframeSrc.indexOf('?') === -1 ? '?' : '&') + encodeURIComponent(key) + '=' + encodeURIComponent(val);
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
    var css = '\n' +
      'div[ag]{position:fixed;z-index:2147483645;display:block;bottom:20px;right:20px;max-width:95vw;}\n' +
      'div[ag] .ag-access-button{width:56px;height:56px;border-radius:12px;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;}\n' +
      'div[ag] .ag-access-button.active{background:#0b74de;}\n' +
      // outer wrapper is transparent so only iframe content shows; keep shadow and radius
      'div[ag] .ag-plugin-wrapper{display:none;position:fixed;bottom:90px;right:20px;width:360px;height:480px;background:none;border-radius:12px;overflow:hidden;}\n' +
      'div[ag] .ag-plugin-wrapper.active{display:block;}\n' +
      'div[ag].ag-pos-L{left:20px;right:auto;}\n' +
      'div[ag].ag-pos-L .ag-plugin-wrapper{left:20px;right:auto;}\n' +
      '@media(max-width:480px){div[ag] .ag-plugin-wrapper{right:10px;left:10px;width:calc(100% - 20px);height:60vh;bottom:80px}}\n';
    var style = document.createElement('style');
    style.setAttribute('data-ag-widget','');
    style.appendChild(document.createTextNode(css));

    var appended = false;
    var onReadyListener = null;
    var appendToDom = function(){
      if (appended) return;
      var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      try {
        if (head && head.appendChild) head.appendChild(style);
      } catch (e) {
        try { document.documentElement.appendChild(style); } catch (e) {}
      }
      var body = document.body || document.getElementsByTagName('body')[0] || document.documentElement;
      try { if (body && body.appendChild) body.appendChild(container); } catch (e) { try { document.documentElement.appendChild(container); } catch (e) {} }
      // attach button listener after elements are in DOM
      button.addEventListener('click', function(){
        button.classList.toggle('active');
        wrapper.classList.toggle('active');
      });
      appended = true;
    };

    if (document.readyState === 'loading') {
      onReadyListener = function(){ appendToDom(); document.removeEventListener('DOMContentLoaded', onReadyListener); };
      document.addEventListener('DOMContentLoaded', onReadyListener);
    } else {
      appendToDom();
    }

    return {
      open: function(){ button.classList.add('active'); wrapper.classList.add('active'); },
      close: function(){ button.classList.remove('active'); wrapper.classList.remove('active'); },
      toggle: function(){ button.classList.toggle('active'); wrapper.classList.toggle('active'); },
      destroy: function(){
        try {
          if (appended) {
            if (style && style.parentNode) style.parentNode.removeChild(style);
            if (container && container.parentNode) container.parentNode.removeChild(container);
          } else {
            // if not appended yet, remove pending listener
            var removeListener = function(){};
            try { document.removeEventListener('DOMContentLoaded', removeListener); } catch (e) {}
          }
        } catch (e) {}
      }
    };
  }

  window.Agnotifica = window.Agnotifica || {};
  window.Agnotifica.Widget = function(rootPath, options){
    return createWidget(rootPath, options);
  };

  // Auto-initialize when the script is included via <script src="...">.
  try {
    var currentScript = document.currentScript;
    if (!currentScript) {
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        var s = scripts[i];
        if (s.src && /agnotifica-widget\.js(\?|$)/.test(s.src)) { currentScript = s; break; }
      }
    }

    if (currentScript) {
      var dataRoot = currentScript.getAttribute('data-root') || currentScript.getAttribute('data-rootpath');
      var inferredRoot = null;
      if (!dataRoot && currentScript.src) {
        inferredRoot = currentScript.src.replace(/embed\/agnotifica-widget\.js(\?.*)?$/, '');
      }
      var rootToUse = dataRoot || inferredRoot || './';

      var opts = {};
      var pos = currentScript.getAttribute('data-position');
      if (pos) opts.position = pos;
      var opacity = currentScript.getAttribute('data-opacity');
      if (opacity) opts.opacity = parseFloat(opacity) || undefined;
      var useApp = currentScript.getAttribute('data-use-app');
      if (useApp === 'true') opts.useApp = true;
      var dataValue = currentScript.getAttribute('data-value') || currentScript.getAttribute('data-prop');
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
