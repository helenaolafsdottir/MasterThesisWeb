# from SPARQLWrapper import SPARQLWrapper, JSON
# import urllib.request
# from owlready2 import *

# # Retrieves data from the ontology using the SPARQL query language
# class InformationRetriever:

#     # Connect to the ontology server
#     def __init__(self):
#         self.sparql = SPARQLWrapper('http://localhost:3030/MasterThesisDS18')

                
#         # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#         # owl_path = os.path.join(BASE_DIR, "ontology.owl")
#         # onto = get_ontology('file://C:/Users/Lenovo/Documents/Helena/Chalmers/MasterThesis/WebSystem/MasterThesisWeb/ontology.owl').load()
#         # print('onto: ', onto)
        
#         # my_world = World()
#         # my_world.get_ontology('file://C:/Users/Lenovo/Documents/Helena/Chalmers/MasterThesis/WebSystem/MasterThesisWeb/ontology.owl').load() #path to the owl file is given here
#         # sync_reasoner(my_world)  #reasoner is started and synchronized here
#         # self.graph = my_world.as_rdflib_graph()

#     # Constructs SPARQL query
#     def query(self, query):
#         self.sparql.setQuery(query)
#         self.sparql.setReturnFormat(JSON)
#         return self.sparql.query().convert()
    
#     # Used for question: What functionalities does this feature provide?
#     # Retrieves all functional requirements and use cases related to the feature provided as input
#     def getOneFeatureAndRelevantClasses(self, feature):

#         query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'\
#                 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'\
#                 'PREFIX owl: <http://www.w3.org/2002/07/owl#>'\
#                 'PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> '\
#                 'SELECT ?label ?lab ?typ WHERE {{'\
#                 '{{?type rdf:type onto:Feature }} UNION {{?type rdf:type onto:UseCase }} .'\
#                 '?type rdfs:label ?label .'\
#                 '?relatedIndividuals onto:BelongsTo ?type .'\
#                 '?relatedIndividuals rdfs:label ?lab .'\
#                 '?relatedIndividuals rdf:type ?typ .'\
#                 'FILTER (?label="{feature}") .'\
#                 'FILTER (regex(str(?typ ),"^(?!http://www.w3.org/2002/07/owl#).+")) .'\
#                 'FILTER (regex(str(?typ), "Functional") || regex(str(?typ), "UseCase")) .'\
#                 'FILTER (!regex(str(?typ), "NonFunctional"))'\
#                 '}}'
#         query = query.format(feature=feature)
#         types = []
#         try:
#             queryResult = self.query(query)
#             results = queryResult['results']['bindings']
#             if results:
#                 for r in results:
#                     types.append({'sentence': r['lab']['value'], 'type': r['typ']['value']}) 
#                 return types
#         except:      
#             return 'Error in query'

#     # Used for question: What functionalities exist in the system?
#     # Retrieves all functional requirements and use cases related to the features of the system
#     def getAllFeatureAndRelevantClasses(self):

#         query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'\
#                 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'\
#                 'PREFIX owl: <http://www.w3.org/2002/07/owl#>'\
#                 'PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> '\
#                 'SELECT ?feature ?lab ?typ WHERE {{'\
#                 '{{?type rdf:type onto:Feature }} UNION {{?type rdf:type onto:UseCase }} .'\
#                 '?type rdfs:label ?feature .'\
#                 '?relatedIndividuals onto:BelongsTo ?type .'\
#                 '?relatedIndividuals rdfs:label ?lab .'\
#                 '?relatedIndividuals rdf:type ?typ .'\
#                 'FILTER (regex(str(?typ ),"^(?!http://www.w3.org/2002/07/owl#).+")) . '\
#                 'FILTER (regex(str(?typ), "Functional") || regex(str(?typ), "UseCase")) .'\
#                 'FILTER (!regex(str(?typ), "NonFunctional"))'\
#                 '}}'
#         types = []
#         try:
#             queryResult = self.query(query)
#             results = queryResult['results']['bindings']
#             if results:
#                 for r in results:
#                     types.append({'feature': r['feature']['value'],'sentence': r['lab']['value'], 'type': r['typ']['value']}) 
#                 return types
#         except:      
#             return 'Error in query'

