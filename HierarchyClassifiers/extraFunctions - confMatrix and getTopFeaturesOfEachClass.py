# -*- coding: utf-8 -*-
"""
Created on Sat Apr 27 23:23:28 2019

@author: Lenovo
"""


def show_conf_matrix(Ytest, Yprediction):
    cnf_matrix = confusion_matrix(Ytest, Yprediction, labels=['UI design','data','development','document organisation','issues','requirements','source code','testing','uncertain','use case'])
    
    print(cnf_matrix)
    # the ordering of the labels is gotten by running: print('labels: ', pipeline.classes_)
    labels=['UI design','data','development','document organisation','issues','requirements','source code','testing','uncertain','use case']
    
    pyplot.figure()
    pyplot.imshow(cnf_matrix, interpolation='nearest', cmap=pyplot.cm.Blues)
    pyplot.title('Confusion Matrix')
    pyplot.colorbar()
    tick_marks = np.arange(10)
    pyplot.xticks(tick_marks, labels,rotation=90)
    pyplot.yticks(tick_marks, labels)
    
    fmt = 'd'
    thresh = cnf_matrix.max() / 2.
    for i, j in itertools.product(range(cnf_matrix.shape[0]), range(cnf_matrix.shape[1])):
        pyplot.text(j, i, format(cnf_matrix[i, j], fmt),
                 horizontalalignment="center",
                 color="white" if cnf_matrix[i, j] > thresh else "black")
    
    pyplot.ylabel('True label')
    pyplot.xlabel('Predicted label')
    pyplot.tight_layout()

    pyplot.show()

def get_top_features_for_each_class(pipeline):
    labels=['UI design','data','development','document organisation','issues','requirements','source code','testing','uncertain','use case']
    classifier = pipeline.named_steps['logisticregression']
    vectorizer = pipeline.named_steps['countvectorizer']
    feature_names = vectorizer.get_feature_names()
    
    t = PrettyTable()
    
    print('')
    print('-- Top Features for each class --')
    top10s = []
    for i, label in enumerate(labels):
        top10 = np.argsort(classifier.coef_[i])[-10:]
        top10features = []
        for j in top10:
            top10features.insert(0,feature_names[j])
        top10s.append(top10features)
        t.add_column(label,top10features)
    print(t)