{
  let component = {
    name: 'crossword-builder',
    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {
      "N": 100,
      "ccm_crossword_view": ["ccm.component", "https://marvinklemp.github.io/ccm-crossword/ccm/ccm.crossword.js"],
      "css": [ "ccm.load", "https://marvinklemp.github.io/ccm-crossword-builder/ccm/default.css", "https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"],
      "crossword": [ "ccm.module", "https://marvinklemp.github.io/crossword/lib/bundle.js" ],
      "html": {
        "main": {
          "tag": "div",
          "id": "main",
          "inner": [
            {"tag": "div", "id": "inputs"},
            {"tag": "div", "id": "controls"},
            {"tag": "div", "id": "preview"},
            {"tag": "p", "id": "result"}
          ],
        },
        "generate_button": {
          "tag": "button",
          "type": "button",
          "id": "finish",
          "class": "btn btn-success",
          "onclick": "%onclick%",
          "inner": ["Generate"]
        },
        "append_button": {
          "tag": "button",
          "type": "button",
          "class": "btn btn-secondary",
          "onclick": "%onclick%",
          "inner": ["Add Word"]
        },
        "input": {
          "tag": "div",
          "id": "%id%",
          "class": "input-group",
          "inner": [
            {"tag": "input", "id": "%word_id%", "class": "word", "placeholder": "Word"},
            {"tag": "input", "class": "question", "placeholder": "Question"},
            {"tag": "button", "type": "button", "id": "%id%", "onclick": "%onclick%", "inner": ["Delete"], "class": "btn btn-danger"}
          ]
        }
      },
    },

    Instance: function () {
      let self = this;
      let childCount = 0;

      let $;
      let component;
      let $main;

      let generator;
      let WordInput;
      let N;

      this.start = callback => {
        N = this.N;
        generator = new this.crossword.TrialAndErrorCrosswordGenerator();
        WordInput = this.crossword.WordInput;

        $ = self.ccm.helper;
        component = $.privatize(self);

        $.setContent(
          self.element,
          createView()
        );

        if ( callback ) callback();
      };

      function createView () {
        $main = $.html(component.html.main, {});

        appendInput();
        appendInput();

        const $controls = $main.querySelector("#controls");
        $controls.appendChild($.html(component.html.generate_button, {"onclick": generate}));
        $controls.appendChild($.html(component.html.append_button, {"onclick": appendInput}));

        return $main;
      }

      function appendInput() {
        const $inputs = $main.querySelector('#inputs');

        $inputs.appendChild($.html(component.html.input, {
          "id": `i${childCount}`,
          "word_id": `w${childCount}`,
          "onclick": deleteInput
        }));

        childCount++;
      }

      function deleteInput() {
        const $inputs = $main.querySelector('#inputs');
        const $input = $main.querySelector(`div[id^="${this.id}"]`);

        $inputs.removeChild($input);
      }

      function generate() {
        const words = Array.prototype.map.call($main.querySelector('#inputs').childNodes, (node) => {
          return new WordInput(
            node.querySelector(".word").value.trim().toUpperCase(),
            node.querySelector(".question").value.trim()
          );
        });

        for (let word of words) {
          if (word.word === "" || word.question === "") {
            $main.querySelector("#result").innerHTML = "Bitte füllen Sie alle Felder aus.";

            return;
          }
        }

        if (words.length === 0) {
          $main.querySelector("#result").innerHTML = "Bitte fügen Sie Wörter hinzu.";

          return;
        }

        const result = generator.generate(words, {}, N);

        if (null === result) {
          previewDefault();
        } else {
          preview(result);
        }
      }

      function previewDefault() {
        $main.querySelector("#result").innerHTML = "Es konnte kein Kreuzworträtsel erzeugt werden";
      }

      function preview(result) {
        $main.querySelector("#result").innerHTML = `<code>&ltccm-crossword crossword='${JSON.stringify(result)}'&gt&lt/ccm-crossword&gt</code>`;

        component.ccm_crossword_view.start({"crossword": result}, instance => {
          $.setContent($main.querySelector("#preview"), instance.root);
        });
      }
    },
  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}
