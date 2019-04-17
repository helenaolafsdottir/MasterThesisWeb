from flask import Flask, request, send_from_directory, render_template, Markup, redirect, url_for
from flask_restful import reqparse, abort, Api, Resource
import json
import base64
from modules.request import queryManager, treude
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
queryManager = queryManager.InformationRetriever()
treude = treude.InformationRetriever()
CORS(app)

#init parser
parser = reqparse.RequestParser()

parser.add_argument('blaa')


class Test(Resource):
    @app.route('/', methods=["GET","POST"])
    def index():

        return render_template('index.html')

    @app.route('/query/question', methods=['POST'])
    def question1():
        
        data = request.data
        dataDict = json.loads(data)
        currQuestion = dataDict['currQuestion']
        if currQuestion == 'question1':
            results = queryManager.getAllFeatureAndRelevantClasses()
        
        elif currQuestion == 'feature1':
            results = queryManager.getOneFeatureAndRelevantClasses('4.2.2.1 Display products')
        
        elif currQuestion == 'feature2':
            results = queryManager.getOneFeatureAndRelevantClasses('4.2.2.2 Purchase Products')
        
        elif currQuestion == 'feature3':
            results = queryManager.getOneFeatureAndRelevantClasses('4.2.2.3 User management')
    

        elif "userStory" in currQuestion:
            currUserStory = currQuestion.replace('userStory','')
            results = treude.getCategoryOfSentence(currUserStory)
            
            if len(results)>0:
                #Here we go into the ontology and get the classifications of the sentences in the clusters.
                updatedResults = []
                for cluster in results:
                    word = cluster['word']
                    updatedCluster = []
                    for sentence in cluster['cluster']:
                        sentenceType = queryManager.getSentenceType(sentence['sentence'])
                        if sentenceType != None:
                            for instance in sentenceType:
                                # The uncertain and non-information categories shouldn't be of interest to the user.
                                if 'Uncertain' not in instance['type'] and 'Non-Information' not in instance['type']:
                                    updatedCluster.append(instance)
                    
                    updatedResults.append({'word': word, 'cluster': updatedCluster})

                results = updatedResults
            else:
                results = "There are no results for this requirement."

        else:
            results = 'error'

        response = app.response_class(
            response=json.dumps(results),
            status=200,
            mimetype='application/json'
        )
        return response




    def get(self):
        return {'hello': 'world'}

    def post(self):
        args = parser.parse_args()

        return {'Your data': args}, 201


##
## Actually setup the Api resource routing here
##
api.add_resource(Test, '/')

#api.add_resource(Todo, '/todos/<todo_id>')
if __name__ == '__main__':
    app.run(debug=True)
    #app.run()