#     # Retrieves the categorisation of the sentence provided as input
#     def getSentenceType(self, sentence):
#         query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'\
#                 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'\
#                 'PREFIX owl: <http://www.w3.org/2002/07/owl#>'\
#                 'PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> '\
#                 'SELECT ?label ?typ WHERE {{'  \
#                 '?type rdfs:label ?label .' \
#                 '?type rdf:type ?typ .' \
#                 'FILTER (?label="{sentence}")' \
#                 'FILTER (regex(str(?typ ),"^(?!http://www.w3.org/2002/07/owl#).+")) . ' \
#                 '}}'
#         query = query.format(sentence=sentence)
#         types = []
#         try:
#             queryResult = self.query(query)
#             results = queryResult['results']['bindings']
#             if results:
#                 for r in results:
#                     types.append({'sentence': r['label']['value'], 'type': r['typ']['value']}) 
#                 return types
#         except:      
#             return 'Error in query'
    

    

from SPARQLWrapper import SPARQLWrapper, JSON
import urllib.request
from owlready2 import *

# Retrieves data from the ontology using the SPARQL query language
class InformationRetriever:

    # Connect to the ontology server
    def __init__(self):
        #self.sparql = SPARQLWrapper('http://localhost:3030/MasterThesisDS18')

                
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        owl_path = os.path.join(BASE_DIR, "ontology.owl")
        onto = get_ontology(owl_path).load()
        #print('onto: ', onto)
        
        my_world = World()
        my_world.get_ontology(owl_path).load() #path to the owl file is given here
        sync_reasoner(my_world)  #reasoner is started and synchronized here
        self.graph = my_world.as_rdflib_graph()

    # Constructs SPARQL query
    def query(self, query):
        self.sparql.setQuery(query)
        self.sparql.setReturnFormat(JSON)
        return self.sparql.query().convert()
    

    # Used for question: What functionalities does this feature provide?
    # Retrieves all functional requirements and use cases related to the feature provided as input
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
                'FILTER (regex(str(?typ), "Functional") || regex(str(?typ), "UseCase")) .'\
                'FILTER (!regex(str(?typ), "NonFunctional"))'\
                '}}'
        query = query.format(feature=feature)
        types = []
        try:
            queryResult = self.graph.query(query)
            for item in queryResult:
                types.append({'sentence': item[1], 'type': item[2]})
            return types            
        except:
            return 'Error in query'

    # Used for question: What functionalities exist in the system?
    # Retrieves all functional requirements and use cases related to the features of the system
    def getAllFeatureAndRelevantClasses(self):
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
                'FILTER (regex(str(?typ ),"^(?!http://www.w3.org/2002/07/owl#).+")) . '\
                'FILTER (regex(str(?typ), "Functional") || regex(str(?typ), "UseCase")) .'\
                'FILTER (!regex(str(?typ), "NonFunctional"))'\
                '}}'
        types = []
        try:
            queryResult = self.graph.query(query)
            for item in queryResult:
                types.append({'feature': item[0], 'sentence': item[1], 'type': item[2]})
            return types
        except:      
            return 'Error in query'

    # Retrieves the categorisation of the sentence provided as input
    def getSentenceType(self, sentence):
        query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'\
                'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'\
                'PREFIX owl: <http://www.w3.org/2002/07/owl#>'\
                'PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> '\
                'SELECT ?label ?typ WHERE {{'  \
                '?type rdfs:label ?label .' \
                '?type rdf:type ?typ .' \
                'FILTER (?label="{sentence}")' \
                'FILTER (regex(str(?typ ),"^(?!http://www.w3.org/2002/07/owl#).+")) . ' \
                '}}'
        #print('curr sentence: ', sentence)
        query = query.format(sentence=sentence)
        types = []
        #try:
        queryResult = self.graph.query(query)   
        for item in queryResult:
            types.append({'sentence': item[0], 'type': item[1]})
        return types
        #except:      
        #    return 'Error in query'
    

    def getSentenceTypes(self, sentences):
        filterString = ''
        for sentence in sentences:
            filterStringAddition = " (?label=\"{0}\") ||".format(sentence)
            filterString = filterString + filterStringAddition
            
        filterString = filterString[:-2]
        filterString = 'FILTER (' + filterString + ')'

        query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'\
                'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'\
                'PREFIX owl: <http://www.w3.org/2002/07/owl#>'\
                'PREFIX onto: <http://www.semanticweb.org/masterThesisOntology#> '\
                'SELECT ?label ?typ WHERE {{'  \
                '?type rdfs:label ?label .' \
                '?type rdf:type ?typ .' \
                '{filterString}'\
                'FILTER (regex(str(?typ ),"^(?!http://www.w3.org/2002/07/owl#).+")) . ' \
                '}}'
        
        query = query.format(filterString=filterString)
        types = []
        
        queryResult = self.graph.query(query)   
        for item in queryResult:
            types.append({'sentence': item[0], 'type': item[1]})
        return types
        
