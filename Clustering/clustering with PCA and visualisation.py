# -*- coding: utf-8 -*-
"""
Created on Tue Mar 12 09:16:52 2019

@author: Helena Olafsdottir
"""

import string

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
from sklearn.decomposition import PCA

from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture


def get_requirements_data():
    """
    Filters the functional requirements, features and use cases from the CSV data
    Inputs: 
    Returns: Filtered data
    """
    
    X, Y, Z = read_data('../../CSV Data/FinalData.csv')
    
    reqs = []
    for i, label in enumerate(Z):
        if(label == 'functionality & behaviour' or label == 'use case' or label == 'feature'):
            reqs.append(i) 
    
    Xreq = []
    Yreq = []
    Zreq = []
    for value in reqs:
        Xreq.append(X[value])
        Yreq.append(Y[value])
        Zreq.append(Z[value])
   
    return Xreq, Yreq, Zreq

    
def read_data(file):
    """
    Reads data from a CSV file
    Input: file (string) - path to the file to read from 
    Returns: data from the CSV file
    """
    
    X = []
    Y = []
    Z = []
    with open(file, encoding='utf-8-sig') as f:
        for line in f:
            data = line.strip().split('|')
         
            X.append(data[0])
            Y.append(data[1])
            Z.append(data[2])
            
    return X, Y, Z


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
    Removes puncuations from a sentence
    Inputs: sentence (string) - sentence to change
    Returns: sentence without punctuations
    """
    
    sentence = sentence.translate(str.maketrans("","", string.punctuation))
    return sentence


def remove_stop_words(sentence):
    """
    Removes stopwords from a sentence
    Inputs: sentence (string) - sentence to change
    Returns: sentence without stopwords
    """
    
    stopWords = stopwords.words('english')
    token_words = word_tokenize(sentence)
    stop_words_removed = []
    for word in token_words:
        if word not in stopWords:
            stop_words_removed.append(word)
            stop_words_removed.append(" ")

    return "".join(stop_words_removed)


def clustering():
    """
    Clusters functional requirements and use cases into three clusters.
    Inputs: 
    Returns: 
    """
    
    Xi, Y, Z = get_requirements_data()
    
    stopWords = set(stopwords.words('english'))
    
    # ------------- NLP ------------- #    
    for pos, sentence in enumerate(Xi):
        sentence = remove_digits(sentence)
        sentence = remove_punctuations(sentence)
        sentence = remove_digits(sentence)
        Xi[pos] = sentence
        
    Z_1 = [0, 1,1,1,1,1,1,2,2,2,2,2,0,0,0,0,0,0,0,1,1,1,2,0,0,0,0,0,1,1,2,1,1,2,2,2,0,0,1,1,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,2,2,2,0,0,0,0,0,0,0,0,1,2,2,2,2,2,0,0,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    Z_2 = [1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 1, 0, 0, 2, 0, 0, 2, 2, 2, 1, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    Z_3 = [0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0, 0, 0, 0, 2, 2, 1, 2, 2, 1, 1, 1, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 0, 0, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    Z_4 = [2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 0, 1, 0, 0, 1, 1, 1, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 2, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    Z_5 = [2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 2, 2, 2, 2, 2, 1, 1, 0, 1, 1, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    Z_6 = [1, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 1, 1, 1, 1, 1, 2, 2, 0, 2, 2, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    
    true_k = 3
    random_state=649
    
    pipeline = make_pipeline(
         TfidfVectorizer(stop_words=stopWords, max_features=5500, analyzer='word', lowercase=True, ngram_range=(1,1)),
    )
    X = pipeline.fit_transform(Xi).todense()
    
    ## PCA ##
    pca = PCA(n_components=2, random_state=200).fit(X)
    data2D = pca.transform(X)   
    
    ## CLUSTERING ##
    kmFitted = KMeans(n_clusters=true_k, random_state=random_state).fit(data2D)
    km = KMeans(n_clusters=true_k, random_state=random_state).fit_predict(data2D)
    gm = GaussianMixture(n_components=true_k, random_state=random_state).fit(data2D).predict(data2D)
        
    
    ## EVALUATION ##
    mistake_km_0 = []
    mistake_km_1 = []
    mistake_km_2 = []
    mistake_gm_0 = []
    mistake_gm_1 = []
    mistake_gm_2 = []
    
    classification_colors_gm = ['None'] * len(Xi)
    classification_colors_km = ['None'] * len(Xi)
    for i, label in enumerate(gm):
        
        true_label_km = Z_4[i]
        pred_label_km = kmFitted.labels_[i]
        if true_label_km == 0:
            if(pred_label_km != 0): 
                mistake_km_0.append(Xi[i])
                classification_colors_km[i] = 'red'
        if true_label_km == 1:
            if(pred_label_km != 1): 
                mistake_km_1.append(Xi[i])
                classification_colors_km[i] = 'red'
        if true_label_km == 2:
            if(pred_label_km != 2): 
                mistake_km_2.append(Xi[i])
                classification_colors_km[i] = 'red'
        
        true_label_gm = Z_6[i]
        pred_label_gm = gm[i]
        if true_label_gm == 0: 
            if(pred_label_gm != 0): 
                mistake_gm_0.append(Xi[i])
                classification_colors_gm[i] = 'red'
        if true_label_gm == 1:
            if(pred_label_gm != 1): 
                mistake_gm_1.append(Xi[i])
                classification_colors_gm[i] = 'red'
        if true_label_gm == 2:
            if(pred_label_gm != 2): 
                mistake_gm_2.append(Xi[i])
                classification_colors_gm[i] = 'red'
        
    mistakes_km = mistake_km_0 + mistake_km_1 + mistake_km_2
    mistakes_gm = mistake_gm_0 + mistake_gm_1 + mistake_gm_2
    
    numMistakes_km = len(mistakes_km)
    numMistakes_gm = len(mistakes_gm)
    numDatapoints = len(Xi)
    
    print('')
    print('------ KM Accuracy ------')
    print('Mistakes: ', numMistakes_km)
    print('Datapoints: ', numDatapoints)
    print('Accuracy: ', (numDatapoints-numMistakes_km)/numDatapoints)
    
    print('Accuracy class 0 - Purchase Products: ', (Z_4.count(0)-len(mistake_km_0))/Z_4.count(0))
    print('Accuracy class 1 - Browse Products: ', (Z_4.count(1)-len(mistake_km_1))/Z_4.count(1))
    print('Accuracy class 2 - User Management: ', (Z_4.count(2)-len(mistake_km_2))/Z_4.count(2))
    
    print('')
    print('------ GM Accuracy ------')
    print('Mistakes: ', numMistakes_gm)
    print('Datapoints: ', numDatapoints)
    print('Accuracy: ', (numDatapoints-numMistakes_gm)/numDatapoints)
    
    print('Accuracy class 0 - Purchase Products: ', (Z_6.count(0)-len(mistake_gm_0))/Z_6.count(0))
    print('Accuracy class 1 - Browse Products: ', (Z_6.count(1)-len(mistake_gm_1))/Z_6.count(1))
    print('Accuracy class 2 - User Management: ', (Z_6.count(2)-len(mistake_gm_2))/Z_6.count(2))
    
    ## VISUALISATION ##
    #True values 
    figure(num=None, figsize=(8, 6), dpi=80)
    figure(figsize=(30,30))
    plt.title('Principal component analysis with feature labels')
    plt.scatter(data2D[:,0], data2D[:,1], c=Z_6, s=200)
    
    #Predicted values
    plt.figure(figsize=(35,15))
    plt.subplot(121, title='K-means clustering')
    plt.scatter(data2D[:,0], data2D[:,1], c=km, s=130, edgecolors=classification_colors_km) 
    plt.subplot(122, title='Gaussian mixture clustering')
    plt.scatter(data2D[:,0], data2D[:,1], c=gm, s=130, edgecolors=classification_colors_gm)

clustering()



