# -*- coding: utf-8 -*-
"""
Created on Mon Feb 18 10:00:19 2019

@author: Lenovo
"""
import numpy as np
import string
from copy import deepcopy


from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split, cross_val_score

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
 
from sklearn.svm import LinearSVC
from sklearn.linear_model import SGDClassifier, LogisticRegression
from sklearn.naive_bayes import BernoulliNB
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.neighbors import KNeighborsClassifier, NearestCentroid

def read_data(file):
    """
    Reads data from a CSV file
    Input: file (string) - path to the file to read from 
    Returns: data from the CSV file
    """
    
    X = []
    Y = []
    Z = []
    T = []
    R = []
    with open(file, encoding='utf-8-sig') as f:
        for line in f:
            data = line.strip().split('|')
         
            X.append(data[0])
            Y.append(data[1])
            Z.append(data[2])
            T.append(data[3])
            R.append(data[3])
            
    return X, Y, Z, T, R

def stem(sentence):
    """
    Finds the stem of a sentence
    Inputs: sentence (string) - sentence to stem
    Returns: stem of a sentence
    """
    
    token_words = word_tokenize(sentence)
    stem_sentence=[]
    for word in token_words:
        stem_sentence.append(PorterStemmer().stem(word))
        stem_sentence.append(" ")
   
    return "".join(stem_sentence)


def lemma(sentence):
    """
    Finds the lemma of a sentence
    Inputs: sentence (string) - sentence to lemmatise
    Returns: lemma of a sentence
    """
    
    token_words = word_tokenize(sentence)
    lemma_sentence = []    
    for word in token_words:
        lemma_sentence.append(WordNetLemmatizer().lemmatize(word))
        lemma_sentence.append(" ")
    return "".join(lemma_sentence)

 
def is_digit(word):
    """
    Checks wether a word is a digit
    Inputs: word (string) - word to check
    Returns: True or False
    """
    
    try:
        int(word)
        return True
    except ValueError:
        return False


def remove_digits(sentence):
    """
    removes digits from a sentence
    Inputs: sentence (string) - sentence to change
    Returns: the sentence without digits
    """
    
    token_words = word_tokenize(sentence)
    digitless_sentence =  []
    for word in token_words:
        if not is_digit(word):
            digitless_sentence.append(word)
            digitless_sentence.append(" ")
    
    return "".join(digitless_sentence)


def remove_punctuations(sentence):
    """
    Removes stopwords from a sentence
    Inputs: sentence (string) - sentence to change
    Returns: sentence without stopwords
    """
    sentence = sentence.translate(str.maketrans("","", string.punctuation))
    return sentence

##TRAINED ON ALL RELEVANT LEVEL DATA, BUT ONLY VALIDATED ON THE TEST+VALIDATION DATA FROM LEVEL 1
def second_level_classifier(X, XNoNPL, Y, Z, Ypred, Xvalidate, XvalidateNoNPL, Yvalidate, Zvalidate, level): ## REMOVE Y FROM INPUT LIST - it's not used
    """
    Trains a classifier to classify the sub-categories of "Development process"
    Inputs: X: all sentences to train on
            XNoNPL: orignial sentences, no NPL has been applied to them
            Y: true 1st level labels of the sentences used for training
            Z: true 2nd level labels of the sentences used for training
            Ypred: 1st level label prediction of validation data
            Xvalidate: sentences to predict
            XvalidateNoNPL: original sentences to predict, no NPL has been applied to them
            Yvalidate: 1st level true labels of validation data
            Zvalidate: labels to predict
            level: indicates which sub-level we are working with, e.g. "requirements", "system", etc
    Returns: 
    """

    sentences = []; Xval = []; XvalNoNPL = []; Yval = []; Zval = []
       
    for i, label in enumerate(Ypred):
        if(Ypred[i]==Yvalidate[i]):           #Exclude sentences from validation data that have been misclassified
            if(label == level):
                sentences.append(i)    

    #Create the relevant data using the pos numbers from sentences.
    for sent in sentences:
        Xval.append(Xvalidate[sent])
        XvalNoNPL.append(XvalidateNoNPL[sent])
        Yval.append(Yvalidate[sent])
        Zval.append(Zvalidate[sent])
    
    Xtrain, Xtest, XtrainNoNPL, XtestNoNPL, Ztrain, Ztest = train_test_split(X, XNoNPL, Z, test_size=0.25, random_state=42)
    
    print('')
    print("---------- REQUIREMENT ANALYSIS CLASSIFIER ----------")
    print('')
    print('Number of training instances: ', len(Xtrain))
    print('Number of testing instances: ', len(Xtest))
    print('Number of validation instances: ', len(Xval))
    print('')
    pipeline = make_pipeline(
            TfidfVectorizer(max_features=500, analyzer='word', lowercase=True, ngram_range=(1,2),
                        norm='l2', sublinear_tf=True),
            ##REQUIREMENTS##
            #BernoulliNB(alpha=5, binarize=0, fit_prior=True, class_prior=None)           
            #ExtraTreesClassifier(max_features=100, class_weight='balanced',min_impurity_split=0.7, random_state=42)
            #KNeighborsClassifier(n_neighbors=40)
            LinearSVC(C=0.05, class_weight='balanced', dual=True, fit_intercept=True,intercept_scaling=1, loss='hinge', multi_class='ovr', penalty='l2', tol=1e-05)
            #LogisticRegression(n_jobs=1, multi_class='multinomial', class_weight='balanced', solver='lbfgs', C=0.01, penalty='l2')
            #NearestCentroid()
            #RandomForestClassifier(class_weight='balanced',min_impurity_split=0.7, max_depth=7, random_state=42 )
            #SGDClassifier(alpha=5, loss="log", penalty="l2", class_weight='balanced', n_iter_no_change=3,early_stopping=True, random_state=42)
    )
            
    print('CROSS VALIDATION:')
    
    scores = cross_val_score(pipeline, Xtrain+Xtest+Xval, Ztrain+Ztest+Zval, cv=5)
    print(scores)
    print(np.average(scores))
    
    pipeline.fit(Xtrain, Ztrain)
    Zpred = pipeline.predict(Xtest)    
    ZtrainPred = pipeline.predict(Xtrain)
    valPred = pipeline.predict(Xval)
    print('')
    print('%s train accuracy: ' %level, accuracy_score(Ztrain,ZtrainPred ))    
    print('%s test accuracy: ' %level, accuracy_score(Ztest, Zpred))    
    print('%s validation accuracy: ' %level, accuracy_score(Zval, valPred))    
    print('')
    
    labels=['use case','r-general', 'functionality & behaviour', 'non-functional', 'feature']
    
    print('Total precision & recall (validation):')
    print(precision_recall_fscore_support(Zval, valPred, average='weighted'))
    
    pre_rec = precision_recall_fscore_support(Zval, valPred, average=None, labels=labels)
    
    print('')
    print('')    
    print('CATEGORY ACCURACY:')
    print('')
    for i, thing in enumerate(labels):
        print(thing, '(precision - recall - fscore - #samples)')
        for j, thingy in enumerate(pre_rec):
            print(thingy[i])
        print('')    
            

