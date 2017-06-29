Demos = (() => {
var FAIRcatalog = {}
var FAIRdataset = {}
var FAIRdistribution = {}
var FAIRFDP = {};


//##########################
//#
//# FAIRcatolog
//#
//##########################


FAIRcatalog.schema = `PREFIX : <http://shex.fairdata.solutions/>
                      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                      PREFIX dcat: <http://www.w3.org/ns/dcat#>
                      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                      PREFIX owl: <http://www.w3.org/2002/07/owl#>
                      PREFIX dcterms: <http://purl.org/dc/terms/>
                      PREFIX fdp-o: <http://rdf.biosemantics.org/ontologies/fdp-o#>
                      PREFIX r3d: <http://www.re3data.org/schema/3-0#>
                      PREFIX lang: <http://id.loc.gov/vocabulary/iso639-1/>
                      PREFIX foaf: <http://xmlns.com/foaf/0.1/>


                      :catalogMetadata IRI {
                        a [dcat:Catalog];
                        dcterms:title	xsd:string;
                        dcterms:isPartOf IRI*;
                        dcterms:description xsd:string*;
                        rdfs:label xsd:string*;
                        dcterms:hasVersion xsd:string;
                        fdp-o:metadataIssued xsd:dateTime;
                        fdp-o:metadataModified xsd:dateTime;
                        dcterms:issued xsd:dateTime*;
                        dcterms:language IRI*;
                        dcterms:conformsTo IRI*;
                        dcterms:publisher @:agent+;
                        dcterms:rights IRI*;
                        foaf:homepage IRI*;
                        dcat:themeTaxonomy IRI+;
                        dcterms:modified xsd:dateTime*;
                        dcterms:license IRI*;
                        dcat:dataset IRI*;
                        fdp-o:metadataIdentifier @:metadataID
                      }

                      :metadataID IRI {
                        dcterms:identifier xsd:string

                      }

                      :agent IRI {
                        a IRI;
                        foaf:name xsd:string*
                      }`

//##########################
//#
//# FAIR dataset
//#
//##########################

FAIRdataset.schema = `PREFIX : <http://shex.fairdata.solutions/>
                      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                      PREFIX dcat: <http://www.w3.org/ns/dcat#>
                      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                      PREFIX owl: <http://www.w3.org/2002/07/owl#>
                      PREFIX dcterms: <http://purl.org/dc/terms/>
                      PREFIX fdp-o: <http://rdf.biosemantics.org/ontologies/fdp-o#>
                      PREFIX r3d: <http://www.re3data.org/schema/3-0#>
                      PREFIX lang: <http://id.loc.gov/vocabulary/iso639-1/>
                      PREFIX foaf: <http://xmlns.com/foaf/0.1/>


                      :datasetMetadata IRI {
                        a [dcat:Dataset];
                        dcterms:title	xsd:string;
                        dcterms:description xsd:string*;
                        dcterms:isPartOf IRI*;
                        rdfs:label xsd:string*;
                        dcterms:hasVersion xsd:string;
                        fdp-o:metadataIssued xsd:dateTime;
                        fdp-o:metadataModified xsd:dateTime;
                        dcterms:issued xsd:dateTime*;
                        dcterms:language IRI*;
                        dcterms:conformsTo IRI*;
                        dcterms:publisher @:agent+;
                        dcterms:rights IRI*;
                        dcat:landingPage IRI*;
                        dcat:theme IRI+;
                        dcat:keyword xsd:string*;
                        dcterms:modified xsd:dateTime*;
                        dcterms:license IRI*;
                        dcat:distribution IRI*;
                        fdp-o:metadataIdentifier @:metadataID
                      }

                      :metadataID IRI {
                        dcterms:identifier xsd:string

                      }

                      :agent IRI {
                        a IRI;
                        foaf:name xsd:string*
                      }`


//##########################
//#
//# FAIR distribution
//#
//##########################

FAIRdistribution.schema = `PREFIX : <http://shex.fairdata.solutions/>
                           PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                           PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                           PREFIX dcat: <http://www.w3.org/ns/dcat#>
                           PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                           PREFIX owl: <http://www.w3.org/2002/07/owl#>
                           PREFIX dcterms: <http://purl.org/dc/terms/>
                           PREFIX fdp-o: <http://rdf.biosemantics.org/ontologies/fdp-o#>
                           PREFIX r3d: <http://www.re3data.org/schema/3-0#>
                           PREFIX lang: <http://id.loc.gov/vocabulary/iso639-1/>


                           :distributionMetadata IRI {
                             a [dcat:Distribution];
                             dcterms:title	xsd:string;
                             dcterms:language IRI*;
                             dcterms:description xsd:string*;
                             dcterms:isPartOf IRI*;
                             rdfs:label xsd:string*;
                             dcterms:hasVersion xsd:string;
                             fdp-o:metadataIssued xsd:dateTime;
                             fdp-o:metadataModified xsd:dateTime;
                             dcterms:issued xsd:dateTime*;
                             dcat:mediaType xsd:string+;
                             dcat:format xsd:string*;
                             dcat:byteSize xsd:decimal*;
                             dcterms:modified xsd:dateTime*;
                             dcterms:rights IRI*;
                             dcterms:conformsTo IRI*;
                             dcterms:license IRI;
                             (dcat:downloadURL IRI | dcat:accessURL IRI);
                             fdp-o:metadataIdentifier @:metadataID
                           }

                           :metadataID IRI {
                             dcterms:identifier xsd:string

                           }`


//##########################
//#
//# FAIR FDP
//#
//##########################

FAIRFDP.schema = `PREFIX : <http://shex.fairdata.solutions/>
                  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                  PREFIX dcat: <http://www.w3.org/ns/dcat#>
                  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                  PREFIX owl: <http://www.w3.org/2002/07/owl#>
                  PREFIX dcterms: <http://purl.org/dc/terms/>
                  PREFIX fdp-o: <http://rdf.biosemantics.org/ontologies/fdp-o#>
                  PREFIX r3d: <http://www.re3data.org/schema/3-0#>
                  PREFIX lang: <http://id.loc.gov/vocabulary/iso639-1/>
                  PREFIX foaf: <http://xmlns.com/foaf/0.1/>


                  :fdpMetadata IRI {
                    a [r3d:Repository];
                    dcterms:title	xsd:string;
                    dcterms:isPartOf IRI*;
                    dcterms:description xsd:string*;
                    rdfs:label xsd:string*;
                    dcterms:hasVersion xsd:string;
                    fdp-o:metadataIssued xsd:dateTime;
                    fdp-o:metadataModified xsd:dateTime;
                    dcterms:issued xsd:dateTime*;
                    dcterms:language IRI*;
                    dcterms:publisher @:agent+;
                    dcterms:rights IRI*;
                    foaf:homepage IRI*;
                    dcterms:modified xsd:dateTime*;
                    dcterms:license IRI*;
                    dcterms:alternative xsd:string*;
                    dcterms:conformsTo IRI*;
                    r3d:dataCatalog IRI*;
                    r3d:institution IRI*;
                    r3d:repositoryContact @:agent*;
                    r3d:repositoryType IRI*;
                    r3d:startDate  xsd:dateTime*;
                    r3d:repositoryLanguage IRI*;
                    r3d:api IRI*;
                    r3d:certificate IRI*;
                    rdfs:seeAlso IRI*;
                    fdp-o:metadataIdentifier @:metadataID;
                    r3d:repositoryIdentifier @:repositoryID
                  }

                  :metadataID IRI {
                    dcterms:identifier xsd:string

                  }

                  :repositoryID IRI {
                    dcterms:identifier xsd:string

                  }

                  :agent IRI {
                    a IRI;
                    foaf:name xsd:string*
                  }`



return {
      "FAIR FDP": {
             schema: FAIRFDP.schema,
      },
      "FAIR catalog": {
                   schema: FAIRcatalog.schema,
            },
      "FAIR dataset": {
             schema: FAIRdataset.schema,
      },
      "FAIR distribution": {
             schema: FAIRdistribution.schema,
      },





    };
})();
