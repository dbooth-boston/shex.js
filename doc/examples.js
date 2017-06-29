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

FAIRcatalog.success = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
                       @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
                       @prefix dcat: <http://www.w3.org/ns/dcat#> .
                       @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
                       @prefix owl: <http://www.w3.org/2002/07/owl#> .
                       @prefix dcterms: <http://purl.org/dc/terms/> .
                       @prefix fdp: <http://rdf.biosemantics.org/ontologies/fdp-o#> .
                       @prefix r3d: <http://www.re3data.org/schema/3-0#> .
                       @prefix lang: <http://id.loc.gov/vocabulary/iso639-1/> .

                       <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank> dcterms:title "Rd connect's patient biobank catalog" ;
                       	rdfs:label "Rd connect's patient biobank catalog" ;
                       	dcterms:hasVersion "1.0" ;
                       	fdp:metadataIssued "2017-06-28T12:12:13.918Z"^^xsd:dateTime ;
                       	fdp:metadataIdentifier <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank/metadataID> .

                       <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank/metadataID> a <http://purl.org/spar/datacite/Identifier> ;
                       	dcterms:identifier "biobank" .

                       <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank> fdp:metadataModified "2017-06-28T12:12:13.919Z"^^xsd:dateTime ;
                       	dcterms:language lang:en ;
                       	dcterms:publisher <http://biosemantics.humgen.nl> .

                       <http://biosemantics.humgen.nl> a <http://xmlns.com/foaf/0.1/Organization> ;
                       	<http://xmlns.com/foaf/0.1/name> "Biosemantics LUMC" .

                       <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank> dcterms:license <http://rdflicense.appspot.com/rdflicense/cc-by-nc-nd3.> ;
                       	dcterms:isPartOf <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> ;
                       	dcterms:conformsTo <http://rdf.biosemantics.org/fdp/shex/catalogMetadata> ;
                       	a dcat:Catalog ;
                       	dcterms:modified "2017-06-28T12:12:14.217Z"^^xsd:dateTime ;
                       	dcat:themeTaxonomy <http://dbpedia.org/resource/Biobank> , <http://edamontology.org/topic_3337> ;
                       	dcat:dataset <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/76957-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/44001-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/87919-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/168562-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/45401-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/77761-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/168694-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/77219-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/88051-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/173631-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/45274-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/62316-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/77489-collection1> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/77088-collection1> .`

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

FAIRdataset.success = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
                       @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
                       @prefix dcat: <http://www.w3.org/ns/dcat#> .
                       @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
                       @prefix owl: <http://www.w3.org/2002/07/owl#> .
                       @prefix dcterms: <http://purl.org/dc/terms/> .
                       @prefix fdp: <http://rdf.biosemantics.org/ontologies/fdp-o#> .
                       @prefix r3d: <http://www.re3data.org/schema/3-0#> .
                       @prefix lang: <http://id.loc.gov/vocabulary/iso639-1/> .

                       <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/76957-collection1> dcterms:title "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge" ;
                       	rdfs:label "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge" ;
                       	dcterms:hasVersion "1.0" ;
                       	fdp:metadataIssued "2017-06-28T12:12:13.952Z"^^xsd:dateTime ;
                       	fdp:metadataIdentifier <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/biobank/76957-collection1/metadataID> .

                       <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/biobank/76957-collection1/metadataID> a <http://purl.org/spar/datacite/Identifier> ;
                       	dcterms:identifier "76957-collection1" .

                       <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/76957-collection1> fdp:metadataModified "2017-06-28T12:12:13.952Z"^^xsd:dateTime ;
                       	dcterms:language lang:en ;
                       	dcterms:publisher <http://example.com/BASE_URI/organization/76957> .

                       <http://example.com/BASE_URI/organization/76957> a <http://xmlns.com/foaf/0.1/Organization> ;
                       	<http://xmlns.com/foaf/0.1/name> "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge" .

                       <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/76957-collection1> dcterms:license <http://rdflicense.appspot.com/rdflicense/cc-by-nc-nd3.> ;
                       	dcterms:isPartOf <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank> ;
                       	dcterms:conformsTo <http://rdf.biosemantics.org/fdp/shex/datasetMetadata> ;
                       	a dcat:Dataset ;
                       	dcat:landingPage <http://catalogue.rd-connect.eu/web/bank-for-the-diagnosis-and-research-on-neuromuscular-disorders-nhmgb-cardiomyology-and-medical-ge/bb_home> ;
                       	dcterms:issued "Wed Apr 01 10:16:18 GMT 2015"^^xsd:dateTime ;
                       	dcterms:modified "2017-06-28T12:12:22.644Z"^^xsd:dateTime ;
                       	dcat:theme <http://dbpedia.org/resource/Biobank> , <http://edamontology.org/topic_3337> , <http://www.orpha.net/ORDO/Orphanet_100985> , <http://www.orpha.net/ORDO/Orphanet_119> , <http://www.orpha.net/ORDO/Orphanet_130> , <http://www.orpha.net/ORDO/Orphanet_154> , <http://www.orpha.net/ORDO/Orphanet_155> , <http://www.orpha.net/ORDO/Orphanet_157> , <http://www.orpha.net/ORDO/Orphanet_1878> , <http://www.orpha.net/ORDO/Orphanet_1984> , <http://www.orpha.net/ORDO/Orphanet_2053> , <http://www.orpha.net/ORDO/Orphanet_206549> , <http://www.orpha.net/ORDO/Orphanet_206559> , <http://www.orpha.net/ORDO/Orphanet_206953> , <http://www.orpha.net/ORDO/Orphanet_219> , <http://www.orpha.net/ORDO/Orphanet_2593> , <http://www.orpha.net/ORDO/Orphanet_261> , <http://www.orpha.net/ORDO/Orphanet_263> , <http://www.orpha.net/ORDO/Orphanet_264> , <http://www.orpha.net/ORDO/Orphanet_265> , <http://www.orpha.net/ORDO/Orphanet_267> , <http://www.orpha.net/ORDO/Orphanet_268> , <http://www.orpha.net/ORDO/Orphanet_269> , <http://www.orpha.net/ORDO/Orphanet_273> , <http://www.orpha.net/ORDO/Orphanet_285> , <http://www.orpha.net/ORDO/Orphanet_33276> , <http://www.orpha.net/ORDO/Orphanet_34515> , <http://www.orpha.net/ORDO/Orphanet_353> , <http://www.orpha.net/ORDO/Orphanet_365> , <http://www.orpha.net/ORDO/Orphanet_366> , <http://www.orpha.net/ORDO/Orphanet_423> , <http://www.orpha.net/ORDO/Orphanet_481> , <http://www.orpha.net/ORDO/Orphanet_510> , <http://www.orpha.net/ORDO/Orphanet_596> , <http://www.orpha.net/ORDO/Orphanet_610> , <http://www.orpha.net/ORDO/Orphanet_614> , <http://www.orpha.net/ORDO/Orphanet_62> , <http://www.orpha.net/ORDO/Orphanet_64746> , <http://www.orpha.net/ORDO/Orphanet_663> , <http://www.orpha.net/ORDO/Orphanet_681> , <http://www.orpha.net/ORDO/Orphanet_730> , <http://www.orpha.net/ORDO/Orphanet_732> , <http://www.orpha.net/ORDO/Orphanet_75840> , <http://www.orpha.net/ORDO/Orphanet_803> , <http://www.orpha.net/ORDO/Orphanet_83419> , <http://www.orpha.net/ORDO/Orphanet_95> , <http://www.orpha.net/ORDO/Orphanet_98895> , <http://www.orpha.net/ORDO/Orphanet_98896> , <http://www.orpha.net/ORDO/Orphanet_98909> , <http://www.orpha.net/ORDO/Orphanet_99> ;
                       	dcat:keyword "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge" , "biobank" ;
                       	dcat:distribution <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html> .`

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

