from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import json
import base64

app = Flask(__name__)
api = Api(app)

with open('description.json') as f:
    data = json.load(f)


#Function used to send error if id does not exist
def abort_if_image_doesnt_exist(image_arg):
    if 'imgText' not in image_arg:
        abort(404, message="Image {} doesn't exist".format(image_arg))

#init parser
parser = reqparse.RequestParser()
parser.add_argument('blaa')

class Test(Resource):
    def get(self):
        return {'hello': 'world'}

    def post(self):
        args = parser.parse_args()
        print(args)
        return {'Your data': args}, 201


##
## Actually setup the Api resource routing here
##
api.add_resource(Test, '/')

#api.add_resource(Todo, '/todos/<todo_id>')
if __name__ == '__main__':
    app.run(debug=True)
    #app.run()
