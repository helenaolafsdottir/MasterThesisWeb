# -*- coding: utf-8 -*-
"""
Created on Tue Apr  9 10:01:35 2019

@author: Helena Olafsdottir
"""
import re
from nltk.corpus import stopwords 
from nltk.stem import PorterStemmer 
from nltk.stem import WordNetLemmatizer
    
    
def read_data(file):

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



def stem(word):   
    return PorterStemmer().stem(word)
    

def lemma(word): 
    return WordNetLemmatizer().lemmatize(word)


def remove_stopwords(wordlist):
    
    stopWords = set(stopwords.words('english'))
    filteredWordList = []
    
    for word in wordlist:
        if word not in stopWords:
            filteredWordList.append(word)
            
    return filteredWordList
               

def create_wordbank(data):
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
                            word = lemma(word)
                            word = stem(word)
                            wordBank.append(word.lower())
    
    wordBank = set(wordBank)
    wordBank = remove_stopwords(wordBank)
    
    return wordBank



def matchWordToWordBank(word, wordBank):
    word = word.lower()
    word = lemma(word)
    word = stem(word)
    
    if word in wordBank:
        return True
    else:
        return False
        

def findWordClusters(wordToMatch):

    wordToMatch = wordToMatch.lower()
    wordToMatch = lemma(wordToMatch)
    wordToMatch = stem(wordToMatch)
    
    cluster = []
    
    for result in TreudeDataFormat2:
        sentence = result
        treudeValues = TreudeDataFormat2[result]
        for results in treudeValues:
            for words in results:
                words = words.split(' ')
                for word in words:
                    word = word.lower()
                    word = lemma(word)
                    word = stem(word)
                    if word == wordToMatch:
                        cluster.append(sentence)
                        
                        #print(sentence)
    
    return cluster
    
    
def findSentenceClusters(sentence):

    treudeValues = TreudeDataFormat2[sentence]
    
    
    wordsToCluster = []
    for value in treudeValues:
        for words in value:
            words = words.split(' ')
            for word in words:
                if matchWordToWordBank(word, wordBank):
                    wordsToCluster.append(word)
                    #5print('word in wordbank: ', word)
                      
                
    wordClusters = []
    for word in wordsToCluster:
        cluster = findWordClusters(word)
        wordCluster = {"word": word, "cluster": cluster}    
        wordClusters.append(wordCluster)
 
    
    sentenceClusters = {"sentence": sentence, "clusters": wordClusters}
    
    return sentenceClusters




TreudeData, TreudeDataFormat2 = read_data('TreudeData.txt')

#print(TreudeDataFormat2)
#for x in TreudeDataFormat2:
#    print(x)
#    print(len(TreudeDataFormat2[x]))
#    print(TreudeDataFormat2[x])
#    print('----------------------')

wordBank = create_wordbank(TreudeDataFormat2)    

#print(wordBank)
#print(len(wordBank))
 

#This needs to go into a for loop for a few sentences
sentenceClusters = findSentenceClusters("Finally, the third goal involves checking the payment or shipping status of the order, or any additional related information.")


#print(sentenceClusters)
print(sentenceClusters['sentence'])
for result in sentenceClusters['clusters']:
        print(result)
        print('')

def getCategoryOfSentence(sentence):
    print('')
    
    
    

                
                
                
                
                
                
                