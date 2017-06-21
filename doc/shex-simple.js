// shex-simple - Simple ShEx2 validator for HTML.
// Copyright 2017 Eric Prud'hommeux
// Release under MIT License.

const START_SHAPE_LABEL = "- start -";
var Base = "http://a.example/" ; // "https://rawgit.com/shexSpec/shex.js/master/doc/shex-simple.html"; // window.location.href;
var SchemaTextarea = $("#inputSchema textarea.schema");
var InputSchema = makeSchemaCache("#inputSchema textarea.schema");
var InputData = makeTurtleCache("#inputData textarea");
var ShExRSchema; // defined below

const uri = "<[^>]*>|[a-zA-Z0-9_-]*:[a-zA-Z0-9_-]*";
const uriOrKey = uri + "|FOCUS|_";
const ParseTriplePattern = RegExp("^(\\s*{\\s*)("+
                                uriOrKey+")?(\\s*)("+
                                uri+")?(\\s*)("+
                                uriOrKey+")?(\\s*)(})?(\\s*)$");

// utility functions
function parseTurtle (text, meta) {
  var ret = ShEx.N3.Store();
  ShEx.N3.Parser._resetBlankNodeIds();
  var parser = ShEx.N3.Parser({documentIRI:Base, format: "text/turtle" });
  var triples = parser.parse(text);
  if (triples !== undefined)
    ret.addTriples(triples);
  meta.base = parser._base;
  meta.prefixes = parser._prefixes;
  var resolver = new IRIResolver(meta);
  meta.termToLex = function (lex) { return  rdflib_termToLex(lex, resolver); };
  meta.lexToTerm = function (lex) { return  rdflib_lexToTerm(lex, resolver); };
  return ret;
}

var shexParser = ShEx.Parser.construct(Base);
function parseShEx (text, meta) {
  shexParser._setOptions({duplicateShape: $("#duplicateShape").val()});
  var ret = shexParser.parse(text);
  meta.base = ret.base;
  meta.prefixes = ret.prefixes;
  return ret;
}

function sum (s) { // cheap way to identify identical strings
  return s.replace(/\s/g, "").split("").reduce(function (a,b){
    a = ((a<<5) - a) + b.charCodeAt(0);
    return a&a
  },0);
}

// <n3.js-specific>
function rdflib_termToLex (node, resolver) {
  return node === "- start -" ? node : ShEx.N3.Writer({ prefixes:resolver.meta.prefixes || {} })._encodeObject(node);
}
function rdflib_lexToTerm (lex, resolver) {
  return lex === "- start -" ? lex : ShEx.N3.Lexer().tokenize(lex).map(token => {
    var left = 
          token.type === "typeIRI" ? "^^" :
          token.type === "langcode" ? "@" :
          token.type === "type" ? resolver.meta.prefixes[token.prefix] :
          token.type === "prefixed" ? resolver.meta.prefixes[token.prefix] :
          "";
    var right = token.type === "IRI" || token.type === "typeIRI" ?
          resolver._resolveAbsoluteIRI(token) :
          token.value;
    return left + right;
  }).join("");
  return lex === "- start -" ? lex : lex[0] === "<" ? lex.substr(1, lex.length - 2) : lex;
}
// </n3.js-specific>


// caches for textarea parsers
function _makeCache (parseSelector) {
  var _dirty = true;
  return {
    parseSelector: parseSelector,
    parsed: null,
    dirty: function (newVal) {
      var ret = _dirty;
      _dirty = newVal;
      return ret;
    },
    get: function () {
      return $(parseSelector).val();
    },
    set: function (text) {
      _dirty = true;
      $(parseSelector).val(text);
    },
    refresh: function () {
      if (!_dirty)
        return this.parsed;
      this.parsed = this.parse($(parseSelector).val());
      _dirty = false;
      return this.parsed;
    }
  };
}

