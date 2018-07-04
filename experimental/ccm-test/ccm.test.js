{
  let component = {
    name: 'test',
    ccm: 'https://akless.github.io/ccm/ccm.js',
    config: {
      "components": [
        [
          "ccm.component",
          "/web-crossword/ccm-crossword/ccm.crossword.js",
        ],
        [
          "ccm.component",
          "https://ccmjs.github.io/akless-components/cloze/versions/ccm.cloze-4.1.0.js"
        ]
      ],
      "components_config": [
        {
          "component": 0,
          "config": {"correction": false, "crossword": {"x":3,"y":3,"words":[{"word":"ASD","question":"asd","x":0,"y":2,"orientation":true},{"word":"ASD","question":"asd","x":2,"y":0,"orientation":false}]}},
          "name": "Einsteiger Kreuzworträtsel",
          "percentage": 20,
        },
        {
          "component": 0,
          "config": {"correction": false, "crossword": {"x":3,"y":3,"words":[{"word":"ASD","question":"asd","x":0,"y":2,"orientation":true},{"word":"ASD","question":"asd","x":2,"y":0,"orientation":false}]}},
          "name": "Weiterführendes Kreuzworträtsel",
          "percentage": 30
        },
        {
          "component": 1,
          "config": {"correction": false, "crossword": {"x":3,"y":3,"words":[{"word":"ASD","question":"asd","x":0,"y":2,"orientation":true},{"word":"ASD","question":"asd","x":2,"y":0,"orientation":false}]}},
          "name": "Weiterführendes Kreuzworträtsel",
          "percentage": 50
        }
      ],
      "onfinish": (instance, result) => {console.log( instance, result )},
      "css": [ "ccm.load", "/web-crossword/ccm-crossword-results/default.css"],
      "html": {
        "main": {
          "tag": "div",
          "id": "main",
          "inner": [
            {"tag": "h1", "id": "heading"},
            {"tag": "div", "id": "test"}
          ]
        },
      }
    },

    Instance: function () {
      let self = this;

      let $;
      let component;
      let $main;

      let current = 0;
      let results = [];

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

        this.renderTask();

        return $main;
      };


      this.renderTask = function() {
        const id = component.components_config[current].component;
        let config = component.components_config[current].config;
        config.onfinish = this.finishTask;

        component.components[id].start(config, instance => {
          $.setContent($main.querySelector("#test"), instance.root);
        });


        $main.querySelector("#heading").innerHTML = component.components_config[current].name;

        current++;
      };

      this.finishTask = function (instance, result) {
        results.push(result);

        if (current > component.components.length) {
          self.onfinish(self, results);
        } else {
          self.renderTask();
        }
      };
    },
  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}