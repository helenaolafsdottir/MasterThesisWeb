from modules.AIService.searchService import searchWeb
from modules.Parser.searchResultParser import getReleventLinksFromWebSearch
from modules.Controller.controller import handleLandmarkImage
import json

print(json.dumps(handleLandmarkImage()))