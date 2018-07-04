{
  let component = {
    name: 'store',
    ccm: 'https://ccmjs.github.io/ccm/ccm.js',
    config: {
      "result": {},
      "user": [ "ccm.instance", "https://ccmjs.github.io/akless-components/user/versions/ccm.user-7.0.0.js", [ "ccm.get", "https://ccmjs.github.io/akless-components/user/resources/configs.js", "guest" ] ],
      "onfinish": {
        "login": true,
        "store": {
          "user": true,
          "settings": {
            "url": "https://ccm2.inf.h-brs.de",
            "method": "POST",
            "store": "mklemp2s_crossword_results",
          }
        },
        "alert": "Saved!"
      }
    },

    Instance: function () {
      let self = this;

      this.start = callback => {
        const $ = self.ccm.helper;
        component = $.privatize(self);

        const to_store = component.result;

        $.onFinish(self, to_store);

        if ( callback ) callback();
      };
    },
  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}