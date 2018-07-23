{
  let component = {
    name: 'crossword-analytics',
    ccm: 'https://ccmjs.github.io/ccm/ccm.js',
    config: {
      css: [ "ccm.load", "https://marvinklemp.github.io/ccm-crossword-analytics/ccm/default.css", "https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"],
      html: {
        "main": {
          "tag": "div",
          "class": "container",
        },
        "heading": {
          "tag": "div",
          "class": "row segment margin-bot",
          "inner": [
            {
              "tag": "div",
              "class": "col-md-12",
              "inner": [
                {
                  "tag": "h1",
                  "inner": "Crossword Analytics"
                }
              ]
            }
          ]
        },
        "filter": {
          "tag": "div",
          "class": "row margin-bot",
          "inner": {
            "tag": "div",
            "class": "col-md-6",
            "inner": {
              "tag": "input",
              "id": "filter",
              "type": "text",
              "placeholder": "Username",
              "oninput": "%oninput%"
            }
          }
        },
        "table_container": {
          "tag": "div",
          "id": "table"
        },
        "table": {
          "tag": "div",
          "class": "row",
          "inner": [
            {
              "tag": "div",
              "class": "col-md-12",
              "inner": [
                {
                  "tag": "table",
                  "class": "table table-striped",
                  "inner": [
                    {
                      "tag": "thead",
                      "inner": [
                        {
                          "tag": "tr",
                          "inner": [
                            {
                              "tag": "th",
                              "inner": "User"
                            },
                            {
                              "tag": "th",
                              "inner": "Date"
                            },
                            {
                              "tag": "th",
                              "inner": "Words"
                            },
                            {
                              "tag": "th",
                              "inner": "Percentage"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "tag": "tbody",
                      "id": "table_rows",
                      "inner": []
                    }
                  ]
                }
              ]
            }
          ]
        },
        "table_row": {
          "class": "table_row",
          "tag": "tr",
          "inner": [
            {
              "tag": "td",
              "inner": "%username%",
            },
            {
              "tag": "td",
              "inner": "%date%",
            },
            {
              "tag": "td",
              "inner": "%words%",
            },
            {
              "tag": "td",
              "inner": "%percentage%",
            }
          ]
        },
        "word": {
          "tag": "p",
          "class": "%css%",
          "inner": "%word%"
        }
      },
      data: {
        store: ['ccm.store', {store: 'mklemp2s_crossword_results', url: 'https://ccm2.inf.h-brs.de'}]
      }
    },

    Instance: function () {
      let self = this;
      let $;
      let $main;
      let component;
      let results;

      this.start = callback => {
        $ = self.ccm.helper;
        component = $.privatize(self);

        component.data.store.get('{}', results => {
          this.render(results);
        });

        if ( callback ) callback();
      };

      this.render = function (crossword_results) {
        results = crossword_results;

        $main = $.html(component.html.main, {});
        $main.appendChild($.html(component.html.heading));
        $main.appendChild($.html(component.html.filter, {"oninput": function () {
            self.renderTable(this.value);
        }}));

        $main.appendChild($.html(component.html.table_container));

        this.renderTable();

        $.setContent(
          self.element,
          $main
        );
      };

      this.renderTable = function(username = null) {
        const $base = $.html(component.html.table);

        let display;
        if (username !== null) {
          display = results.filter(result => {
            if (result.key.length !== 2) {
              return false;
            }
            const result_username = result.key[0];

            return result_username.includes(username);
          });
        } else {
          display = results;
        }

        const $new_rows = display.map(result => {
          const $words = result.words.map(word => {
            const css = (word.correct) ? "correct" : "false";
            return $.html(component.html.word, {"word": word.string, "css": css});
          });

          return $.html(component.html.table_row, {
            "username": result.key[0],
            "date": result.created_at.split("T")[0],
            "words": $words,
            "percentage": result.stats.word_percentage
          });
        });

        const $table_rows = $base.querySelector('#table_rows');
        while ($table_rows.firstChild) {
          $table_rows.firstChild.remove();
        }

        for (let $table_row of $new_rows) {
          $table_rows.appendChild($table_row);
        }

        $.setContent(
          $main.querySelector('#table'),
          $base
        );
      }
    },
  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}
