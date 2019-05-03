from SPARQLWrapper import SPARQLWrapper, JSON
import urllib.request

import re
from nltk.corpus import stopwords 
from nltk.stem import PorterStemmer 
from nltk.stem import WordNetLemmatizer
    
class InformationRetriever:   

    # Read data from the txt file storing the results from Treude's tool
    def read_data(self, file):

        with open(file, encoding='utf-8-sig') as f:
            allData = {}
            oneSentence = []
            i=0
            for j, line in enumerate(f):         
                if j==i:
                    sentence = line.strip()
                    oneSentence.append(sentence)
                elif j==i+1:
                    treudeResult = line.strip()
                    treudeResults = re.findall(r'\{(.*?)\}', treudeResult)
                    treudeResultList = []
                    for oneResult in treudeResults:
                        oneResultFormatted = re.findall(r'\[(.*?)\]', oneResult)
                        treudeResultList.append(oneResultFormatted)
                    oneSentence.append(treudeResultList)
                if j % 2 == 1:
                    allData[oneSentence[0]] = oneSentence[1]
                    oneSentence = []
                    i+=2                    
                
        return allData

    # Returns the stem of the word provided as input
    def stem(self, word):   
        return PorterStemmer().stem(word)
       
    # Returns the lemmatization of the word provided as input
    def lemma(self, word): 
        return WordNetLemmatizer().lemmatize(word)

    # Removes stopwords from a list of words
    def remove_stopwords(self, wordlist):
        
        stopWords = set(stopwords.words('english'))
        filteredWordList = []
        for word in wordlist:
            if word not in stopWords:
                filteredWordList.append(word)
                
        return filteredWordList
                
    # Returns a list of unique words that appear in the textual data provided as input
    def create_wordbank(self, data):
        wordBank = []
        for x in data.values():
            if(len(x)>0):
                for result in x:
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

    # Check whether a specific word is contained in a list of words (wordbank)
    def matchWordToWordBank(self, word, wordBank):
        word = word.lower()
        word = self.lemma(word)
        word = self.stem(word)

        if word in wordBank:
            return True
        else:
            return False
            
    # Returns the cluster of a specific word, i.e. all sentences that have task phrases containing this specific word
    def findWordClusters(self, wordToMatch, treudeData, sentenceToCluster):

        wordToMatch = wordToMatch.lower()
        wordToMatch = self.lemma(wordToMatch)
        wordToMatch = self.stem(wordToMatch)
        
        cluster = []
        for result in treudeData:
            sentence = result
            if sentence != sentenceToCluster: #We don't want the sentence itself to be a result
                treudeValues = treudeData[result]
                for results in treudeValues:
                    for words in results:
                        words = words.split(' ')
                        words = list(set(words))
                        for word in words:
                            word = word.lower()
                            word = self.lemma(word)
                            word = self.stem(word)
                            if word == wordToMatch:
                                cluster.append(sentence)

        cluster = list(set(cluster)) #removing duplicates
        
        finalCluster = []
        for sentence in cluster:
            finalCluster.append({'sentence':sentence, 'type':''})

        return finalCluster
        
    # Returns a list of clusters for the sentence provided as input
    def findSentenceClusters(self, sentence, treudeData, wordBank):
        
        treudeValues = treudeData[sentence]   
        wordsToCluster = []
        for value in treudeValues:
            for words in value:
                words = words.split(' ')
                for word in words:
                    if self.matchWordToWordBank(word, wordBank):
                        wordsToCluster.append(word)                        
        wordsToCluster = list(set(wordsToCluster))
        wordClusters = []
        for word in wordsToCluster:
            cluster = self.findWordClusters(word, treudeData, sentence)
            wordCluster = {"word": word, "cluster": cluster}    
            wordClusters.append(wordCluster)
            
        sentenceClusters = {"sentence": sentence, "clusters": wordClusters}
        
        return sentenceClusters

    # Retrieves sentences' task phrases
    # Creates a list of unique words from the task phrases
    # Returns a list of clusters for the sentence provided as input
    def getCategoryOfSentence(self, sentence):
        TreudeData = self.read_data('TreudeData.txt')
        wordBank = self.create_wordbank(TreudeData)    
        sentenceClusters = self.findSentenceClusters(sentence, TreudeData, wordBank)
        
        return sentenceClusters['clusters']

          

                
                
                
                
                
                
                