def categorySplitLevel1(trueLabel, predLabel):
    """
    Separates true and predicted labels for level 1 categories, based on true value. 
    This is done so it's possible to calculate the prediciton accuracy of each category
    Inputs: trueLabel (List) - a list of true labels 
            predLabel (List) - a list of predictions
    Returns: Lists of true labels and predicted labels for each of the level 1 categories 
    """
    
    requirementTrue = []
    requirementPred = []
    systemTrue = []
    systemPred = []
    domainTrue = []
    domainPred = []
    devProcessTrue = []
    devProcessPred = []
    docOrgTrue = []
    docOrgPred = []
    uncertainTrue = []
    uncertainPred = []
    nonInformationTrue = []
    nonInformationPred = []
    
    for i, cat in enumerate(trueLabel):
        if cat == 'requirement': 
            requirementTrue.append(trueLabel[i])
            requirementPred.append(predLabel[i])
        elif cat == 'system':
            systemTrue.append(trueLabel[i])
            systemPred.append(predLabel[i])
        elif cat == 'domain':
            domainTrue.append(trueLabel[i])
            domainPred.append(predLabel[i])
        elif cat == 'development process':
            devProcessTrue.append(trueLabel[i])
            devProcessPred.append(predLabel[i])
        elif cat == 'document organisation':
            docOrgTrue.append(trueLabel[i])
            docOrgPred.append(predLabel[i])
        elif cat == 'uncertain':
            uncertainTrue.append(trueLabel[i])
            uncertainPred.append(predLabel[i])
        elif cat == 'non-information':
            nonInformationTrue.append(trueLabel[i])
            nonInformationPred.append(predLabel[i])
            
    return requirementTrue, requirementPred, systemTrue, systemPred, domainTrue, domainPred, devProcessTrue, devProcessPred, docOrgTrue, docOrgPred, uncertainTrue, uncertainPred, nonInformationTrue, nonInformationPred


def get_relevant_section(labels, section):
    """
    Finds the locations of the "section" instances, in the list of labels
    Inputs: labels (List) - a list of labels 
            section (string) - section (category) we are looking for
    Returns: a list of locations
    """
    
    locations=[]
    for i, label in enumerate(labels):
      if label == section:
          locations.append(i)
          
    return locations
    
        
