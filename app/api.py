#!/usr/bin/env python3
from flask import Flask, request, send_from_directory, render_template, Markup, redirect, url_for
from flask_restful import reqparse, abort, Api, Resource
import json
import base64
from modules.request import queryManager, treude, witt
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
queryManager = queryManager.InformationRetriever()
treude = treude.InformationRetriever()
witt = witt.InformationRetriever()
CORS(app)

class SDNavigator(Resource):
    
    # Renders front page
    @app.route('/', methods=["GET","POST"])
    def index():
        return render_template('index.html')
    
    # retrieves data relevant to the question asked
    @app.route('/query/question', methods=['POST'])
    def question():
        
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

        elif "question3" in currQuestion or "question9" in currQuestion:
            if("question3" in currQuestion): currUserStory = currQuestion.replace('question3','')
            else: currUserStory = currQuestion.replace('question9','')
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

        elif "question4" in currQuestion or "question10" in currQuestion:
            if("question4" in currQuestion): currUserStory = currQuestion.replace('question4','')
            else: currUserStory = currQuestion.replace('question10','')
            results = treude.getCategoryOfSentence(currUserStory)

            if len(results)>0:
                updatedResults = []
                for cluster in results:
                    word = cluster['word']
                    updatedCluster = []
                    for sentence in cluster['cluster']:
                        sentenceType = queryManager.getSentenceType(sentence['sentence'])
                        if sentenceType != None:
                            for instance in sentenceType:
                                # Filter out all results that are not implementation related
                                if 'S-Architecture' in instance['type'] or 'S-TechnologySolution' in instance['type'] or 'S-SourceCode' in instance['type'] or 'B-TechnologySolution' in instance['type'] or 'B-General' in instance['type'] or 'D-Architecture' in instance['type'] or 'U-Architecture' in instance['type'] or 'U-Implementation' in instance['type']:
                                    updatedCluster.append(instance)
                    
                    updatedResults.append({'word': word, 'cluster': updatedCluster})

                results = updatedResults
            else:
                results = "There are no results for this requirement."
        
        elif "question5" in currQuestion or "question11" in currQuestion:
            if("question5" in currQuestion): currUserStory = currQuestion.replace('question5','')
            else: currUserStory = currQuestion.replace('question11','')
            results = treude.getCategoryOfSentence(currUserStory)

            if len(results)>0:
                updatedResults = []
                for cluster in results:
                    word = cluster['word']
                    updatedCluster = []
                    for sentence in cluster['cluster']:
                        sentenceType = queryManager.getSentenceType(sentence['sentence'])
                        if sentenceType != None:
                            for instance in sentenceType:
                                # Filter out all results that are not behaviour related
                                if 'B-TechnologySolution' in instance['type'] or 'B-General' in instance['type']:
                                    updatedCluster.append(instance)
                    
                    updatedResults.append({'word': word, 'cluster': updatedCluster})

                results = updatedResults
            else:
                results = "There are no results for this requirement."

        elif "question6" in currQuestion or "question12" in currQuestion:
            if("question6" in currQuestion): currUserStory = currQuestion.replace('question6','')
            else: currUserStory = currQuestion.replace('question12','')
            results = treude.getCategoryOfSentence(currUserStory)

            if len(results)>0:
                updatedResults = []
                for cluster in results:
                    word = cluster['word']
                    updatedCluster = []
                    for sentence in cluster['cluster']:
                        sentenceType = queryManager.getSentenceType(sentence['sentence'])
                        if sentenceType != None:
                            for instance in sentenceType:
                                # Filter out all results that are not structure related
                                if 'S-TechnologySolution' in instance['type'] or 'S-SourceCode' in instance['type'] or 'S-Architecture' in instance['type']:
                                    updatedCluster.append(instance)
                    
                    updatedResults.append({'word': word, 'cluster': updatedCluster})

                results = updatedResults
            else:
                results = "There are no results for this requirement."

        elif "question7" in currQuestion or "question13" in currQuestion:
            if("question7" in currQuestion): currUserStory = currQuestion.replace('question7','')
            else: currUserStory = currQuestion.replace('question13','')
            results = treude.getCategoryOfSentence(currUserStory)

            if len(results)>0:
                updatedResults = []
                for cluster in results:
                    word = cluster['word']
                    updatedCluster = []
                    for sentence in cluster['cluster']:
                        sentenceType = queryManager.getSentenceType(sentence['sentence'])
                        if sentenceType != None:
                            for instance in sentenceType:
                                # Filter out all results that are not UI design related
                                if 'U-Architecture' in instance['type'] or 'U-Implementation' in instance['type']:
                                    updatedCluster.append(instance)
                    
                    updatedResults.append({'word': word, 'cluster': updatedCluster})

                results = updatedResults
            else:
                results = "There are no results for this requirement."

        elif "question8" in currQuestion or "question14" in currQuestion:
            if("question8" in currQuestion): currUserStory = currQuestion.replace('question8','')
            else: currUserStory = currQuestion.replace('question14','')
            results = treude.getCategoryOfSentence(currUserStory)

            if len(results)>0:
                updatedResults = []
                for cluster in results:
                    word = cluster['word']
                    updatedCluster = []
                    for sentence in cluster['cluster']:
                        sentenceType = queryManager.getSentenceType(sentence['sentence'])
                        if sentenceType != None:
                            for instance in sentenceType:
                                # Filter out all results that are not related to development processes
                                if 'DevelopmentPractice' in instance['type'] or 'Testing' in instance['type'] or 'Issue' in instance['type'] or 'Risk' in instance['type']:
                                    updatedCluster.append(instance)
                    
                    updatedResults.append({'word': word, 'cluster': updatedCluster})

                results = updatedResults
            else:
                results = "There are no results for this requirement."
        
        elif currQuestion == 'question15':
            results = witt.get_db_architecture_patterns()
            if len(results)==0:
                results = "No architecture patterns found in the database."

        elif currQuestion == 'question16':
            results = witt.get_db_programming_languages()
            if len(results)==0:
                results = "No programming languages found in the database."
        
        elif currQuestion == 'question17':
            results = witt.get_db_architecture_patterns()
            results = witt.findWordMatch(results)
            if len(results)==0:
                results = "No architecture patterns found in the database."
       
        else:
            results = 'error'

        response = app.response_class(
            response=json.dumps(results),
            status=200,
            mimetype='application/json'
        )
        return response


##
## Setup the Api resource routing
##
api.add_resource(SDNavigator, '/')

#api.add_resource(Todo, '/todos/<todo_id>')
if __name__ == '__main__':
    app.run(debug=True)
