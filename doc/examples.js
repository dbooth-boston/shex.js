Demos = (() => {
var wikidataItem = {};
var wikidataHumanGeneItem = {}

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

wikidataItem.sparql = `
Endpoint: https://query.wikidata.org/bigdata/namespace/wdq/sparql

Query: SELECT ?item ?itemLabel
WHERE
{ ?item wdt:P279* wd:Q12078 .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
} LIMIT 10
`;

wikidataHumanGeneItem.schema = `# Shape Expression for Human genes in Wikidata
                                PREFIX wd: <http://www.wikidata.org/entity/>
                                PREFIX wdt: <http://www.wikidata.org/prop/direct/>
                                PREFIX p: <http://www.wikidata.org/prop/>
                                PREFIX prov: <http://www.w3.org/ns/prov#>
                                PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
                                PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                                PREFIX prv: <http://www.wikidata.org/prop/reference/value/>
                                PREFIX pr:  <http://www.wikidata.org/prop/reference/>
                                PREFIX ps: <http://www.wikidata.org/prop/statement/>

                                start = @<wikidata-human_gene>

                                <wikidata-human_gene> {
                                    # STATEMENTS
                                	p:P31 @<P31_instance_of_gene> ;
                                    p:P279 @<P279_subclass_of_gene>+ ;
                                	(
                                		p:P644 @<P644_genomic_start>+ ;
                                		p:P645 @<P645_genomic_end>+ ;
                                	)* ;
                                	p:P684 @<P684_ortholog>* ;
                                	p:P688 @<P688_encodes>* ;
                                	p:P703 @<P703_found_in_taxon_human>{1} ;
                                	p:P1057 @<P1057_chromosome>* ;
                                	p:P2888 @<P2888_exact_match>+ ;
                                	p:P2548 @<P2548_strand_orientation> ;

                                	#IDENTIFIERS
                                	p:P351 @<P351_ncbi_gene_id> ;
                                	p:P353 @<P353_hgnc_gene_symbol>* ;
                                	p:P354 @<P354_hgnc_gene_id>* ;
                                	p:P594 @<P594_ensembl_gene_id>* ;
                                	p:P639 @<P639_refseq_rna_id>* ;
                                	p:P704 @<P704_ensembl_transcript_id>* ;
                                	p:P593 @<P593_homologene_id>* ;

                                	# Negative shapes
                                	p:P352 @<P352_uniprot_id_wor>{0} ;
                                }

                                # Shape expressions for Wikidata statements
                                <P31_instance_of_gene> {
                                    ps:P31 [wd:Q7187] ;
                                	prov:wasDerivedFrom @<ncbi-gene-reference> OR @<ensembl-gene-reference> ;
                                }
                                <P279_subclass_of_gene> {
                                    ps:P279 @<gene_types> ;
                                	prov:wasDerivedFrom @<ncbi-gene-reference> OR @<ensembl-gene-reference> ;
                                }

                                <P644_genomic_start> {
                                   ps:P644 LITERAL ;
                                   pq:P1057	@<human-chromosomes>+ ;
                                   pq:P659	@<genomic-assembly>+ ;
                                   prov:wasDerivedFrom @<ensembl-gene-reference>+ ;
                                }

                                <P645_genomic_end> {
                                   ps:P645 LITERAL ;
                                   pq:P1057	@<human-chromosomes>+ ;
                                   pq:P659	@<genomic-assembly>+ ;
                                   prov:wasDerivedFrom @<ensembl-gene-reference>+ ;
                                }

                                <P684_ortholog> {
                                   ps:P684 IRI ;
                                   pq:P703	IRI ;
                                   prov:wasDerivedFrom	@<homologene-reference>+ ;
                                }

                                <P688_encodes> {
                                   ps:P688 IRI ; # TODO: Once the human proteina shape is finished this should change to @<human_protein>
                                   prov:wasDerivedFrom @<uniprot-reference>+;
                                }

                                <P703_found_in_taxon_human> {
                                     ps:P703 [wd:Q15978631] ;
                                	 prov:wasDerivedFrom @<ensembl-gene-reference>+
                                }

                                <P1057_chromosome> {
                                   ps:P1057 @<human-chromosomes> ;
                                   pq:P659	@<genomic-assembly>+ ;
                                   prov:wasDerivedFrom @<ensembl-gene-reference>+ ;
                                }

                                <P2888_exact_match> {
                                		ps:P2888 IRI ;
                                		prov:wasDerivedFrom @<miriam_reference> OR @<ncbi-gene-reference> ;
                                }

                                <P2548_strand_orientation> {
                                   ps:P2548	@<strand-orientation> ;
                                   pq:P659		@<genomic-assembly>+ ;
                                   prov:wasDerivedFrom @<ensembl-gene-reference>+ ;
                                }

                                ## IDENTIFIERS
                                <P351_ncbi_gene_id> {
                                	ps:P351 LITERAL ;
                                	prov:wasDerivedFrom @<ncbi-gene-reference>+ ;
                                }

                                <P352_uniprot_id_wor> {
                                    ps:P352 LITERAL ;
                                }

                                <P353_hgnc_gene_symbol> {
                                   ps:P353 LITERAL ;
                                   prov:wasDerivedFrom @<ncbi-gene-reference>+ ;
                                }

                                <P354_hgnc_gene_id> {
                                   ps:P354 LITERAL ;
                                   prov:wasDerivedFrom @<ncbi-gene-reference>+ ;
                                }

                                <P593_homologene_id> {
                                   ps:P593 LITERAL ;
                                   prov:wasDerivedFrom @<ncbi-gene-reference>+ ;
                                }

                                <P594_ensembl_gene_id> {
                                   ps:P594 LITERAL ;
                                   prov:wasDerivedFrom @<ensembl-gene-reference>+
                                }

                                <P639_refseq_rna_id> {
                                   ps:P639 LITERAL ;
                                   prov:wasDerivedFrom @<ncbi-gene-reference>+ ;
                                }

                                <P704_ensembl_transcript_id> {
                                   ps:P704 LITERAL ;
                                   prov:wasDerivedFrom @<ensembl-gene-reference> OR <ncbi-gene-reference>+ ;
                                }

                                ## REFERENCES
                                <ncbi-gene-reference> {
                                      pr:P248	[wd:Q20641742
                                	         wd:Q20950174
                                		 wd:Q29458763 ] ;
                                	  pr:P351	LITERAL ;
                                	  pr:P813	xsd:dateTime ;
                                	  prv:P813	IRI ;
                                }

                                <ensembl-gene-reference> {
                                      pr:P248	[wd:Q27975061
                                	             wd:Q30227110
                                	             wd:Q29458763 ] ;
                                	  pr:P594	LITERAL ;
                                }

                                <homologene-reference> {
                                	pr:P248 IRI;
                                	pr:P593 LITERAL;
                                }

                                <miriam_reference> {
                                  pr:P248		[wd:Q16335166] ;
                                  pr:P854		IRI ;
                                }

                                <gene_types> [
                                				wd:Q7187
                                				wd:Q20747295
                                			 ]

                                <human-chromosomes> [
                                				wd:Q430258  # human chromosome 1
                                				wd:Q638893  # human chromosome 2
                                				wd:Q668633  # human chromosome 3
                                				wd:Q836605  # human chromosome 4
                                				wd:Q840741  # human chromosome 5
                                				wd:Q540857  # human chromosome 6
                                				wd:Q657319  # human chromosome 7
                                				wd:Q572848  # human chromosome 8
                                				wd:Q840604  # human chromosome 9
                                				wd:Q840737  # human chromosome 10
                                				wd:Q847096  # human chromosome 11
                                				wd:Q847102  # human chromosome 12
                                				wd:Q840734  # human chromosome 13
                                				wd:Q138955  # human chromosome 14
                                				wd:Q765245  # human chromosome 15
                                				wd:Q742870  # human chromosome 16
                                				wd:Q220677  # human chromosome 17
                                				wd:Q780468  # human chromosome 18
                                				wd:Q510786  # human chromosome 19
                                				wd:Q666752  # human chromosome 20
                                				wd:Q753218  # human chromosome 21
                                				wd:Q753805  # human chromosome 22
                                				wd:Q61333  # human chromosome X
                                				wd:Q202771  # human chromosome Y
                                				wd:Q27075  # human chromosome MT
                                			]

                                <genomic-assembly> [
                                   				wd:Q20966585 # Genome assembly GRCh38
                                				wd:Q21067546 # Genome assembly GRCh37
                                			]

                                <strand-orientation> [
                                				wd:Q22809711 # reverse strand
                                				wd:Q22809680 # forward strand
                                ]

                                <wikidata-human_protein> {
                                # STATEMENTS
                                p:P279 @<P279_subclass_of_protein> ;
                                p:P352 @<P352_uniprot_id> ;
                                }

                                # Shape expressions for Wikidata statements
                                <P279_subclass_of_protein> {
                                    ps:P279 wd:Q8054 ;
                                	prov:wasDerivedFrom @<uniprot-reference> ;
                                }

                                <P352_uniprot_id> {
                                	ps:P352 LITERAL ;
                                	prov:wasDerivedFrom @<uniprot-reference> ;
                                }

                                # REFERENCES
                                <uniprot-reference> {
                                	pr:P248	[wd:Q905695] ;
                                	pr:P352	LITERAL ;
                                	pr:P813	xsd:dateTime ;
                                }
`

wikidataHumanGeneItem.sparql = `Endpoint: https://query.wikidata.org/bigdata/namespace/wdq/sparql

                               Query: SELECT DISTINCT * WHERE {
                                        ?item wdt:P351 ?ncbigeneid ;
                                              wdt:P703 wd:Q15978631 .
                                      }
                                      LIMIT 20`;

wikidataHumanGeneItem.fail = `Endpoint: https://query.wikidata.org/bigdata/namespace/wdq/sparql

Query: SELECT * WHERE {
  ?item wdt:P351 ?ncbi_gene_id ;
        wdt:P703 wd:Q15978631 ;
        wdt:P352 ?uniprot_id .
}`

wikidataHumanGeneItem.fail2 = `Endpoint: https://query.wikidata.org/bigdata/namespace/wdq/sparql

Query: PREFIX wd: <http://www.wikidata.org/entity/>
       PREFIX p: <http://www.wikidata.org/prop/>
       PREFIX wdt: <http://www.wikidata.org/prop/direct/>
       PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
       SELECT * WHERE {
          ?item wdt:P703 wd:Q15978631 ;
                p:P644 ?genomicStart ;
                p:P645 ?genomicEnd .
          ?genomicStart ps:P644 ?start .
          ?genomicEnd ps:P645 ?end .
          FILTER NOT EXISTS {
            ?genomicStart pq:P659 ?o .
            ?genomicEnd pq:P659 ?t .
            }
       }
}`

return {
      "Human genes": {
        schema: wikidataHumanGeneItem.schema,
        passes: {
          "Get human genes (SPARQL)": {
            data: wikidataHumanGeneItem.sparql,
            queryMap: "SPARQL `SELECT DISTINCT * WHERE { "+
              "{ ?item wdt:P351 ?ncbigeneid ; "+
              " wdt:P703 wd:Q15978631 ." +
              "  } "+
              "} LIMIT 20`@- start -"}
        },
        fails: {
           "Human geme items with a uniprot identifier": {
                            data: wikidataHumanGeneItem.fail,
                            queryMap: "SPARQL `SELECT * WHERE { "+
                                      "?item wdt:P351 ?ncbi_gene_id ;" +
                                       "wdt:P703 wd:Q15978631 ; " +
                                       "wdt:P352 ?uniprot_id . }`@- start -"},

           "Start and End locations without build version": {
                            data: wikidataHumanGeneItem.fail2,
                            queryMap: "SPARQL `PREFIX wd: <http://www.wikidata.org/entity/> "+
                                               "PREFIX p: <http://www.wikidata.org/prop/>"+
                                               "PREFIX wdt: <http://www.wikidata.org/prop/direct/>"+
                                               "PREFIX pq: <http://www.wikidata.org/prop/qualifier/>"+
                                               "SELECT * WHERE {"+
                                               "   ?item wdt:P703 wd:Q15978631 ;"+
                                               "         p:P644 ?genomicStart ;"+
                                               "         p:P645 ?genomicEnd ."+
                                               "   ?genomicStart ps:P644 ?start ."+
                                               "   ?genomicEnd ps:P645 ?end ."+
                                               "   FILTER NOT EXISTS { "+
                                               "     ?genomicStart pq:P659 ?o ."+
                                               "     ?genomicEnd pq:P659 ?t .}`@- start - "},

        }.

      "Each Wikidata item on Cancer should have a NCI Thesaurus ID": {
            schema: wikidataItem.schema,
            passes: {
              "Get all Wikidata items on Cancers (SPARQL)": {
                data: wikidataItem.sparql,
                queryMap: "SPARQL `SELECT ?item ?itemLabel "+
                  "WHERE "+
                  "{ ?item wdt:P279* wd:Q12078 . "+
                  "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\" } "+
                  "} LIMIT 10`@- start -"}
            },
            fails: {
            }
      }
    };
})();
