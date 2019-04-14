from SPARQLWrapper import SPARQLWrapper, JSON
import urllib.request

import re
from nltk.corpus import stopwords 
from nltk.stem import PorterStemmer 
from nltk.stem import WordNetLemmatizer
    
class InformationRetriever:   
    
    def __init__(self):
        self.sparql = SPARQLWrapper('http://localhost:3030/MasterThesisDS13')
    
    def read_data(self, file):

        with open(file, encoding='utf-8-sig') as f:
            allData = []
            allDataFormat2 = {}
            oneSentence = []
            i=0
            for j, line in enumerate(f):
                
                if j==i:
                    sentence = line.strip()
                    oneSentence.append(sentence)
                elif j==i+1:
                    treudeResult = line.strip()
                    #oneSentence.append(treudeResult)
                    testy = re.findall(r'\{(.*?)\}', treudeResult)
                    #print(testy)
                    thisRes = []
                    for thingy in testy:
                        testy2 = re.findall(r'\[(.*?)\]', thingy)
                        #print(testy2)
                        thisRes.append(testy2)
                    oneSentence.append(thisRes)
                if j % 2 == 1:
                    #print(oneSentence)
                    #print('---')
                    allData.append({"sentence":oneSentence[0],"treudeResult":oneSentence[1]})
                    #print(oneSentence)
                    allDataFormat2[oneSentence[0]] = oneSentence[1]
                    oneSentence = []
                    i+=2
                    
                
        return allData, allDataFormat2



    def stem(self, word):   
        return PorterStemmer().stem(word)
        

    def lemma(self, word): 
        return WordNetLemmatizer().lemmatize(word)


    def remove_stopwords(self, wordlist):
        
        stopWords = set(stopwords.words('english'))
        filteredWordList = []
        
        for word in wordlist:
            if word not in stopWords:
                filteredWordList.append(word)
                
        return filteredWordList
                

    def create_wordbank(self, data):
        wordBank = []
        for x in data.values():
            if(len(x)>0):
            #print(x)
            
                for result in x:
                    #print(result)
                    for words in result:
                        words = words.split(' ')
                        
                        for word in words:
                            if word != '':
                                word = self.lemma(word)
                                word = self.stem(word)
                                wordBank.append(word.lower())
        
        wordBank = set(wordBank)
        wordBank = self.remove_stopwords(wordBank)
        
        return wordBank



    def matchWordToWordBank(self, word, wordBank):
        word = word.lower()
        word = self.lemma(word)
        word = self.stem(word)
        
        if word in wordBank:
            return True
        else:
            return False
            

    def findWordClusters(self, wordToMatch, treudeData):

        wordToMatch = wordToMatch.lower()
        wordToMatch = self.lemma(wordToMatch)
        wordToMatch = self.stem(wordToMatch)
        
        cluster = []
        
        for result in treudeData:
            sentence = result
            treudeValues = treudeData[result]
            for results in treudeValues:
                for words in results:
                    words = words.split(' ')
                    for word in words:
                        word = word.lower()
                        word = self.lemma(word)
                        word = self.stem(word)
                        if word == wordToMatch:
                            cluster.append(sentence)

        cluster = list(set(cluster)) #set removes duplicates, then I change it to a list again.
        
        finalCluster = []
        for sentence in cluster:
            finalCluster.append({'sentence':sentence, 'type':''})

        return finalCluster
        
        
    def findSentenceClusters(self, sentence, treudeData, wordBank):

        treudeValues = treudeData[sentence]
                
        wordsToCluster = []
        for value in treudeValues:
            for words in value:
                words = words.split(' ')
                for word in words:
                    if self.matchWordToWordBank(word, wordBank):
                        wordsToCluster.append(word)                        
                    
        wordClusters = []
        for word in wordsToCluster:
            cluster = self.findWordClusters(word, treudeData)
            wordCluster = {"word": word, "cluster": cluster}    
            wordClusters.append(wordCluster)
            
        sentenceClusters = {"sentence": sentence, "clusters": wordClusters}
        
        return sentenceClusters

    def getCategoryOfSentence(self, sentence):
        TreudeData, TreudeDataFormat2 = self.read_data('TreudeData.txt')

        #print(TreudeDataFormat2)
        #for x in TreudeDataFormat2:
        #    print(x)
        #    print(len(TreudeDataFormat2[x]))
        #    print(TreudeDataFormat2[x])
        #    print('----------------------')

        wordBank = self.create_wordbank(TreudeDataFormat2)    

        #print(wordBank)
        #print(len(wordBank))
        
        #sentenceClusters = findSentenceClusters("Finally, the third goal involves checking the payment or shipping status of the order, or any additional related information.")
        #sentenceClusters = findSentenceClusters("As a customer, I want to add a particular product to the shopping cart, so that I can buy it with the next order (1).")
        sentenceClusters = self.findSentenceClusters(sentence, TreudeDataFormat2, wordBank)

        # print(sentenceClusters['sentence'])
        # for result in sentenceClusters['clusters']:
        #         print(result)
        #         print('')
        
        return sentenceClusters['clusters']

          

                
                
                
                
                
                
                