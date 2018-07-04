{
  let component = {
    name: 'composition',
    ccm: 'https://akless.github.io/ccm/ccm.js',
    config: {
      "ccm_component_a": ["ccm.component", "https://marvinklemp.github.io/ccm-crossword/ccm/ccm.crossword.js"],
      "ccm_component_b": ["ccm.component", "https://marvinklemp.github.io/ccm-crossword-highchart/ccm.crossword-highchart.js"],
      "html": {
        "main": {
          "tag": "div",
          "id": "main"
        },
      },
      "config_a": {"crossword": {"x":4,"y":5,"words":[{"word":"BEAR","question":"What lives in the forest and loves honey","x":0,"y":3,"orientation":true},{"word":"TIGER","question":"One of the strongest cats","x":1,"y":0,"orientation":false}]}, "correction": false},
      "config_b": {}
    },
    Instance: function () {
      let self = this;
      let $;
      let component;
      let $main;

      this.start = callback => {
        $ = self.ccm.helper;
        component = $.privatize(self);

        $.setContent(
          self.element,
          this.createView()
        );

        if ( callback ) callback();
      };

      this.createView = function () {
        $main = $.html(component.html.main, {});

        let config = component.config_a;
        config['onfinish'] = renderNext;

        component.ccm_component_a.start(
          config,
          instance => {
            $.setContent($main, instance.root);
          }
        );

        return $main;
      };

      function renderNext(instance, result) {
        let config = component.config_b;
        config.result = result;

        component.ccm_component_b.start(
          config,
          instance => {
            $.setContent($main, instance.root);
          }
        );
      }
    },
  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}