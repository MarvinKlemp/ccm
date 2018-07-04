{
  let component = {
    name: 'crossword',
    ccm: 'https://akless.github.io/ccm/ccm.js',
    config: {
      "css": [ "ccm.load", "https://marvinklemp.github.io/ccm-crossword/ccm/default.css", "https://cdn.rawgit.com/MarvinKlemp/marvinklemp.github.io/8a7dd4c9/ccm-crossword/ccm/bootstrap.buttons.css"],
      "correction": true,
      "html": {
        "main": {
          "tag": "div",
          "id": "main",
        },
        "questions": {
          "tag": "div",
          "id": "questions",
          "class": "questions"
        },
        "horizontal_questions": {
          "tag": "div",
          "id": "horizontal_questions",
        },
        "vertical_questions": {
          "tag": "div",
          "id": "vertical_questions",
        },
        "info": {
          "tag": "h3",
          "inner": "%text%"
        },
        "questiontext": {
          "tag": "p"
        },
        "table": {
          "tag": "table"
        },
        "tilerow": {
          "tag": "tr",
          "class": "tile-row"
        },
        "unusedtile": {
          "tag": "td",
          "class": "tile unused",
          "data-x": "%y%",
          "data-y": "%x%"
        },
        "lettertile": {
          "tag": "td",
          "id": "%id%",
          "contenteditable": true,
          "class": "tile letter-tile",
          "data-x": "%x%",
          "data-y": "%y%",
          "inner": [{"tag": "span", "class": "letter", "inner": []}]
        },
        "button": {
          "tag": "button",
          "id": "finish",
          "class": "btn btn-default",
          "onclick": "%onclick%",
          "inner": ["Complete"]
        }
      },
      "crossword": {"x":4,"y":5,"words":[{"word":"BEAR","question":"What lives in the forest and loves honey","x":0,"y":3,"orientation":true},{"word":"TIGER","question":"One of the strongest cats","x":1,"y":0,"orientation":false}]},
      "onfinish": (instance, result) => {console.log( instance, result )}
    },

    Instance: function () {
      let id = 1;
      let words;
      let orientation = null;

      let self = this;

      let $;
      let component;

      let matrix;

      this.start = callback => {
        $ = self.ccm.helper;
        component = $.privatize(self);

        matrix = this.createMatrix(component.crossword.y, component.crossword.x);
        words = this.wordsFromConfig(component.crossword.words);

        component.crossword.words.forEach((word) => {
          this.fillWordInMatrix(matrix, word);
        });

        $.setContent(
          self.element,
          this.createView(matrix)
        );

        if ( callback ) callback();
      };

      this.createView = function (matrix) {
        const $main = $.html(component.html.main, {});

        if (component.correction) {
          $main.appendChild($.html({
            tag: 'link',
            rel: 'stylesheet',
            type: 'text/css',
            href: "https://marvinklemp.github.io/ccm-crossword/ccm/correction.css"
          }));
        }

        let $table = $.html(component.html.table);
        for (let i = 0; i < matrix.length; i++) {
          let $row = $.html(component.html.tilerow);
          for (let j = 0; j < matrix[i].length; j++) {
            $row.appendChild(matrix[i][j]);
          }
          $table.appendChild($row);
        }

        const $questions = $.html(component.html.questions);
        const $horizontal_questions = $.html(component.html.horizontal_questions);
        const $vertical_questions = $.html(component.html.vertical_questions);

        $horizontal_questions.appendChild($.html(component.html.info, {text: "Horizontal"}));
        $vertical_questions.appendChild($.html(component.html.info, {text: "Vertical"}));

        for (let word of words) {
          let $text = $.html(component.html.questiontext);

          $text.innerHTML = `${id}. ${word.question}`;
          id++;

          if (word.orientation) {
            $horizontal_questions.appendChild($text);
          } else {
            $vertical_questions.appendChild($text)
          }

          $questions.appendChild($horizontal_questions);
          $questions.appendChild($vertical_questions);
        }

        $main.appendChild($table);
        $main.appendChild($questions);
        $main.appendChild($.html(component.html.button, {"onclick": this.solve}));

        return $main;
      };

      this.wordsFromConfig = function (words) {
        let id = 1;

        for (let word of words) {
          word.id = id++;
        }

        return words;
      };

      this.createMatrix = function (height, width) {
        let rows = [];
        for (let i = 0; i < height; i++) {
          let row = [];
          for (let j = 0; j < width; j++) {
            row.push($.html(component.html.unusedtile, {
              "y": i,
              "x": j,
            }));
          }
          rows.push(row);
        }

        return rows;
      };

      this.fillWordInMatrix = (matrix, word) => {
        let first = true;
        for (let i = 0; i < word.word.length; i++) {
          let x = (word.orientation) ? word.x + i : word.x;
          let y = (word.orientation) ? word.y : word.y + i;

          let $element = $.html(component.html.lettertile, {
            "id": `letter-${x}${y}`,
            "x": x,
            "y": y,
          });

          $element.addEventListener('mousedown', function (e) {
            let $orientationSpan = this.querySelector('.word-id');
            if (!$orientationSpan) {
              return;
            }

            orientation = $orientationSpan.classList.contains('orientation-horizontal');
          });

          $element.addEventListener('keydown', function (e) {
            e.preventDefault();

            if(e.keyCode === 8 || e.keyCode === 46) {
              const $letter = this.querySelector('.letter');
              $letter.innerHTML = "";

              return false;
            }

            if (e.keyCode >= 65 && e.keyCode <= 90 ||
              e.keyCode >= 48 && e.keyCode <= 57 ||
              e.keyCode >= 96 && e.keyCode <= 105 ||
              e.keyCode === 32
            ) {
              const $letter = this.querySelector('.letter');
              $letter.innerHTML = String.fromCharCode(e.keyCode);

              if (null !== orientation) {
                let x = this.dataset.x;
                let y = this.dataset.y;

                if (orientation) {
                  ++x;
                } else {
                  ++y;
                }

                if (matrix[y] !== undefined && matrix[y][x] !== undefined) {
                  matrix[y][x].focus();
                }
              }
            }
          });

          if (matrix[y][x].classList.contains("unused")) {
            if (true === first) {
              let cssClass = (word.orientation) ? "orientation-horizontal" : "orientation-vertical";
              $element.innerHTML = `<span class="word-id ${cssClass}">${word.id}</span><span class="letter"></span>`;
              first = false;
            }

            matrix[y][x] = $element;
          } else {
            if (true === first) {
              let cssClass = (word.orientation) ? "orientation-horizontal" : "orientation-vertical";
              matrix[y][x].innerHTML += `<span class="word-id ${cssClass}">${word.id}</span>`;
              first = false;
            }
          }
        }

        return matrix;
      };

      this.solve = () => {
        for (let i = 0; i < matrix.length; i++) {
          for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j].classList.remove("correct");
            matrix[i][j].classList.remove("wrong");
          }
        }

        let result = {
          "words": []
        };

        let tiles = 0;
        let wrongTiles = 0;
        let wrongWords = 0;
        let correctTiles = 0;
        let correctWords = 0;

        for (let word of words) {
          let isCorrect = true;
          let x = word.x;
          let y = word.y;

          let wordResult = {
            "tiles": []
          };

          for (let letter of word.word) {
            let $element = matrix[y][x];

            if ($element.classList.contains("corrent") || $element.classList.contains("wrong")) {
              if (word.orientation) {
                x++;
              } else {
                y++;
              }

              continue;
            }

            tiles++;

            let tileResult = {
              "x": x,
              "y": y
            };

            if (letter === $element.querySelector('.letter').innerHTML) {
              correctTiles++;
              tileResult.correct = true;
              $element.classList.add("correct");
            } else {
              wrongTiles++;
              tileResult.correct = false;
              isCorrect = false;
              $element.classList.add("wrong");
            }

            if (word.orientation) {
              x++;
            } else {
              y++;
            }

            wordResult.tiles.push(tileResult);
          }

          wordResult.correct = isCorrect;
          wordResult.string = word.word;

          if (isCorrect) {
            correctWords++;
          } else {
            wrongWords++;
          }

          result.words.push(wordResult);
        }

        result.stats = {
          "tile_percentage": (correctTiles / tiles) * 100,
          "tiles": tiles,
          "correct_tiles": correctTiles,
          "wrong_tiles": wrongTiles,
          "word_percentage": (correctWords / words.length) * 100,
          "correct_words": correctWords,
          "wrong_words": wrongWords
        };

        self.onfinish(self, result);
      };
    },
  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}