function makeSchemaCache (parseSelector) {
  var ret = _makeCache(parseSelector);
  ret.meta = { prefixes: {}, base: null };
  var graph = null;
  ret.language = null;
  ret.parse = function (text) {
    var isJSON = text.match(/^\s*\{/);
    graph = isJSON ? null : tryN3(text);
    this.language =
      isJSON ? "ShExJ" :
      graph ? "ShExR" :
      "ShExC";
    $("#results .status").text("parsing "+this.language+" schema...").show();
    var schema =
          isJSON ? ShEx.Util.ShExJtoAS(JSON.parse(text)) :
          graph ? parseShExR() :
          parseShEx(text, ret.meta);
    var resolver = new IRIResolver(ret.meta);
    ret.meta.termToLex = function (lex) { return  rdflib_termToLex(lex, resolver); };
    ret.meta.lexToTerm = function (lex) { return  rdflib_lexToTerm(lex, resolver); };
    $("#results .status").hide();
    return schema;

    function tryN3 (text) {
      try {
        if (text.match(/^\s*$/))
          return null;
        var db = parseTurtle (text, ret.meta); // interpret empty schema as ShExC
        if (db.getTriples().length === 0)
          return null;
        return db;
      } catch (e) {
        return null;
      }
    }

    function parseShExR () {
      var graphParser = ShEx.Validator.construct(
        parseShEx(ShExRSchema, {}), // !! do something useful with the meta parm (prefixes and base)
        {}
      );
      var schemaRoot = graph.getTriples(null, ShEx.Util.RDF.type, "http://www.w3.org/ns/shex#Schema")[0].subject;
      var val = graphParser.validate(graph, schemaRoot); // start shape
      return ShEx.Util.ShExJtoAS(ShEx.Util.ShExRtoShExJ(ShEx.Util.valuesToSchema(ShEx.Util.valToValues(val))));
    }
  };
  ret.getShapes = function () {
    var obj = this.refresh();
    var start = "start" in obj ? [START_SHAPE_LABEL] : [];
    var rest = "shapes" in obj ? Object.keys(obj.shapes).map(InputSchema.meta.termToLex) : [];
    return start.concat(rest);
  };
  return ret;
}

function makeTurtleCache(parseSelector) {
  var ret = _makeCache(parseSelector);
  ret.meta = {};
  ret.parse = function (text) {
    return parseTurtle(text, ret.meta);
  };
  ret.getNodes = function () {
    var data = this.refresh();
    return data.getTriples().map(t => {
      return InputData.meta.termToLex(t.subject);
    });
  };
  return ret;
}

function IRIResolver (meta) {
  if (!(this instanceof IRIResolver))
    return new IRIResolver(options);
  this.meta = meta;
  this._setBase(meta.base);
};

var absoluteIRI = /^[a-z][a-z0-9+.-]*:/i,
    schemeAuthority = /^(?:([a-z][a-z0-9+.-]*:))?(?:\/\/[^\/]*)?/i,
    dotSegments = /(?:^|\/)\.\.?(?:$|[\/#?])/;
IRIResolver.prototype = {

  // vvv stolen from Ruben Vergorgh's N3Parser.js vvv
  // ### `_setBase` sets the base IRI to resolve relative IRIs
  _setBase: function (baseIRI) {
    if (!baseIRI)
      this._base = null;
    else {
      // Remove fragment if present
      var fragmentPos = baseIRI.indexOf('#');
      if (fragmentPos >= 0)
        baseIRI = baseIRI.substr(0, fragmentPos);
      // Set base IRI and its components
      this._base = baseIRI;
      this._basePath   = baseIRI.indexOf('/') < 0 ? baseIRI :
        baseIRI.replace(/[^\/?]*(?:\?.*)?$/, '');
      baseIRI = baseIRI.match(schemeAuthority);
      this._baseRoot   = baseIRI[0];
      this._baseScheme = baseIRI[1];
    }
  },

  // ### `_resolveIRI` resolves a relative IRI token against the base path,
  // assuming that a base path has been set and that the IRI is indeed relative
  _resolveIRI: function (token) {
    var iri = token.value;
    switch (iri[0]) {
      // An empty relative IRI indicates the base IRI
    case undefined: return this._base;
      // Resolve relative fragment IRIs against the base IRI
    case '#': return this._base + iri;
      // Resolve relative query string IRIs by replacing the query string
    case '?': return this._base.replace(/(?:\?.*)?$/, iri);
      // Resolve root-relative IRIs at the root of the base IRI
    case '/':
      // Resolve scheme-relative IRIs to the scheme
      return (iri[1] === '/' ? this._baseScheme : this._baseRoot) + this._removeDotSegments(iri);
      // Resolve all other IRIs at the base IRI's path
    default:
      return this._removeDotSegments(this._basePath + iri);
    }
  },

  // ### `_removeDotSegments` resolves './' and '../' path segments in an IRI as per RFC3986
  _removeDotSegments: function (iri) {
    // Don't modify the IRI if it does not contain any dot segments
    if (!dotSegments.test(iri))
      return iri;

    // Start with an imaginary slash before the IRI in order to resolve trailing './' and '../'
    var result = '', length = iri.length, i = -1, pathStart = -1, segmentStart = 0, next = '/';

    while (i < length) {
      switch (next) {
        // The path starts with the first slash after the authority
      case ':':
        if (pathStart < 0) {
          // Skip two slashes before the authority
          if (iri[++i] === '/' && iri[++i] === '/')
            // Skip to slash after the authority
            while ((pathStart = i + 1) < length && iri[pathStart] !== '/')
              i = pathStart;
        }
        break;
        // Don't modify a query string or fragment
      case '?':
      case '#':
        i = length;
        break;
        // Handle '/.' or '/..' path segments
      case '/':
        if (iri[i + 1] === '.') {
          next = iri[++i + 1];
          switch (next) {
            // Remove a '/.' segment
          case '/':
            result += iri.substring(segmentStart, i - 1);
            segmentStart = i + 1;
            break;
            // Remove a trailing '/.' segment
          case undefined:
          case '?':
          case '#':
            return result + iri.substring(segmentStart, i) + iri.substr(i + 1);
            // Remove a '/..' segment
          case '.':
            next = iri[++i + 1];
            if (next === undefined || next === '/' || next === '?' || next === '#') {
              result += iri.substring(segmentStart, i - 2);
              // Try to remove the parent path from result
              if ((segmentStart = result.lastIndexOf('/')) >= pathStart)
                result = result.substr(0, segmentStart);
              // Remove a trailing '/..' segment
              if (next !== '/')
                return result + '/' + iri.substr(i + 1);
              segmentStart = i + 1;
            }
          }
        }
      }
      next = iri[++i];
    }
    return result + iri.substring(segmentStart);
  },

  _resolveAbsoluteIRI: function  (token) {
    return (this._base === null || absoluteIRI.test(token.value)) ?
      token.value : this._resolveIRI(token);
  }
};


// controls for example links
function load (selector, obj, func, listItems, side, str) {
  $(selector).empty();
  Object.keys(obj).forEach(k => {
    var li = $('<li><a href="#">' + k + '</li>');
    li.on("click", () => {
      func(k, obj[k], li, listItems, side);
    });
    listItems[side][sum(str(obj[k]))] = li;
    $(selector).append(li);
  });
}

function clearData () {
  InputData.set("");
  $(".focus").val("");
  $("#inputData .status").text(" ");
  results.clear();
}

function clearAll () {
  $("#results .status").hide();
  InputSchema.set("");
  $(".inputShape").val("");
  $("#inputSchema .status").text(" ");
  $("#inputSchema li.selected").removeClass("selected");
  clearData();
  $("#inputData .passes, #inputData .fails").hide();
  $("#inputData .passes p:first").text("");
  $("#inputData .fails p:first").text("");
  $("#inputData .passes ul, #inputData .fails ul").empty();
}

function pickSchema (name, schemaTest, elt, listItems, side) {
  if ($(elt).hasClass("selected")) {
    clearAll();
  } else {
    InputSchema.set(schemaTest.schema);
    $("#inputSchema .status").text(name);

    InputData.set("");
    $("#inputData .status").text(" ");
    $("#inputData .passes, #inputData .fails").show();
    $("#inputData .passes p:first").text("Passing:");
    load("#inputData .passes ul", schemaTest.passes, pickData, listItems, "inputData", function (o) { return o.data; });
    $("#inputData .fails p:first").text("Failing:");
    load("#inputData .fails ul", schemaTest.fails, pickData, listItems, "inputData", function (o) { return o.data; });

    results.clear();
    $("#inputSchema li.selected").removeClass("selected");
    $(elt).addClass("selected");
    $("input.schema").val(InputSchema.getShapes()[0]);
  }
}

function pickData (name, dataTest, elt, listItems, side) {
  if ($(elt).hasClass("selected")) {
    clearData();
    $(elt).removeClass("selected");
  } else {
    InputData.set(dataTest.data);
    $("#inputData .status").text(name);
    $("#inputData li.selected").removeClass("selected");
    $(elt).addClass("selected");
    //    $("input.data").val(getDataNodes()[0]);
    // hard-code the first node/shape pair
    removeNodeShapePair(null);
    // $("#focus0").val(dataTest.inputShapeMap[0].node); // inputNode in Map-test
    // $("#inputShape0").val(dataTest.inputShapeMap[0].shape); // srcSchema.start in Map-test
    // removeNodeShapePair(null);
    $("#textMap").val(dataTest.queryMap);
    parseQueryMap(dataTest.queryMap);
    // validate();
  }
}


// Control results area content.
var results = (function () {
  var resultsElt = autosize(document.querySelector("#results div"));
  var resultsSel = $("#results div");
  return {
    replace: function (text) {
      var ret = resultsSel.text(text);
      autosize.update(resultsElt);
      return ret;
    },
    append: function (text) {
      var ret = resultsSel.append(text);
      autosize.update(resultsElt);
      return ret;
    },
    clear: function () {
      resultsSel.removeClass("passes fails error");
      var ret = resultsSel.text("");
      autosize.update(resultsElt);
      return ret;
    },
    start: function () {
      resultsSel.removeClass("passes fails error");
      $("#results").addClass("running");
    },
    finish: function () {
      $("#results").removeClass("running");
      var height = resultsSel.height();
      resultsSel.height(1);
      resultsSel.animate({height:height}, 100);
    }
  };
})();


// Validation UI
function disableResultsAndValidate () {
  results.start();
  setTimeout(function () {
    validate();
  }, 0);
}

function hasFocusNode () {
  return $(".focus").map((idx, elt) => {
    return $(elt).val();
  }).get().some(str => {
    return str.length > 0;
  });
}

function validate () {
  results.clear();
  $("#fixedMap .pair").removeClass("passes").removeClass("fails");
  $("#results .status").hide();
  var parsing = "input schema";
  try {
    InputSchema.refresh();
    $("#schemaDialect").text(InputSchema.language);
    var dataText = InputData.get();
    if (dataText || hasFocusNode()) {
      parsing = "input data";
      InputData.refresh(); // for prefixes for getShapeMap
      var fixedMap = fixedShapeMapToTerms(parseUIQueryMap());
      $("#results .status").text("parsing data...").show();
      var inputData = InputData.refresh();

      $("#results .status").text("creating validator...").show();
      var validator = ShEx.Validator.construct(InputSchema.refresh(),
                      { results: "api"
                      /*, regexModule: modules["../lib/regex/nfax-val-1err"] */ });

      $("#results .status").text("validating...").show();
      var ret = validator.validate(inputData, fixedMap);
      // var dated = Object.assign({ _when: new Date().toISOString() }, ret);
      $("#results .status").text("rendering results...").show();
      ret.forEach(renderEntry);
      // for debugging values and schema formats:
      // try {
      //   var x = ShExUtil.valToValues(ret);
      //   // var x = ShExUtil.ShExJtoAS(valuesToSchema(valToValues(ret)));
      //   res = results.replace(JSON.stringify(x, null, "  "));
      //   var y = ShExUtil.valuesToSchema(x);
      //   res = results.append(JSON.stringify(y, null, "  "));
      // } catch (e) {
      //   console.dir(e);
      // }
      finishRendering();
    } else {
      var outputLanguage = InputSchema.language === "ShExJ" ? "ShExC" : "ShExJ";
      $("#results .status").
        text("parsed "+InputSchema.language+" schema, generated "+outputLanguage+" ").
        append($("<button>(copy to input)</button>").
               css("border-radius", ".5em").
               on("click", function () {
                 InputSchema.set($("#results div").text());
               })).
        append(":").
        show();
      var parsedSchema;
      if (InputSchema.language === "ShExJ") {
        new ShEx.Writer({simplifyParentheses: false}).writeSchema(InputSchema.parsed, (error, text) => {
          if (error) {
            $("#results .status").text("unwritable ShExJ schema:\n" + error).show();
            // res.addClass("error");
          } else {
            results.append($("<pre/>").text(text).addClass("passes"));
          }
        });
      } else {
        var pre = $("<pre/>");
        pre.text(JSON.stringify(ShEx.Util.AStoShExJ(ShEx.Util.canonicalize(InputSchema.parsed)), null, "  ")).addClass("passes");
        results.append(pre);
      }
      results.finish();
    }
  } catch (e) {
    results.replace("error parsing " + parsing + ":\n").addClass("error").
      append($("<pre/>").text(e.stack || e));
  }

  function renderEntry (entry) {
    var fails = entry.status === "nonconformant";
    var klass = fails ? "fails" : "passes";

    // update the FixedMap
    $("#fixedMap .pair").filter((idx, elt) => {
      return $(elt).attr("data-node") === entry.node &&
        $(elt).attr("data-shape") === entry.shape;
    }).addClass(klass);

    switch (iface.interface) {
    case "human":
      var elt = $("<div class='human'/>").text(
        `${InputSchema.meta.termToLex(entry.node)}@${fails ? "!" : ""}${InputData.meta.termToLex(entry.shape)}`
      ).addClass(klass);
      if (fails)
        elt.append($("<pre>").text(ShEx.Util.errsToSimple(entry.appinfo).join("\n")));
      results.append(elt);
      break;
    case "minimal":
      if (fails)
        entry.reason = ShEx.Util.errsToSimple(entry.appinfo).join("\n");
      delete entry.appinfo;
      // fall through to default
    default:
      results.append($("<pre/>").text(JSON.stringify(entry, null, "  ")).
                     addClass(klass));
    }
  }

  function finishRendering () {
          $("#results .status").text("rendering results...").show();
          // Add commas to JSON results.
          if (iface.interface !== "human")
            $("#results div *").each((idx, elt) => {
              if (idx === 0)
                $(elt).prepend("[");
              $(elt).append(idx === $("#results div *").length - 1 ? "]" : ",");
            });
      $("#results .status").hide();
      // for debugging values and schema formats:
      // try {
      //   var x = ShEx.Util.valToValues(ret);
      //   // var x = ShEx.Util.ShExJtoAS(valuesToSchema(valToValues(ret)));
      //   res = results.replace(JSON.stringify(x, null, "  "));
      //   var y = ShEx.Util.valuesToSchema(x);
      //   res = results.append(JSON.stringify(y, null, "  "));
      // } catch (e) {
      //   console.dir(e);
      // }
      results.finish();
  }
}

function addNodeShapePair (evt, pairs) {
  if (evt)
    pairs = [{node: "", shape: ""}];
  pairs.forEach(pair => {
    var span = $("<li class='pair'/>");
    var focus = $("<input "+"' type='text' value='"+pair.node.replace(/['"]/g, "&quot;")+
                  "' class='data focus'/>");
    var shape = $("<input "+"' type='text' value='"+pair.shape.replace(/['"]/g, "&quot;")+
                  "' class='schema inputShape context-menu-one btn btn-neutral'/>");
    var add = $('<button class="addPair" title="add a node/shape pair">+</button>');
    var remove = $('<button class="removePair" title="remove this node/shape pair">-</button>');
    add.on("click", addNodeShapePair);
    remove.on("click", removeNodeShapePair);
    span.append(focus, "@", shape, add, remove);
    if (evt) {
      $(evt.target).parent().after(span);
    } else {
      $("#editMap").append(span);
    }
  });
  if ($(".removePair").length === 1)
    $(".removePair").css("visibility", "hidden");
  else
    $(".removePair").css("visibility", "visible");
  $("#editMap .pair").each(idx => {
    addContextMenus("#editMap .pair:nth("+idx+") .focus", ".pair:nth("+idx+") .inputShape");
  });
  return false;
}

function removeNodeShapePair (evt) {
  if (evt) {
    $(evt.target).parent().remove();
  } else {
    $("#editMap .pair").remove();
  }
  if ($(".removePair").length === 1)
    $(".removePair").css("visibility", "hidden");
  return false;
}

function prepareControls () {
  // $("#inputData .passes, #inputData .fails").hide();
  // $("#inputData .passes ul, #inputData .fails ul").empty();
  $("#menu-button").on("click", toggleControls);
  $("#interface").on("change", setInterface);
  $("#validate").on("click", disableResultsAndValidate);
  $("#clear").on("click", clearAll);

  $("#loadForm").dialog({
    autoOpen: false,
    modal: true,
    open: function (evt, ui) {
      debugger;
      console.dir(evt);
    },
    buttons: {
      "GET": function (evt, ui) {
        var url = $("#loadInput").val();
        var tips = $(".validateTips");
        function updateTips (t) {
          tips
            .text( t )
            .addClass( "ui-state-highlight" );
          setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
          }, 500 );
        }
        if (url.length < 5) {
          $("#loadInput").addClass("ui-state-error");
          updateTips("URL \"" + url + "\" is way too short.");
          return;
        }
        tips.removeClass("ui-state-highlight").text();
        $.ajax({
          accepts: {
            mycustomtype: 'text/shex,text/turtle,*/*'
          },
          url: url
        }).fail(function( jqXHR, textStatus ) {
          updateTips("GET <" + url + "> failed: " + jqXHR.statusText);
        }).done(function (data) {
          if ($("#loadForm span").text() === "schema")
            InputSchema.set(data);
          else
            InputData.set(data);
          $("#loadForm").dialog("close");
          toggleControls();
        });
      },
      Cancel: function() {
        $("#loadInput").removeClass("ui-state-error");
        $("#loadForm").dialog("close");
        toggleControls();
      }
    },
    close: function() {
      $("#loadInput").removeClass("ui-state-error");
      $("#loadForm").dialog("close");
      toggleControls();
    }
  });
  ["schema", "data"].forEach(type => {
    $("#load-"+type+"-button").click(evt => {
      $("#loadForm").attr("class", type).find("span").text(type);
      $("#loadForm").dialog("open");
      console.dir(type);
    });
  });

  $("#about").dialog({
    autoOpen: false,
    modal: true,
    width: "50%",
    buttons: {
      "Dismiss": dismissModal
    },
    close: dismissModal
  });

  $("#about-button").click(evt => {
    $("#about").dialog("open");
  });

  $("#shapeMap-tabs").tabs();

  function dismissModal (evt) {
    // $.unblockUI();
    $("#about").dialog("close");
    toggleControls();
    return true;
  }

  // Prepare file uploads
  $("input.inputfile").each((idx, elt) => {
    $(elt).on("change", function (evt) {
      var reader = new FileReader();

      reader.onload = function(evt) {
        if(evt.target.readyState != 2) return;
        if(evt.target.error) {
          alert("Error while reading file");
          return;
        }
        $($(elt).attr("data-target")).val(evt.target.result);
      };

      reader.readAsText(evt.target.files[0]);
    });
  });
}

function toggleControls (evt) {
  $("#interface option[value='"+iface.interface+"']").attr('selected','selected');
  var revealing = evt && $("#controls").css("display") !== "flex";
  $("#controls").css("display", revealing ? "flex" : "none");
  toggleControlsArrow(revealing ? "up" : "down");
  if (revealing) {
    var target = evt.target;
    while (target.tagName !== "BUTTON")
      target = target.parentElement;
    if ($("#menuForm").css("position") === "absolute") {
      $("#controls").
        css("top", 0).
        css("left", $("#menu-button").css("margin-left"));
    } else {
      var bottonBBox = target.getBoundingClientRect();
      var controlsBBox = $("#menuForm").get(0).getBoundingClientRect();
      var left = bottonBBox.right - bottonBBox.width; // - controlsBBox.width;
      $("#controls").css("top", bottonBBox.bottom).css("left", left);
    }
    $("#permalink a").attr("href", getPermalink());
  }
  return false;
}

function toggleControlsArrow (which) {
  // jQuery can't find() a prefixed attribute (xlink:href); fall back to DOM:
  var down = $(document.getElementById("menu-button").
               querySelectorAll('use[*|href="#down-arrow"]'));
  var up = $(document.getElementById("menu-button").
             querySelectorAll('use[*|href="#up-arrow"]'));

  switch (which) {
  case "down":
    down.show();
    up.hide();
    break;
  case "up":
    down.hide();
    up.show();
    break;
  default:
    throw Error("toggleControlsArrow expected [up|down], got \"" + which + "\"");
  }
}

function setInterface (evt) {
  iface.interface = $("#interface option:selected").val()
  toggleControls();
  // $("#controls").css("display", "none");
  customizeInterface();
}

/**
 *
 * location.search: e.g. "?schema=asdf&data=qwer&shape-map=ab%5Ecd%5E%5E_ef%5Egh"
 */
var parseQueryString = function(query) {
  if (query[0]==='?') query=query.substr(1); // optional leading '?'
  var map   = {};
  query.replace(/([^&,=]+)=?([^&,]*)(?:[&,]+|$)/g, function(match, key, value) {
    key=decodeURIComponent(key);value=decodeURIComponent(value);
    (map[key] = map[key] || []).push(value);
  });
  return map;
};

/** getShapeMap -- zip a node list and a shape list into a ShapeMap
 * use {InputData,InputSchema}.meta.{prefix,base} to complete IRIs
 */
function parseUIQueryMap () {
  $("#fixedMap").empty();
  var mapAndErrors = $("#editMap .pair").get().reduce((acc, queryPair) => {
    var nodeSelector = $(queryPair).find(".focus").val();
    var shape = $(queryPair).find(".inputShape").val();
    if (!nodeSelector || !shape)
      return acc;
    var m = nodeSelector.match(ParseTriplePattern);
    var nodes = m ? getTriples (m[2], m[4], m[6]) : [nodeSelector];
    nodes.forEach(node => {
      var span = $("<li class='pair'/>", {
        "data-node":    InputData.meta.lexToTerm(node),
        "data-shape": InputSchema.meta.lexToTerm(shape)
      });
      var focusElt = $("<input "+"' type='text' value='"+node.replace(/['"]/g, "&quot;")+
                       "' class='data focus'/>").
          on("blur", deployEditMap);
      var shapeElt = $("<input "+"' type='text' value='"+shape.replace(/['"]/g, "&quot;")+
                       "' class='schema inputShape context-menu-one btn btn-neutral'/>").
          on("blur", deployEditMap);
      // var add = $('<button class="addPair" title="add a node/shape pair">+</button>');
      var remove = $('<button class="removePair" title="remove this node/shape pair">-</button>');
      // add.on("click", addNodeShapePair);
      remove.on("click", removeNodeShapePair);
      span.append(focusElt, "@", shapeElt, /* add, */ remove);
      $("#fixedMap").append(span);
      acc.shapeMap.push({node: node, shape: shape});
    });
    return acc;
  }, {shapeMap: [], errors: []});

  if (mapAndErrors.errors.length) // !! overwritten immediately
    results.append(mapAndErrors.errors.join("\n"));
  return mapAndErrors.shapeMap;

  function getTriples (s, p, o) {
    var get = s === "FOCUS" ? "subject" : "object";
    return InputData.refresh().getTriplesByIRI(mine(s), mine(p), mine(o)).map(t => {
      return InputData.meta.termToLex(t[get]);
    });
    function mine (term) {
      return term === "FOCUS" || term === "_" ? null : InputData.meta.lexToTerm(term);
    }
  }
}

function deployEditMap () {
  var text = $("#editMap .pair").get().reduce((acc, queryPair) => {
    var nodeSelector = $(queryPair).find(".focus").val();
    var shape = $(queryPair).find(".inputShape").val();
    if (!nodeSelector || !shape)
      return acc;
    return acc.concat([nodeSelector+"@"+shape]);
  });
  $("#textMap").empty().val(text);
}

/** fixedShapeMapToTerms -- map ShapeMap to API terms
 * @@TODO: add to ShExValidator so API accepts ShapeMap
 */
function fixedShapeMapToTerms (shapeMap) {
  return shapeMap.map(pair => {
    return {node: InputData.meta.lexToTerm(pair.node),
            shape: InputSchema.meta.lexToTerm(pair.shape)};
  });
}

var iface = null; // needed by validate before prepareInterface returns.
var QueryParams = [{queryStringParm: "schema", location: SchemaTextarea},
                   {queryStringParm: "data", location: $("#inputData textarea")},
                   {queryStringParam: "queryMap", location: $("#textMap")}];

/**
 * Load URL search parameters
 */
function prepareInterface () {
  // don't overwrite if we arrived here from going back for forth in history
  if (SchemaTextarea.val() !== "" || $("#inputData textarea").val() !== "")
    return;

  iface = parseQueryString(location.search);
  if ("shape-map" in iface) {
    parseQueryMap(iface["shape-map"].
                  filter(s => { return s.length > 0; }).
                  join(","));
    delete iface["shape-map"];
  } else
    addNodeShapePair(null, [{node: "", shape: ""}]);

  toggleControlsArrow("down");
  if ("interface" in iface)
    iface.interface = iface.interface[0];
  else
    iface.interface = "human";

  QueryParams.forEach(input => {
    var parm = input.queryStringParm;
    if (parm in iface)
      iface[parm].forEach(text => {
        input.location.val(input.location.val() + text);
      });
  });
  customizeInterface();
  if ("schema" in iface && iface.schema.reduce((r, elt) => {
    return r+elt.length;
  }, 0)) {
    validate();
  }
  // // old hack for permalink
  // SchemaTextarea.prev().add("#title").on("click", evt => {
  //   window.history.pushState(null, null, getPermalink());
  // });
}

function parseQueryMap (shapeMap) {
  //     "(?:(<[^>]*>)|((?:[^\\@,]|\\[@,])+))" catches components
  var s = "((?:<[^>]*>)|(?:[^\\@,]|\\[@,])+)";
  var pairPattern = "(" + s + "|" + ParseTriplePattern + ")" + "@" + s + ",?";
  iface.shapeMap = {};
  // e.g.: shapeMao = "my:n1@my:Shape1,<n2>@<Shape2>,my:n\\@3:.@<Shape3>";
  var pairs = (shapeMap + ",").match(/([^,\\]|\\.)+,/g).
      map(s => s.substr(0, s.length-1)); // trim ','s

  pairs.forEach(r2 => {
    var m = r2.match(/^((?:[^@\\]|\\@)*)@((?:[^@\\]|\\@)*)$/);
    if (m) {
      var node = m[1] || "";
      var shape = m[2] || "";
      iface.shapeMap[node] = node in iface.shapeMap ? iface.shapeMap[node].concat(shape) : [shape];
      addNodeShapePair(null, [{node: node, shape: shape}]);
    }
  });
}

  /**
   * update location with a current values of some inputs
   */
  function getPermalink () {
    var parms = [];
    if (iface.interface)
      parms.push("interface="+iface.interface);
    var pairs = $("#queryMap .pair");
    if (pairs.length > 0) {
      parms.push("shape-map=" + pairs.map((idx, elt) => {
        var node = $(elt).find(".focus").val();
        var shape = $(elt).find(".inputShape").val();
        return [encodeURIComponent(node + "@" + shape)];
      }).get().join(encodeURIComponent(",")));
    }
    parms = parms.concat(QueryParams.map(input => {
      var parm = input.queryStringParm;
      return parm + "=" + encodeURIComponent(input.location.val());
    }));
    var s = parms.join("&");
    return location.origin + location.pathname + "?" + s;
  }

function customizeInterface () {
  if (iface.interface === "minimal") {
    $("#inputSchema .status").html("schema (<span id=\"schemaDialect\">ShEx</span>)").show();
    $("#inputData .status").html("data (<span id=\"dataDialect\">Turtle</span>)").show();
    $("#actions").parent().children().not("#actions").hide();
    $("#title img, #title h1").hide();
    $("#menuForm").css("position", "absolute").css(
      "left",
      $("#inputSchema .status").get(0).getBoundingClientRect().width -
        $("#menuForm").get(0).getBoundingClientRect().width
    );
    $("#controls").css("position", "relative");
  } else {
    $("#inputSchema .status").html("schema (<span id=\"schemaDialect\">ShEx</span>)").hide();
    $("#inputData .status").html("data (<span id=\"dataDialect\">Turtle</span>)").hide();
    $("#actions").parent().children().not("#actions").show();
    $("#title img, #title h1").show();
    $("#menuForm").removeAttr("style");
    $("#controls").css("position", "absolute");
  }
}

/**
 * Prepare drag and drop into text areas
 */
function prepareDragAndDrop () {
  var _scma = SchemaTextarea;
  var _data = $("#inputData textarea");
  var _body = $("body");
  [{dropElt: _scma, targets: [{ext: "", target: InputSchema}]},
   {dropElt: _data, targets: [{ext: "", target: InputData}]},
   {dropElt: _body, targets: [{ext: ".shex", target: InputSchema},
                              {ext: ".ttl", target: InputData}]}].
    forEach(desc => {
      // kudos to http://html5demos.com/dnd-upload
      desc.dropElt.
        on("drag dragstart dragend dragover dragenter dragleave drop", function (e) {
          e.preventDefault();
          e.stopPropagation();
        }).
        on("dragover dragenter", (e) => {
          desc.dropElt.addClass("hover");
        }).
        on("dragend dragleave drop", (e) => {
          desc.dropElt.removeClass("hover");
        }).
        on("drop", (e) => {
          readfiles(e.originalEvent.dataTransfer.files, desc.targets);
        });
    });
  function readfiles(files, targets) {
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
      var file = files[i], name = file.name;
      var target = targets.reduce((ret, elt) => {
        return ret ? ret :
          name.endsWith(elt.ext) ? elt.target :
          null;
      }, null);
      if (target) {
        formData.append("file", file);
        var reader = new FileReader();
        reader.onload = (function (target) {
          return function (event) {
            var appendTo = $("#append").is(":checked") ? target.get() : "";
            target.set(appendTo + event.target.result);
          };
        })(target);
        reader.readAsText(file);
      } else {
        results.append("don't know what to do with " + name + "\n");
      }
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/devnull.php"); // One must ignore these errors, sorry!
    xhr.send(formData);
  }
}

// prepareDemos() is invoked after these variables are assigned:
var clinicalObs = {};
function prepareDemos () {
  var demos = {
    "clinical observation": {
      schema: clinicalObs.schema,
      passes: {
        "with birthdate": {
          data: clinicalObs.with_birthdate,
          queryMap: "{FOCUS :status _}@- start -"},
        "without birthdate": {
          data: clinicalObs.without_birthdate,
          queryMap: "<http://a.example/Obs1>@- start -"},
        "no subject name": {
          data: clinicalObs.no_subject_name,
          queryMap: "<http://a.example/Obs1>@- start -"}
      },
      fails: {
        "bad status": {
          data: clinicalObs.bad_status,
          queryMap: "<http://a.example/Obs1>@- start -"},
        "no subject": {
          data: clinicalObs.no_subject,
          queryMap: "<http://a.example/Obs1>@- start -"},
        "wrong birthdate datatype": {
          data: clinicalObs.birthdate_datatype,
          queryMap: "<http://a.example/Obs1>@- start -"}
      }
    }
  };
  var listItems = {inputSchema:{}, inputData:{}};
  load("#inputSchema .examples ul", demos, pickSchema,
       listItems, "inputSchema", function (o) {
         return o.schema;
       });
  var timeouts = { inputSchema: undefined, inputData: undefined };
  function later (target, side, cache) {
    cache.dirty(true);
    if (timeouts[side])
      clearTimeout(timeouts[side]);

    timeouts[side] = setTimeout(() => {
      timeouts[side] = undefined;
      $("#"+side+" .selected").removeClass("selected");
      var curSum = sum($(target).val());
      if (curSum in listItems[side])
        listItems[side][curSum].addClass("selected");
    }, 250);
  }
  $("body").keydown(function (e) { // keydown because we need to preventDefault
    var code = e.keyCode || e.charCode; // standards anyone?
    if (e.ctrlKey && (code === 10 || code === 13)) {
      $("#validate").click();
      return false; // same as e.preventDefault();
    }
  });
  SchemaTextarea.keyup(function (e) { // keyup to capture backspace
    var code = e.keyCode || e.charCode;
    if (!(e.ctrlKey && (code === 10 || code === 13)))
      later(e.target, "inputSchema", InputSchema);
  });
  $("#inputData textarea").keyup(function (e) {
    var code = e.keyCode || e.charCode;
    if (!(e.ctrlKey && (code === 10 || code === 13)))
      later(e.target, "inputData", InputData);
  });
  addContextMenus("#focus0", "#inputShape0");
}
function addContextMenus (nodeSelector, shapeSelector) {
  [ { inputSelector: nodeSelector,
      getItems: function () { return InputData.getNodes(); } },
    { inputSelector: shapeSelector,
      getItems: function () { return InputSchema.getShapes(); } }
  ].forEach(entry => {
    // !!! terribly stateful; only one context menu at a time!
    var terms = null, v = null, target, scrollLeft, m, addSpace = "";
    $.contextMenu({
      selector: entry.inputSelector,
      callback: function (key, options) {
        if (terms) {
          var term = terms.tz[terms.match];
          var val = v.substr(0, term[0]) +
              key + addSpace +
              v.substr(term[0] + term[1]);
          if (terms.match === 2 && !m[8])
            val = val + "}";
          else if (term[0] + term[1] === v.length)
            val = val + " ";
          $(options.selector).val(val);
          // target.scrollLeft = scrollLeft + val.length - v.length;
          target.scrollLeft = target.scrollWidth;
        } else {
          $(options.selector).val(key);
        }
      },
      build: function (elt, evt) {
        if (elt.hasClass("data")) {
          v = elt.val();
          m = v.match(ParseTriplePattern);
          if (m) {
            target = evt.target;
            var selStart = target.selectionStart;
            scrollLeft = target.scrollLeft;
            terms = [0, 1, 2].reduce((acc, ord) => {
              if (m[(ord+1)*2-1] !== undefined) {
                var at = acc.start + m[(ord+1)*2-1].length;
                var len = m[(ord+1)*2] ? m[(ord+1)*2].length : 0;
                return {
                  start: at + len,
                  tz: acc.tz.concat([[at, len]]),
                  match: acc.match === null && at + len >= selStart ?
                    ord :
                    acc.match
                };
              } else {
                return acc;
              }
            }, {start: 0, tz: [], match: null });
            function norm (tz) {
              return tz.map(t => {
                return InputData.meta.termToLex(t);
              });
            }
            const getTermsFunctions = [
              () => { return ["FOCUS", "_"].concat(norm(store.getSubjects())); },
              () => { return norm(store.getPredicates()); },
              () => { return ["FOCUS", "_"].concat(norm(store.getObjects())); },
            ];
            var store = InputData.refresh();
            var items = getTermsFunctions[terms.match]();
            return {
              items:
              items.reduce((ret, opt) => {
                ret[opt] = { name: opt };
                return ret;
              }, {})
            };
            
          }
        }
        terms = v = null;
        return {
          items:
          entry.getItems().reduce((ret, opt) => {
            ret[opt] = { name: opt };
            return ret;
          }, {})
        };
      }
    });
  });
}

// Large constants with demo data which break syntax highlighting:
clinicalObs.schema = `PREFIX : <http://hl7.org/fhir/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

start = @<ObservationShape>

<ObservationShape> {               # An Observation has:
  :status ["preliminary" "final"]; #   status in this value set
  :subject @<PatientShape>         #   a subject matching <PatientShape>.
}

<PatientShape> {                   # A Patient has:
 :name xsd:string*;                #   one or more names
 :birthdate xsd:date?              #   and an optional birthdate.
}
`;
clinicalObs.with_birthdate = `PREFIX : <http://hl7.org/fhir/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<Obs1>
  :status    "final" ;
  :subject   <Patient2> .

<Patient2>
  :name "Bob" ;
  :birthdate "1999-12-31"^^xsd:date .`;
clinicalObs.no_subject_name = `PREFIX : <http://hl7.org/fhir/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<Obs1>
  :status    "final" ;
  :subject   <Patient2> .

<Patient2>
  :birthdate "1999-12-31"^^xsd:date .`;
clinicalObs.without_birthdate = `PREFIX : <http://hl7.org/fhir/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<Obs1>
  :status    "preliminary" ;
  :subject   <Patient2> .

<Patient2>
  :name "Bob" .`;
clinicalObs.bad_status = `PREFIX : <http://hl7.org/fhir/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<Obs1>
  :status    "finally" ;
  :subject   <Patient2> .

<Patient2>
  :name "Bob" ;
  :birthdate "1999-12-31"^^xsd:date .

`;
clinicalObs.no_subject = `PREFIX : <http://hl7.org/fhir/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<Obs1>
  :status    "final" .

<Patient2>
  :name "Bob" ;
  :birthdate "1999-12-31"^^xsd:date .

`;
clinicalObs.birthdate_datatype = `PREFIX : <http://hl7.org/fhir/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<Obs1>
  :status    "final" ;
  :subject   <Patient2> .

<Patient2>
  :name "Bob" ;
  :birthdate "1999-12-31T01:23:45"^^xsd:dateTime .`;

ShExRSchema = `PREFIX sx: <http://www.w3.org/ns/shex#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
BASE <http://www.w3.org/ns/shex#>
start=@<Schema>

<Schema> CLOSED {
  a [sx:Schema] ;
  sx:startActs @<SemActList1Plus>? ;
  sx:start @<shapeExpr>?;
  sx:shapes @<shapeExpr>*
}

<shapeExpr> @<ShapeOr> OR @<ShapeAnd> OR @<ShapeNot> OR @<NodeConstraint> OR @<Shape> OR @<ShapeExternal>

<ShapeOr> CLOSED {
  a [sx:ShapeOr] ;
  sx:shapeExprs @<shapeExprList2Plus>
}

<ShapeAnd> CLOSED {
  a [sx:ShapeAnd] ;
  sx:shapeExprs @<shapeExprList2Plus>
}

<ShapeNot> CLOSED {
  a [sx:ShapeNot] ;
  sx:shapeExpr @<shapeExpr>
}

<NodeConstraint> CLOSED {
  a [sx:NodeConstraint] ;
  sx:nodeKind [sx:iri sx:bnode sx:literal sx:nonliteral]?;
  sx:datatype IRI ? ;
  &<xsFacets>  ;
  sx:values @<valueSetValueList1Plus>?
}

<Shape> CLOSED {
  a [sx:Shape] ;
  sx:closed [true false]? ;
  sx:extra IRI* ;
  sx:expression @<tripleExpression>? ;
  sx:semActs @<SemActList1Plus>? ;
  sx:annotation @<Annotation>* ;
}

<ShapeExternal> CLOSED {
  a [sx:ShapeExternal] ;
}

<SemAct> CLOSED {
  a [sx:SemAct] ;
  sx:name IRI ;
  sx:code xsd:string?
}

<Annotation> CLOSED {
  a [sx:Annotation] ;
  sx:predicate IRI ;
  sx:object @<objectValue>
}

# <xsFacet> @<stringFacet> OR @<numericFacet>
<facet_holder> { # hold labeled productions
  $<xsFacets> ( &<stringFacet> | &<numericFacet> )* ;
  $<stringFacet> (
      sx:length xsd:integer
    | sx:minlength xsd:integer
    | sx:maxlength xsd:integer
    | sx:pattern xsd:string ; sx:flags xsd:string?
  );
  $<numericFacet> (
      sx:mininclusive   @<numericLiteral>
    | sx:minexclusive   @<numericLiteral>
    | sx:maxinclusive   @<numericLiteral>
    | sx:maxexclusive   @<numericLiteral>
    | sx:totaldigits    xsd:integer
    | sx:fractiondigits xsd:integer
  )
}
<numericLiteral> xsd:integer OR xsd:decimal OR xsd:double

<valueSetValue> @<objectValue> OR @<IriStem> OR @<IriStemRange>
                               OR @<LiteralStem> OR @<LiteralStemRange>
                               OR @<LanguageStem> OR @<LanguageStemRange>
<objectValue> IRI OR LITERAL # rdf:langString breaks on Annotation.object
<IriStem> CLOSED { a [sx:IriStem]; sx:stem xsd:string }
<IriStemRange> CLOSED {
  a [sx:IriStemRange];
  sx:stem xsd:string OR @<Wildcard>;
  sx:exclusion @<objectValue> OR @<IriStem>*
}
<LiteralStem> CLOSED { a [sx:LiteralStem]; sx:stem xsd:string }
<LiteralStemRange> CLOSED {
  a [sx:LiteralStemRange];
  sx:stem xsd:string OR @<Wildcard>;
  sx:exclusion @<objectValue> OR @<LiteralStem>*
}
<LanguageStem> CLOSED { a [sx:LanguageStem]; sx:stem xsd:string }
<LanguageStemRange> CLOSED {
  a [sx:LanguageStemRange];
  sx:stem xsd:string OR @<Wildcard>;
  sx:exclusion @<objectValue> OR @<LanguageStem>*
}
<Wildcard> BNODE CLOSED {
  a [sx:Wildcard]
}

<tripleExpression> @<TripleConstraint> OR @<OneOf> OR @<EachOf>

<OneOf> CLOSED {
  a [sx:OneOf] ;
  sx:min xsd:integer? ;
  sx:max xsd:integer? ;
  sx:expressions @<tripleExpressionList2Plus> ;
  sx:semActs @<SemActList1Plus>? ;
  sx:annotation @<Annotation>*
}

<EachOf> CLOSED {
  a [sx:EachOf] ;
  sx:min xsd:integer? ;
  sx:max xsd:integer? ;
  sx:expressions @<tripleExpressionList2Plus> ;
  sx:semActs @<SemActList1Plus>? ;
  sx:annotation @<Annotation>*
}

<tripleExpressionList2Plus> CLOSED {
  rdf:first @<tripleExpression> ;
  rdf:rest @<tripleExpressionList1Plus>
}
<tripleExpressionList1Plus> CLOSED {
  rdf:first @<tripleExpression> ;
  rdf:rest  [rdf:nil] OR @<tripleExpressionList1Plus>
}

<TripleConstraint> CLOSED {
  a [sx:TripleConstraint] ;
  sx:inverse [true false]? ;
  sx:negated [true false]? ;
  sx:min xsd:integer? ;
  sx:max xsd:integer? ;
  sx:predicate IRI ;
  sx:valueExpr @<shapeExpr>? ;
  sx:semActs @<SemActList1Plus>? ;
  sx:annotation @<Annotation>*
}

<SemActList1Plus> CLOSED {
  rdf:first @<SemAct> ;
  rdf:rest  [rdf:nil] OR @<SemActList1Plus>
}

<shapeExprList2Plus> CLOSED {
  rdf:first @<shapeExpr> ;
  rdf:rest  @<shapeExprList1Plus>
}
<shapeExprList1Plus> CLOSED {
  rdf:first @<shapeExpr> ;
  rdf:rest  [rdf:nil] OR @<shapeExprList1Plus>
}

<valueSetValueList1Plus> CLOSED {
  rdf:first @<valueSetValue> ;
  rdf:rest  [rdf:nil] OR @<valueSetValueList1Plus>
}`;

prepareControls();
prepareInterface();
prepareDragAndDrop();
prepareDemos();

