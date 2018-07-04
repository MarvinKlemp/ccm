{
  let component = {
    name: 'crossword-help',
    ccm: 'https://akless.github.io/ccm/ccm.js',
    config: {
      "ccm_crossword": ["ccm.component", "https://rawgit.com/MarvinKlemp/marvinklemp.github.io/master/ccm-crossword/ccm/ccm.crossword.js"],
      "html": {
        "main": {
          "tag": "div",
          "id": "main",
        },
      },
      "help": 2,
      "crossword": {"x":4,"y":5,"words":[{"word":"BEAR","question":"What lives in the forest and loves honey","x":0,"y":3,"orientation":true},{"word":"TIGER","question":"One of the strongest cats","x":1,"y":0,"orientation":false}]}
    },

    Instance: function () {
      let self = this;
      let $;
      let component;

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
        let $main = $.html(component.html.main, {});

        console.log(component.crossword.words.length);

        component.ccm_crossword.start(
          {"crossword": component.crossword},
          instance => {
            for (let i = 0; i<component.help; i++) {

              const word_id = Math.floor(Math.random() * component.crossword.words.length);
              const word = component.crossword.words[word_id];
              const word_char_id = Math.floor(Math.random() * word.word.length);
              const word_char = word.word[word_char_id].toUpperCase();

              const tile_id = (word.orientation) ?
                `${word.x + word_char_id}${word.y}` :
                `${word.x}${word.y + word_char_id}`
              ;

              const $tile = instance.root.querySelector('div').shadowRoot.querySelector(`#letter-${tile_id} > .letter`);
              $tile.innerHTML = word_char;
              $tile.id = `help${i}`;
            }

            $.setContent($main, instance.root);
          }
        );


        return $main;
      };
    },
  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}