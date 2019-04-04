import requests
import queryManager
from flask import Flask, request, send_from_directory, render_template, Markup
from configparser import ConfigParser

queryManager = queryManager.InformationRetriever()  
types = queryManager.getAllUserStories()
print('types: ',types)



def processRequest( method, url, **kwargs):

    """
    Helper function to process the request to Project Oxford

    Parameters:
    json: Used when processing images from its URL. See API Documentation
    data: Used when processing image read from disk. See API Documentation
    headers: Used to pass the key information and the data type request
    """
    parser = ConfigParser()
    parser.read('config.ini')
    maxNoOfTries = parser.get('DEFAULT', 'MaxNumRetries')

    retries = 0
    result = None

    while True:

        response = requests.request( method, url, **kwargs)

        if response.status_code == 429: 

            print( "Message: %s" % ( response.json() ) )

            if retries <= maxNoOfTries: 
                time.sleep(1) 
                retries += 1
                continue
            else: 
                print( 'Error: failed after retrying!' )
                break

        elif response.status_code == 200 or response.status_code == 201:

            if 'content-length' in response.headers and int(response.headers['content-length']) == 0: 
                result = None 
            elif 'content-type' in response.headers and isinstance(response.headers['content-type'], str): 
                if 'application/json' in response.headers['content-type'].lower(): 
                    result = response.json() if response.content else None 
                elif 'image' in response.headers['content-type'].lower(): 
                    result = response.content
        else:
            print( "Error code: %d" % ( response.status_code ) )
            print( "Message: %s" % ( response.json() ) )

        break
        
    return result
