Demos = (() => {
var wikidataItem = {};

wikidataItem.schema = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX pr: <http://www.wikidata.org/prop/reference/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>

start = @<wikidata_item>

<wikidata_item> {
  p:P1748 {
    ps:P1748 LITERAL ;
    prov:wasDerivedFrom @<reference>
  }+
}

<reference> {
  pr:P248  IRI ;
  pr:P813  xsd:dateTime ;
  pr:P699  LITERAL
}
`;

wikidataItem.cats = `
Endpoint: https://query.wikidata.org/bigdata/namespace/wdq/sparql

Query: SELECT ?item ?itemLabel
WHERE
{ ?item wdt:P279* wd:Q12078 .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
} LIMIT 10
`;

  return {
    "Each Wikidata item on Cancer should have a NCI Thesaurus ID": {
      schema: wikidataItem.schema,
      passes: {
        "Get all Wikidata items on Cancers (SPARQL)": {
          data: wikidataItem.cats,
          queryMap: "SPARQL `SELECT ?item ?itemLabel "+
            "WHERE "+
            "{ ?item wdt:P279* wd:Q12078 . "+
            "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\" } "+
            "} LIMIT 10`@- start -"}
      },
      fails: {
      }
    },
    "ShEx to validate a wikidata a": {
          schema: wikidataItem.schema,
          passes: {
            "Get all Wikidata items on Cancers (SPARQL)": {
              data: wikidataItem.cats,
              queryMap: "SPARQL `SELECT ?item ?itemLabel "+
                "WHERE "+
                "{ ?item wdt:P279* wd:Q12078 . "+
                "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\" } "+
                "} LIMIT 10`@- start -"}
          },
          fails: {
          }
        },
  };
})();
