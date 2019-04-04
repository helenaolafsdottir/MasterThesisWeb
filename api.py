from flask import Flask, request, send_from_directory, render_template, Markup, redirect, url_for
from flask_restful import reqparse, abort, Api, Resource
import json
import base64
from modules.request import queryManager

app = Flask(__name__)
api = Api(app)
queryManager = queryManager.InformationRetriever()


#init parser
parser = reqparse.RequestParser()

parser.add_argument('blaa')


class Test(Resource):
    @app.route('/', methods=["GET","POST"])
    def index():
        #types = queryManager.getAllUserStories()
        #print('types: ',types)

        return render_template('index.html')

    @app.route('/query/question', methods=['POST'])
    def question1():
        currQuestion = request.form.get('currQuestion')
        print(currQuestion)

        if currQuestion == 'question1':
            results = queryManager.getAllFeatureAndRrelevantClasses()

        elif currQuestion == 'question2':
            results = queryManager.getOneFeatureAndRrelevantClasses('4.2.2.1 Display products')
            #results = queryManager.getOneFeatureAndRrelevantClasses('4.2.2.2 Purchase Products')
            #results = queryManager.getOneFeatureAndRrelevantClasses('4.2.2.3 User management')
            print('features&Stuff: ', results)

        elif currQuestion == 'questionTest':
            results = queryManager.getOBjectsByClass('onto:UserStory')
            #funcReqs = queryManager.getOBjectsByClass('onto:FunctionalRequirementAndBehaviour')
            #useCases = queryManager.getOBjectsByClass('onto:UseCase')
            print('types: ', results)

        return json.dumps(results)
            

    def get(self):
        return {'hello': 'world'}

    def post(self):
        args = parser.parse_args()

        print(args)
        print(request.form.get('hello'))

        return {'Your data': args}, 201


##
## Actually setup the Api resource routing here
##
api.add_resource(Test, '/')

#api.add_resource(Todo, '/todos/<todo_id>')
if __name__ == '__main__':
    app.run(debug=True)
    #app.run()