FAIRdistribution.success = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
                            @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
                            @prefix dcat: <http://www.w3.org/ns/dcat#> .
                            @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
                            @prefix owl: <http://www.w3.org/2002/07/owl#> .
                            @prefix dcterms: <http://purl.org/dc/terms/> .
                            @prefix fdp: <http://rdf.biosemantics.org/ontologies/fdp-o#> .
                            @prefix r3d: <http://www.re3data.org/schema/3-0#> .
                            @prefix lang: <http://id.loc.gov/vocabulary/iso639-1/> .

                            <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html> dcterms:title "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge html distribution" ;
                            	rdfs:label "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge html distribution" ;
                            	dcterms:hasVersion "1.0" ;
                            	fdp:metadataIssued "2017-06-28T12:12:22.644Z"^^xsd:dateTime ;
                            	fdp:metadataIdentifier <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distibution/76957-collection1_html/metadataID> .

                            <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distibution/76957-collection1_html/metadataID> a <http://purl.org/spar/datacite/Identifier> ;
                            	dcterms:identifier "76957-collection1-html" .

                            <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html> fdp:metadataModified "2017-06-28T12:12:22.644Z"^^xsd:dateTime ;
                            	dcterms:language lang:en ;
                            	dcterms:publisher <http://example.com/BASE_URI/organization/76957> .

                            <http://example.com/BASE_URI/organization/76957> a <http://xmlns.com/foaf/0.1/Organization> ;
                            	<http://xmlns.com/foaf/0.1/name> "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge" .

                            <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html> dcterms:license <http://rdflicense.appspot.com/rdflicense/cc-by-nc-nd3.> ;
                            	dcterms:isPartOf <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/76957-collection1> ;
                            	dcterms:conformsTo <http://rdf.biosemantics.org/fdp/shex/distributionMetadata> ;
                            	a dcat:Distribution ;
                            	dcat:accessURL <http://www.unina2.it/> ;
                            	dcterms:issued "2017-06-28T12:12:22.644Z"^^xsd:dateTime ;
                            	dcterms:modified "2017-06-28T12:12:22.644Z"^^xsd:dateTime ;
                            	dcat:mediaType "text/html" .`

FAIRdistribution.fail = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
                            @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
                            @prefix dcat: <http://www.w3.org/ns/dcat#> .
                            @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
                            @prefix owl: <http://www.w3.org/2002/07/owl#> .
                            @prefix dcterms: <http://purl.org/dc/terms/> .
                            @prefix fdp: <http://rdf.biosemantics.org/ontologies/fdp-o#> .
                            @prefix r3d: <http://www.re3data.org/schema/3-0#> .
                            @prefix lang: <http://id.loc.gov/vocabulary/iso639-1/> .

                            <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html> dcterms:title "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge html distribution" ;
                            	rdfs:label "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge html distribution" ;
                            	dcterms:hasVersion "1.0" ;
                            	fdp:metadataIssued "2017-06-28T12:12:22.644Z"^^xsd:dateTime ;
                            	fdp:metadataIdentifier <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distibution/76957-collection1_html/metadataID> .

                            <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distibution/76957-collection1_html/metadataID> a <http://purl.org/spar/datacite/Identifier> ;
                            	dcterms:identifier "76957-collection1-html" .

                            <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html> fdp:metadataModified "2017-06-28T12:12:22.644Z"^^xsd:dateTime ;
                            	dcterms:language lang:en ;
                            	dcterms:publisher <http://example.com/BASE_URI/organization/76957> .

                            <http://example.com/BASE_URI/organization/76957> a <http://xmlns.com/foaf/0.1/Organization> ;
                            	<http://xmlns.com/foaf/0.1/name> "Bank for the Diagnosis and Research on Neuromuscular Disorders (NHMGB), Cardiomyology and Medical Ge" .

                            <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html> dcterms:license <http://rdflicense.appspot.com/rdflicense/cc-by-nc-nd3.> ;
                            	dcterms:isPartOf <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/76957-collection1> ;
                            	dcterms:conformsTo <http://rdf.biosemantics.org/fdp/shex/distributionMetadata> ;
                            	a dcat:Distribution ;
                            	dcat:accessURL <http://www.unina2.it/> ;
                            	dcterms:issued "Wed Apr 01 10:16:18 GMT 2015"^^xsd:dateTime ;
                            	dcterms:modified "Tue May 17 08:57:02 GMT 2016"^^xsd:dateTime ;
                            	dcat:mediaType "text/html" .`

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

