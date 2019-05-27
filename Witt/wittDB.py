# -*- coding: utf-8 -*-
"""
Created on Fri Apr 19 11:34:35 2019

@author: Lenovo
"""
import sqlite3



def read_category_data():
    conn = sqlite3.connect('witt.db')
        

    c = conn.cursor()

    categories = []
    rows = c.execute('SELECT * FROM Categories')
    for row in rows:
        categories.append(row)   
        #print(row)
            
        
    # Save (commit) the changes
    conn.commit()

    # We can also close the connection if we are done with it.
    # Just be sure any changes have been committed or they will be lost.
    conn.close()

    # for row in categories:
    #     print(row)
    return categories

def get_architecture_patterns():
    categories = read_category_data()

    patterns = []
    for row in categories:
        if(row[2] == 'pattern'):
            print(row)
            patterns.append(row[1])
            
    return patterns

    
    
        
        
            

