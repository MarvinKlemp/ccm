{
  let component = {
    name: 'crossword-results',
    ccm: 'https://akless.github.io/ccm/ccm.js',
    config: {
      "ccm_crossword_view": ["ccm.component", "/web-crossword/ccm-crossword/ccm.crossword.js"],
      "ccm_highchart": ["ccm.component", "https://cdn.rawgit.com/akless/ccm-components/master/highchart/ccm.highchart.min.js"],
      "html": {
        "main": {
          "tag": "div",
          "id": "main",
          "inner": [
            {"tag": "div", "id": "crossword"},
            {"tag": "div", "id": "results"},
          ]
        },
      },
      "crossword": {"x":3,"y":3,"words":[{"word":"ASD","question":"asd","x":0,"y":2,"orientation":true},{"word":"ASD","question":"asd","x":2,"y":0,"orientation":false}]},
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

        component.ccm_crossword_view.start(
          {
            "crossword": component.crossword,
            "onfinish": this.renderResults
          },
          instance => {
            $.setContent($main.querySelector("#crossword"), instance.root);
          }
         );

        return $main;
      };

      this.renderResults = function (instance, result) {
        let config = {
          "libs": [ "ccm.load", [ "https://code.highcharts.com/highcharts.js", "https://code.highcharts.com/modules/exporting.js" ] ],
          "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ],
          "chart": "pie-semi-circle",
          "switcher": false,
          "title": "Ergebnis",
          "tooltip": "{series.name}: <b>{point.percentage:.1f}%</b>",
          "tooltip_label": "Ergebnis Prozentsatz",
        };

        console.log(result.stats);

        config.data = [
          ["Korrekt", result.stats.tile_percentage],
          ["Falsch", 100 - result.stats.tile_percentage]
        ];

        component.ccm_highchart.start(
          config,
          instance => {
            $.setContent($main.querySelector("#results"), instance.root);
          }
        );

        return $main;
      }
    },
  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}