FAIRFDP.success = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
                   @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
                   @prefix dcat: <http://www.w3.org/ns/dcat#> .
                   @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
                   @prefix owl: <http://www.w3.org/2002/07/owl#> .
                   @prefix dcterms: <http://purl.org/dc/terms/> .
                   @prefix fdp: <http://rdf.biosemantics.org/ontologies/fdp-o#> .
                   @prefix r3d: <http://www.re3data.org/schema/3-0#> .
                   @prefix lang: <http://id.loc.gov/vocabulary/iso639-1/> .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> dcterms:title "FDP of demonstrator.fair-dtls.surf-hosted.nl:8080" ;
                   	rdfs:label "FDP of demonstrator.fair-dtls.surf-hosted.nl:8080" ;
                   	dcterms:hasVersion "1.0" ;
                   	fdp:metadataIssued "2017-06-28T12:11:31.112Z"^^xsd:dateTime ;
                   	fdp:metadataIdentifier <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp#metadataID> .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp#metadataID> a <http://purl.org/spar/datacite/ResourceIdentifier> ;
                   	dcterms:identifier "b7362803-31eb-48e2-95b2-b641f978d402" .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> fdp:metadataModified "2017-06-28T12:11:31.116Z"^^xsd:dateTime ;
                   	dcterms:language lang:en ;
                   	dcterms:publisher <http://dtls.nl> .

                   <http://dtls.nl> a <http://xmlns.com/foaf/0.1/Organization> ;
                   	<http://xmlns.com/foaf/0.1/name> "DTLS" .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> dcterms:description "FDP of demonstrator.fair-dtls.surf-hosted.nl:8080" ;
                   	dcterms:license <http://rdflicense.appspot.com/rdflicense/cc-by-nc-nd3.0> ;
                   	dcterms:conformsTo <http://rdf.biosemantics.org/fdp/shex/fdpMetadata> ;
                   	a r3d:Repository ;
                   	rdfs:seeAlso <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/swagger-ui.html> ;
                   	r3d:repositoryIdentifier <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp#repositoryID> .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp#repositoryID> a <http://purl.org/spar/datacite/Identifier> ;
                   	dcterms:identifier "761def42-543f-4aeb-a442-43531ca31bfd" .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> r3d:institutionCountry <http://lexvo.org/id/iso3166/NL> ;
                   	r3d:dataCatalog <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/registry> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank> .

