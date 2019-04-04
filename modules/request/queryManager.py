from SPARQLWrapper import SPARQLWrapper, JSON
import urllib.request

#if the arg is empty in ProxyHandler, urllib will find itself your proxy config.

# Retrieves data from the ontology using the SPARQL query language
class InformationRetriever:

    def __init__(self):
        self.sparql = SPARQLWrapper('http://localhost:3030/MasterThesisDS11')
    
    def query(self, query):
        self.sparql.setQuery(query)
        self.sparql.setReturnFormat(JSON)
        return self.sparql.query().convert()

    def toQueryUri(self, uri):
        return '<' + uri + '>'

    def getAllOntologyTypes(self):
        query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'\
                'PREFIX owl: <http://www.w3.org/2002/07/owl#> '\
                'SELECT ?type WHERE {{'\
                '?type rdf:type owl:Class .'\
                '}}'
        types = []
        try:
            queryResult = self.query(query)
            results = queryResult['results']['bindings']
            if results:
                for r in results:
                    types.append(r['type']['value'])
                return types
        except:      
            return 'Error in query'

    
    def getOBjectsByClass(self, classToFind):
        query1 = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"\
                "PREFIX owl: <http://www.w3.org/2002/07/owl#>"\
                "PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> "\
                "SELECT ?x ?y ?z WHERE {{"\
                "?x rdf:type onto:UserStory . "\
                "?x rdfs:label ?y . "\
                "?x onto:PartOf ?z ."\
                "}}"

        query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"\
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"\
                "PREFIX owl: <http://www.w3.org/2002/07/owl#>"\
                "PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> "\
                "SELECT ?type ?label WHERE {{"\
                "?type rdf:type {classType} . "\
                "?type rdfs:label ?label . "\
                "}}"
        query = query.format(classType=classToFind)
        types = []
        try:
            queryResult = self.query(query)
            results = queryResult['results']['bindings']
            if results:
                for r in results:
                    types.append(r['label']['value'])
                return types
        except:      
            return 'Error in query'


    def getOneFeatureAndRelevantClasses(self, feature):

        query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'\
                'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'\
                'PREFIX owl: <http://www.w3.org/2002/07/owl#>'\
                'PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> '\
                'SELECT ?label ?lab ?typ WHERE {{'\
                '{{?type rdf:type onto:Feature }} UNION {{?type rdf:type onto:UseCase }} .'\
                '?type rdfs:label ?label .'\
                '?relatedIndividuals onto:BelongsTo ?type .'\
                '?relatedIndividuals rdfs:label ?lab .'\
                '?relatedIndividuals rdf:type ?typ .'\
                'FILTER (?label="{feature}") .'\
                'FILTER (regex(str(?typ ),"^(?!http://www.w3.org/2002/07/owl#).+")) .'\
                '}}'
        
        query = query.format(feature=feature)
        types = []
        try:
            queryResult = self.query(query)
            results = queryResult['results']['bindings']
            if results:
                for r in results:
                    types.append({'sentence': r['lab']['value'], 'type': r['typ']['value']}) 
                return types
        except:      
            return 'Error in query'

    def getAllFeatureAndRrelevantClasses(self):

        query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'\
                'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'\
                'PREFIX owl: <http://www.w3.org/2002/07/owl#>'\
                'PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> '\
                'SELECT ?feature ?lab ?typ WHERE {{'\
                '{{?type rdf:type onto:Feature }} UNION {{?type rdf:type onto:UseCase }} .'\
                '?type rdfs:label ?feature .'\
                '?relatedIndividuals onto:BelongsTo ?type .'\
                '?relatedIndividuals rdfs:label ?lab .'\
                '?relatedIndividuals rdf:type ?typ .'\
                'FILTER (regex(str(?typ ),"^(?!http://www.w3.org/2002/07/owl#).+")) .'\
                '}}'
        types = []
        try:
            queryResult = self.query(query)
            results = queryResult['results']['bindings']
            if results:
                for r in results:
                    types.append({'feature': r['feature']['value'],'sentence': r['lab']['value'], 'type': r['typ']['value']}) 
                return types
        except:      
            return 'Error in query'
    