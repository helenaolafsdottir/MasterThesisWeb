import sqlite3
import os.path
from static.data import *  
from modules.request import queryManager

queryManager = queryManager.InformationRetriever()

class InformationRetriever:   
    
    def read_category_data(self):

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(BASE_DIR, "witt.db")
        
        conn = sqlite3.connect(db_path)
        
        c = conn.cursor()

        categories = []
        rows = c.execute('SELECT * FROM Categories')
        for row in rows:
            categories.append(row)   
            #print(row)
        
        conn.commit()
        conn.close()

        # for row in categories:
        #     print(row)
        return categories

    def get_db_architecture_patterns(self):
        categories = self.read_category_data()

        patterns = []
        for row in categories:
            if(row[2] == 'pattern'):
                #print(row)
                patterns.append(row[1])
                
        return patterns
    
    def get_db_programming_languages(self):
        categories = self.read_category_data()

        progLanguages = []
        for row in categories:
            if(row[2] == 'programming-language'):
                #print(row)
                progLanguages.append(row[1])
                
        return progLanguages
    
    sentenceMatches = []
    wordMatches = []
    def findMatch(self, section, wordToMatch):
        cluster = []
        if section['included']=='yes':
            headerOriginal = section[next(iter(section))]['sentence']
            header = section[next(iter(section))]['sentence'].lower()
            headerWords = header.split(' ')
            if wordToMatch.lower() in headerWords:
                self.wordMatches.append(wordToMatch)
                arr = [wordToMatch, headerOriginal]
                self.sentenceMatches.append(arr)            
                #cluster.append({'sentence':sentence, 'type': ''})
            
            for paragraphs in section['paragraphs']:
                for paragraphObj in paragraphs:
                    sentenceOriginal = paragraphObj['sentence']
                    sentence = paragraphObj['sentence'].lower()
                    sentenceWords = sentence.split(' ')
                    
                    if wordToMatch.lower() in sentenceWords:
                        self.wordMatches.append(wordToMatch)
                        arr = [wordToMatch, sentenceOriginal]
                        self.sentenceMatches.append(arr)
                        #cluster.append({'sentence':sentence, 'type': ''})
        
        #if(len(cluster)>0):
        #    self.sentenceMatches.append({'word': wordToMatch, 'cluster': cluster})
            
        for subSection in section['sub-sections']:
            self.findMatch(subSection, wordToMatch)

    def findWordMatch(self, relevantSentences):
        
        for word in relevantSentences:
            for section in storedResults:
                self.findMatch(section, word)

        wordMatchUnique = list(set(list(self.wordMatches)))
        sentenceMatches = self.sentenceMatches


        results = []
        for word in wordMatchUnique:
            cluster = []
            for sentence in sentenceMatches:
                if sentence[0] == word: 
                    cluster.append({'sentence': sentence[1], 'type': ''})
            results.append({'word': word, 'cluster': cluster})


        updatedResults = self.get_sentence_type(results)


        return updatedResults

    
    def get_sentence_type(self, results):
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
      
        return updatedResults

    