`

FAIRFDP.fail = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
                   @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
                   @prefix dcat: <http://www.w3.org/ns/dcat#> .
                   @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
                   @prefix owl: <http://www.w3.org/2002/07/owl#> .
                   @prefix dcterms: <http://purl.org/dc/terms/> .
                   @prefix fdp: <http://rdf.biosemantics.org/ontologies/fdp-o#> .
                   @prefix r3d: <http://www.re3data.org/schema/3-0#> .
                   @prefix lang: <http://id.loc.gov/vocabulary/iso639-1/> .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> dcterms:title "FDP of demonstrator.fair-dtls.surf-hosted.nl:8080" ;
                   	rdfs:label "FDP of demonstrator.fair-dtls.surf-hosted.nl:8080" ;
                   	dcterms:hasVersion "1.0" ;
                   	fdp:metadataIssued "2017-06-28T12:11:31.112Z"^^xsd:dateTime .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp#metadataID> a <http://purl.org/spar/datacite/ResourceIdentifier> ;
                   	dcterms:identifier "b7362803-31eb-48e2-95b2-b641f978d402" .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> fdp:metadataModified "2017-06-28T12:11:31.116Z"^^xsd:dateTime ;
                   	dcterms:language lang:en ;
                   	dcterms:publisher <http://dtls.nl> .

                   <http://dtls.nl> a <http://xmlns.com/foaf/0.1/Organization> ;
                   	<http://xmlns.com/foaf/0.1/name> "DTLS" .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> dcterms:description "FDP of demonstrator.fair-dtls.surf-hosted.nl:8080" ;
                   	dcterms:license <http://rdflicense.appspot.com/rdflicense/cc-by-nc-nd3.0> ;
                   	dcterms:conformsTo <http://rdf.biosemantics.org/fdp/shex/fdpMetadata> ;
                   	a r3d:Repository ;
                   	rdfs:seeAlso <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/swagger-ui.html> ;
                   	r3d:repositoryIdentifier <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp#repositoryID> .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp#repositoryID> a <http://purl.org/spar/datacite/Identifier> ;
                   	dcterms:identifier "761def42-543f-4aeb-a442-43531ca31bfd" .

                   <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp> r3d:institutionCountry <http://lexvo.org/id/iso3166/NL> ;
                   	r3d:dataCatalog <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/registry> , <http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank> .

`

return {
      "FAIR FDP": {
             schema: FAIRFDP.schema,
             passes: {"Correct data on a FAIR Data Point": {
                        data: FAIRFDP.success,
                        queryMap: "<http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp>@:fdpMetadata"
                        }

             },
             fails: {"Missing metadataIdentifier": {
                    data: FAIRFDP.fail,
                    queryMap: "<http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp>@:fdpMetadata"
                    }

             }

      },
      "FAIR catalog": {
           schema: FAIRcatalog.schema,
           passes: {"Correct catalog (biobank)": {
               data: FAIRcatalog.success,
               queryMap: "<http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/catalog/biobank>@:catalogMetadata",
           }
         }
      },
    "FAIR dataset": {
               schema: FAIRdataset.schema,
               passes: {"Correct dataset": {
                    data: FAIRdataset.success,
                    queryMap: "<http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/dataset/76957-collection1>@:datasetMetadata"
               }
        },
    },
        "FAIR distribution": {
               schema: FAIRdistribution.schema,
               passes: {"Correct distributioon": {
                     data: FAIRdistribution.success,
                     queryMap: "<http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html>@:distributionMetadata"},
               },
               fails: {"Incorrect data format": {
                    data: FAIRdistribution.fail,
                    queryMap: "<http://demonstrator.fair-dtls.surf-hosted.nl:8080/fdp/distribution/76957-collection1-html>@:distributionMetadata"},
        },
    },




    };
})();