def train_classifier():
    """
    Trains the 1st level classifier
    Inputs: 
    Returns:
    """
    
    X, Y, Z, T, R = read_data('../../CSV Data/FinalData.csv')   
        
    XtrainNoNPL, XtestNoNPL, Ytrain, Ytest, Ztrain, Ztest, Ttrain, Ttest, Rtrain, Rtest = train_test_split(X, Y, Z, T, R, test_size=0.25, random_state=42)
    XtrainNoNPL, XvalNoNPL, Ytrain, Yval, Ztrain, Zval, Ttrain, Tval, Rtrain, Rval = train_test_split(XtrainNoNPL, Ytrain, Ztrain, Ttrain, Rtrain, test_size=0.1, random_state=42)
    stopWords = set(stopwords.words('english'))
    
    Xtrain = deepcopy(XtrainNoNPL)
    Xtest = deepcopy(XtestNoNPL)
    Xval = deepcopy(XvalNoNPL)
    
    for pos, sentence in enumerate(Xtrain):
        sentence = lemma(sentence)
        sentence = stem(sentence)
        sentence = remove_punctuations(sentence)
        sentence = remove_digits(sentence)
        Xtrain[pos] = sentence
    
    for pos, sentence in enumerate(Xtest):
        sentence = lemma(sentence)
        sentence = stem(sentence)
        sentence = remove_punctuations(sentence)
        sentence = remove_digits(sentence)
        Xtest[pos] = sentence
        
    for pos, sentence in enumerate(Xval):
        sentence = lemma(sentence)
        sentence = stem(sentence)
        sentence = remove_punctuations(sentence)
        sentence = remove_digits(sentence)
        Xval[pos] = sentence
 
    pipeline = make_pipeline(
        TfidfVectorizer(stop_words=stopWords, max_features=500, analyzer='word', lowercase=True, ngram_range=(1,2),
                        norm='l2', sublinear_tf=True),
        #BernoulliNB(alpha=1, binarize=0, fit_prior=True, class_prior=None)                
        #ExtraTreesClassifier(max_features=500, class_weight='balanced',min_impurity_split=0.8)
        #KNeighborsClassifier(n_neighbors=100)
        LinearSVC(C=0.01, class_weight='balanced', dual=True, fit_intercept=True,intercept_scaling=1, loss='squared_hinge', max_iter=500, multi_class='ovr', penalty='l2', tol=1e-05)
        #LogisticRegression(n_jobs=1, multi_class='multinomial', class_weight='balanced', solver='lbfgs', C=0.1, penalty='l2')
        #NearestCentroid()
        #RandomForestClassifier(class_weight='balanced',min_impurity_split=0, max_depth=4, random_state=0 )
        #SGDClassifier(alpha=0.01, loss="log", penalty="l2", class_weight='balanced', n_iter_no_change=3,early_stopping=True)
    )
    print('')   
    print("---------- 1ST LEVEL CLASSIFIER ----------")
    print('')
    print('CROSS VALIDATION:')
    scores = cross_val_score(pipeline, Xtrain+Xtest+Xval, Ytrain+Ytest+Yval, cv=5)
    print(scores)
    print(np.average(scores))

    pipeline.fit(Xtrain, Ytrain)
    YtrainPred = pipeline.predict(Xtrain)
    Yprediction = pipeline.predict(Xtest)
    valPred = pipeline.predict(Xval)
    print('')
    print('Train Accuracy: ', accuracy_score(Ytrain, YtrainPred))    
    print('Test Accuracy: ', accuracy_score(Ytest, Yprediction))    
    print('Validation accuracy: ', accuracy_score(Yval, valPred))    
    print('')  
    
    labels=['requirement','system','domain','development process',
            'document organisation','uncertain','non-information']
    
    print('Total precision & recall (validation):')
    print(precision_recall_fscore_support(Yval, valPred, average='weighted'))
    
    pre_rec = precision_recall_fscore_support(Yval, valPred, average=None, labels=labels)

    print('')
    print('')
    print('CATEGORY ACCURACY:')
    print('')
    for i, thing in enumerate(labels):
        print(thing, '(precision - recall - fscore - #samples)')
        for j, thingy in enumerate(pre_rec):
            print(thingy[i])
        print('')
    
    trainLocations = get_relevant_section(Ytrain, 'requirement')
    testLocations = get_relevant_section(Ytest, 'requirement')
    valLocations = get_relevant_section(Yval,'requirement')
    
    XtrainSection = []; XtrainNoNPLSection = []; YtrainSection = []; ZtrainSection = []
    XtestSection = []; XtestNoNPLSection = []; YtestSection = []; ZtestSection = []; YpredictionSection = []
    XvalSection = []; XvalNoNPLSection = []; YvalSection = []; ZvalSection = []; valPredSection = []
    for num in trainLocations:
        XtrainSection.append(Xtrain[num])
        XtrainNoNPLSection.append(XtrainNoNPL[num])
        YtrainSection.append(Ytrain[num])
        ZtrainSection.append(Ztrain[num])
    for num in testLocations:
        XtestSection.append(Xtest[num])
        XtestNoNPLSection.append(XtestNoNPL[num])
        YtestSection.append(Ytest[num])
        ZtestSection.append(Ztest[num])
        YpredictionSection.append(Yprediction[num])
        
    for num in valLocations:
        XvalSection.append(Xval[num])
        XvalNoNPLSection.append(XvalNoNPL[num])
        YvalSection.append(Yval[num])
        ZvalSection.append(Zval[num])
        valPredSection.append(valPred[num])
        
    second_level_classifier(XtrainSection+XtestSection, XtrainNoNPLSection+XtestNoNPLSection, YtrainSection+YtestSection, ZtrainSection+ZtestSection, valPredSection, XvalSection, XvalNoNPLSection, YvalSection, ZvalSection, 'requirement')
    
    
    
train_classifier()



    
    
    
    
    
    
    
    
    
    

