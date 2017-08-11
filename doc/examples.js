Demos = (() => {
var wikicite_paper = {};
var wikicite_proceedings = {};
var wikicite_book = {};

wikicite_paper.schema = ``;
wikicite_paper.success = `Endpoint: https://query.wikidata.org/bigdata/namespace/wdq/sparql
                          Query: SELECT ?item ?itemLabel WHERE {
                                   ?item wdt:P698 ?pmid .
                                   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                                 }
                                 LIMIT 10`;
wikicite_paper.fail = ``;

wikicite_proceedings.schema = ``;
wikicite_proceedings.success = ``;
wikicite_proceedings.fail = ``;

wikicite_book.schema = ``;
wikicite_book.success = ``;
wikicite_book.fail = ``;

  return {
    "Biomedical scientific article": {
      schema: wikicite_paper.schema,
      passes: {
        "with birthdate": {
          data: wikicite_paper.success,
          queryMap: "{FOCUS :status _}@- start -,\n<Patient2>@<http://a.example/ObservationShape>"},
        "without birthdate": {
          data: wikicite_paper.success,
          queryMap: "<http://a.example/Obs1>@- start -"},
        "no subject name": {
          data: wikicite_paper.success,
          queryMap: "<http://a.example/Obs1>@- start -"}
      },
      fails: {
        "bad status": {
          data: wikicite_paper.success,
          queryMap: "<http://a.example/Obs1>@- start -"},
        "no subject": {
          data: wikicite_paper.success,
          queryMap: "<http://a.example/Obs1>@- start -"},
        "wrong birthdate datatype": {
          data: wikicite_paper.success,
          queryMap: "<http://a.example/Obs1>@- start -"}
      }
    },
    "Proceedings": {
          schema: wikicite_proceedings.schema,
          passes: {
            "with birthdate": {
              data: ``,
              queryMap: "{FOCUS :status _}@- start -,\n<Patient2>@<http://a.example/ObservationShape>"},
            "without birthdate": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"},
            "no subject name": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"}
          },
          fails: {
            "bad status": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"},
            "no subject": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"},
            "wrong birthdate datatype": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"}
          }
    },
    "English book": {
          schema: wikicite_book.schema,
          passes: {
            "with birthdate": {
              data: ``,
              queryMap: "{FOCUS :status _}@- start -,\n<Patient2>@<http://a.example/ObservationShape>"},
            "without birthdate": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"},
            "no subject name": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"}
          },
          fails: {
            "bad status": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"},
            "no subject": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"},
            "wrong birthdate datatype": {
              data: ``,
              queryMap: "<http://a.example/Obs1>@- start -"}
          }
    }
  };
})();
