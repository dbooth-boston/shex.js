Demos = (() => {
var wikicite_paper = {};
var wikicite_proceedings = {};
var wikicite_book = {};

wikicite_paper.schema = ``;
wikicite_paper.success = ``;
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
          data: clinicalObs.with_birthdate,
          queryMap: "{FOCUS :status _}@- start -,\n<Patient2>@<http://a.example/ObservationShape>"},
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
    "Proceedings": {
          schema: wikicite_proceedings.schema,
          passes: {
            "with birthdate": {
              data: clinicalObs.with_birthdate,
              queryMap: "{FOCUS :status _}@- start -,\n<Patient2>@<http://a.example/ObservationShape>"},
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
    "English book": {
          schema: wikicite_book.schema,
          passes: {
            "with birthdate": {
              data: clinicalObs.with_birthdate,
              queryMap: "{FOCUS :status _}@- start -,\n<Patient2>@<http://a.example/ObservationShape>"},
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
})();
