var baseURI = "http://www.semanticweb.org/masterThesisOntology#"

/**
 * Creates a d3 dagre graph that contains the results
 * Used in question 1 - What functionalities exist in the system?
 * @param {Array} sentences - List of sentences that are relevant to answer the user's question
 */
function createClusterGraphQuestion1(sentences){
    unhighlightAllSentences()
    features = ["Display product", "Purchase product", "User management"]
    filteredSentences = []
    
    //remove words that the user doesn't want to see
    buttons = document.getElementsByClassName("buttonForGraph")
    for(button of buttons){
        feature = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){
            for(sentence of sentences){
                if(sentence['feature'].toLowerCase().includes(feature.toLowerCase())){
                    filteredSentences.push(sentence)
                }
            }
        }
    }

    //find the groups that the user has chosen to see
    groups = []
    buttons = document.getElementsByClassName("groupButtonForGraph")
    for(button of buttons){
        group = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){groups.push(group)}
    }

    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 30, ranksep: 200, nodesep:10, rankdir: 'RL'})
    .setDefaultEdgeLabel(function() { return {}; });

    // Here we're setting the nodes
    g.setNode('requirementAnalysisGroup', {label: 'Requirement Analysis', clusterLabelPos: 'top', style: 'fill: #ffe6b3'});
    g.setNode('featureGroup', {label: 'Feature', clusterLabelPos: 'top', style: 'fill: #ffeecc'});
    
    for(let group of groups){
        g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ffeecc'}); 
        g.setParent(group, 'requirementAnalysisGroup'); 
        for(let sentence of filteredSentences){
        
            // create nodes, add them to their categories and create an edge to the feature
            if(sentence['type'].includes(group)){
                wrappedSentence = sentenceWrap(sentence['sentence'])
                g.setNode(sentence['sentence'], {label:wrappedSentence})
                highlightMatchingSentence(sentence['sentence'])
                
                g.setParent(sentence['sentence'], group)
                for(let feature of features){
                    if(sentence['feature'].toLowerCase().includes(feature.toLowerCase())){
                        g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo', curve: d3.curveBasis})
                    }
                }
            }
        }  
    }

    g.setParent('featureGroup', 'requirementAnalysisGroup');

    //Set the feature nodes
    for(let feature of features){
        g.setNode(feature, {label: feature})
        g.setParent(feature, 'featureGroup')

    }
    // Rounding edges of all entity nodes
    g.nodes().forEach(function(v) {
        var node = g.node(v);
        node.rx = 5
        node.ry = 5
    });

    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("#interactive_diagram_svg").append("svg"),
    svgGroup = svg.append("g");   

    // Set up zoom support
    var zoom = d3.zoom()
    .on("zoom", function() {
        svgGroup.attr("transform", d3.event.transform);
    });
    
    //Disable double click zoom
    svg.call(zoom).on("dblclick.zoom", null);

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

    //scaleDiagram()

    //Clicking sentences will take you to the relevant place in the document
    $(document).ready(function() {
        $('.node').click(function() {
      
          // This gets the node name from the 'class' attribute
          var class_header = $(this).attr('class').split(' ');
          var node_name = class_header[class_header.length - 1]
          buttonText = d3.select(this).node().childNodes[1].childNodes[0].textContent

          // Execute your function
          searchMatchingSentence(buttonText)
          
      
        })
    })
}


/**
 * Creates a d3 dagre graph that contains the results
 * Used in question 2 - What functionalities does this feature provide
 * @param {Array} relevantSentences - List of sentences that are relevant to answer the user's question
 * @param {string} feature - The feature chosen by the user
 */
function createClusterGraphQuestion2(relevantSentences, feature){
    unhighlightAllSentences()

    filteredSentences = []
    groups = []    
    buttons = document.getElementsByClassName("groupButtonForGraph")
    
    //remove sentences that belong to the categories that the user doesn't want to see
    for(button of buttons){
        group = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){
            groups.push(group)
            for(sentence of relevantSentences){
                if(sentence['type'].replace(baseURI,'').includes(group)){
                    filteredSentences.push(sentence)
                }
            }
        }
    }
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 30, ranksep: 200, nodesep:10, rankdir: 'RL'})
    .setDefaultEdgeLabel(function() { return {}; });

    // Create the requirementAnalysis and feature categories
    g.setNode('requirementAnalysisGroup', {label: 'Requirement Analysis', clusterLabelPos: 'top', style: 'fill: #ffe6b3'});
    g.setNode('featureGroup', {label: 'Feature', clusterLabelPos: 'top', style: 'fill: #ffeecc'});


    for(let group of groups){
        g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ffeecc'}); 
        g.setParent(group, 'requirementAnalysisGroup'); 
        for(let sentence of filteredSentences){
        
            // create nodes, add them to their categories and createa an edge to the feature
            if(sentence['type'].includes(group)){
                wrappedSentence = sentenceWrap(sentence['sentence'])
                g.setNode(sentence['sentence'], {label:wrappedSentence})
                g.setParent(sentence['sentence'], group)
                g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo', curve: d3.curveBasis})
                
                highlightMatchingSentence(sentence['sentence'])
            }
        }  
    }

    // Set the parents to define which nodes belong to which cluster
    g.setParent('featureGroup', 'requirementAnalysisGroup');
    
    //Set the feature node
    g.setNode(feature, {label: feature})
    g.setParent(feature, 'featureGroup')
    

    g.nodes().forEach(function(v) {
        var node = g.node(v);
        // Round the corners of the nodes
        node.rx = node.ry = 5;
    });
    
    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("#interactive_diagram_svg").append("svg"),
    svgGroup = svg.append("g");

    // Set up zoom support
    var zoom = d3.zoom()
    .on("zoom", function() {
        svgGroup.attr("transform", d3.event.transform);
    });
    
    //Disable double click zoom
    svg.call(zoom).on("dblclick.zoom", null);


    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

    //scaleDiagram()

    d3.selectAll("svg g .output .nodes .node")

    //Clicking sentences will take you to the relevant place in the document
    $(document).ready(function() {
        $('.node').click(function() {

            //Make the sentences of the graph clickable
            var class_header = $(this).attr('class').split(' ');
            var node_name = class_header[class_header.length - 1]
            buttonText = d3.select(this).node().childNodes[1].childNodes[0].textContent

            //Find matching sentence in the documentation text
            searchMatchingSentence(buttonText)
        })
      })
}

/**
 * Creates a d3 dagre graph that contains the results
 * Used for all questions 3 - 14
 * @param {Array} wordClusters - the relevant information needed to create the graph
 */
function createClusterGraphTreudeQuestions(wordClusters){
    unhighlightAllSentences()
    filteredWordClusters = []
    buttons = document.getElementsByClassName("buttonForGraph")
    //remove words that the user doesn't want to see - (filtered by word)
    for(button of buttons){
        word = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){
            for(wordCluster in wordClusters){
                if(wordClusters[wordCluster]['word'] == word){
                    filteredWordClusters.push(wordClusters[wordCluster])
                }
            }
        }
    }
    
    //remove groups that the user doesn't want to see - (filtered by group)
    groupsTest = []
    buttons = document.getElementsByClassName("groupButtonForGraph")
    for(button of buttons){        
        group = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){groupsTest.push(group)}
    }
    

    //Find relevant groups that need to be created
    let groups = new Array()
    for(let wordCluster of filteredWordClusters){
        for (let cluster of wordCluster['cluster']){
            type = cluster['type'].replace(baseURI,'');
            groups.push(type)
         }
    }
    groups = [...new Set(groups)]

    //create an array that contains the groups that the wordGroup and categoryGroup have in common
    commonGroups = groups.filter(value => groupsTest.includes(value))

    //check if the requirement has any related sentences in the chosen categories
    if(commonGroups.length == 0){
        noMatchingSentences = 'This requirement has no matching sentences in the chosen categories.'
        jQuery("#interactive_diagram_svg").append(noMatchingSentences)
    }
    else{
        // Create the input graph
        var g = new dagreD3.graphlib.Graph({compound:true})
        .setGraph({edgesep: 30, ranksep: 200, nodesep:10, rankdir: 'LR'})
        .setDefaultEdgeLabel(function() { return {}; });

        //Create super-groups
        if(commonGroups.includes('Stakeholder')){
            //create Domain super-group
            g.setNode('Domain', {label: 'Domain', clusterLabelPos: 'top', style: 'fill: #e6e6e6'});
        }

        if(commonGroups.includes('UseCase') || commonGroups.includes('FunctionalRequirementAndBehaviour') || commonGroups.includes('NonFunctionalRequirementAndBehaviour') || commonGroups.includes('RequirementGeneral') || commonGroups.includes('Feature')){
            g.setNode('Requirements Analysis', {label: 'Requirements Analysis', clusterLabelPos: 'top', style: 'fill: #ffe6b3'});
        }
        
        if(commonGroups.includes('S-Architecture') || commonGroups.includes('S-TechnologySolution') || commonGroups.includes('S-SourceCode') || commonGroups.includes('B-TechnologySolution') || commonGroups.includes('B-General') || commonGroups.includes('D-Architecture') || commonGroups.includes('U-Architecture') || commonGroups.includes('U-Implementation') ){
            //create system super-group
            g.setNode('System', {label: 'System', clusterLabelPos: 'top', style: 'fill: #bcc4dc'});

            if(commonGroups.includes('S-Architecture') || commonGroups.includes('S-TechnologySolution') || commonGroups.includes('S-SourceCode')){
                //Create Structure sub-super-group
                g.setNode('Structure', {label: 'Structure', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
                g.setParent('Structure', 'System');

                if(commonGroups.includes('S-TechnologySolution') || commonGroups.includes('S-SourceCode')){
                    //Create Structure - Implementation sub-super-group
                    g.setNode('S-Implementation', {label: 'Implementation', clusterLabelPos: 'top', style: 'fill: #dde1ee'});
                    g.setParent('S-Implementation', 'Structure');
                }
            }

            if(commonGroups.includes('B-TechnologySolution') || commonGroups.includes('B-General')){
                //Create Behaviour - Implementation sub-super-group
                g.setNode('Behaviour', {label: 'Behaviour', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
                g.setParent('Behaviour', 'System');
                g.setNode('B-Implementation', {label: 'Implementation', clusterLabelPos: 'top', style: 'fill: #dde1ee'});
                g.setParent('B-Implementation', 'Behaviour');
            }
            if(commonGroups.includes('D-Architecture') ){
                //Create Data sub-super-group
                g.setNode('Data', {label: 'Data', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
                g.setParent('Data', 'System');
            }
            if(commonGroups.includes('U-Architecture') || commonGroups.includes('U-Implementation')){
                //Create UI sub-super-groups
                g.setNode('UI Design', {label: 'UI Design', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
                g.setParent('UI Design', 'System');
            }
            
        }

        if(commonGroups.includes('DevelopmentPractice') || commonGroups.includes('Testing') || commonGroups.includes('Risk') || commonGroups.includes('Issue')){
            //create devProcess super-group
            g.setNode('Development Process', {label: 'Development Process', clusterLabelPos: 'top', style: 'fill: #e0b3ff'});
            
            if(commonGroups.includes('Testing') || commonGroups.includes('Risk') || commonGroups.includes('Issue')){
                //Create QA sub-super-group
                g.setNode('Quality Assurance', {label: 'Quality Assurance', clusterLabelPos: 'top', style: 'fill: #ebccff'});
                g.setParent('Quality Assurance', 'Development Process');
            }
        }

        //create the groups
        for(let group of commonGroups){

            if(group == 'Stakeholder'){
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #f2f2f2'});
                g.setParent(group, 'Domain');
            }

            else if(group == 'UseCase' || group == 'FunctionalRequirementAndBehaviour' || group == 'NonFunctionalRequirementAndBehaviour' || group == 'RequirementGeneral' || group == 'Feature'){
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ffeecc'});
                g.setParent(group, 'Requirements Analysis');
            }else if( group == 'UserStory'){
                //Do nothing
            }
            
            else if (group == 'S-Architecture'){            
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #dde1ee'});
                g.setParent(group, 'Structure');
            }else if (group == 'S-TechnologySolution' || group == 'S-SourceCode'){            
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #eef0f6'});
                g.setParent(group, 'S-Implementation');
            }else if (group == 'B-TechnologySolution' || group == 'B-General'){
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #eef0f6'});
                g.setParent(group, 'B-Implementation');
            }else if (group == 'D-Architecture'){
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #dde1ee'});
                g.setParent(group, 'Data');
            }else if (group == 'U-Architecture' || group == 'U-Implementation'){
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #dde1ee'});
                g.setParent(group, 'UI Design');
            }

            else if (group == 'DevelopmentPractice' ){
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ebccff'});
                g.setParent(group, 'Development Process');
            }else if (group == 'Testing'|| group == 'Risk' || group == 'Issue'){
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #f5e6ff'});
                g.setParent(group, 'Quality Assurance');
            }
            
            else{
                g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ffffe6'});
            }
        }

        //create nodes for the wordClusters
        for(let wordCluster of filteredWordClusters){
            g.setNode(wordCluster['word'], {label: wordCluster['word']})
        }

        for(let group of commonGroups){
            if(group != 'UserStory'){
                //Add sentences as node and append to their clusterWords
                for(let wordCluster of filteredWordClusters){
                    for (let cluster of wordCluster['cluster']){
                        if(!(group == 'FunctionalRequirementAndBehaviour' && cluster['sentence'].startsWith('As a ')) && !(group == 'NonFunctionalRequirementAndBehaviour' && cluster['sentence'].startsWith('As a '))){
                            if(cluster['type'].replace(baseURI,'') == group){
                                wrappedSentence = sentenceWrap(cluster['sentence'])
                                g.setNode(cluster['sentence'], {label: wrappedSentence})
        
                                //append to its group
                                type = cluster['type'].replace(baseURI,'')
                                g.setParent(cluster['sentence'], type);
        
                                //create edge to cluster
                                g.setEdge( wordCluster['word'], cluster['sentence'], {curve: d3.curveBasis})

                                highlightMatchingSentence(cluster['sentence'])             
                            }
                        }            
                    }
                }
            }
        }

        //userStory handling
        if(commonGroups.includes('UserStory')){
            userStorySentences = []
            //Find if it should be included in func.req, non-func.req. or both
            for(let wordCluster of filteredWordClusters){
                for (let cluster of wordCluster['cluster']){
                    if(cluster['type'].replace(baseURI,'') == 'UserStory'){
                        for(clusterToMatch of wordCluster['cluster']){
                            if(clusterToMatch['sentence'] == cluster['sentence'] && clusterToMatch['type'].replace(baseURI,'') != 'UserStory'){
                                clusterToMatch.edge = wordCluster['word']
                                userStorySentences.push(clusterToMatch)
                            }
                        }
                    }        
                }   
            }

            for(sentence of userStorySentences){
                if(sentence['type'].replace(baseURI,'') == 'NonFunctionalRequirementAndBehaviour' && commonGroups.includes('NonFunctionalRequirementAndBehaviour')){
                    g.setNode('UserStoryFunc', {label: 'UserStory', clusterLabelPos: 'top', style: 'fill: #fff7e6'});
                    g.setParent('UserStoryFunc', 'NonFunctionalRequirementAndBehaviour');
                    
                    //create node
                    wrappedSentence = sentenceWrap(sentence['sentence'])
                    g.setNode(sentence['sentence'],{label: wrappedSentence})
                    g.setParent(sentence['sentence'], 'UserStoryFunc');
                    g.setEdge( sentence['edge'], sentence['sentence'], {curve: d3.curveBasis})

                    highlightMatchingSentence(sentence['sentence'])
                }
                else if (sentence['type'].replace(baseURI,'') == 'FunctionalRequirementAndBehaviour'  && commonGroups.includes('FunctionalRequirementAndBehaviour')){
                    g.setNode('UserStoryNonFunc', {label: 'UserStory', clusterLabelPos: 'top', style: 'fill: #fff7e6'});
                    g.setParent('UserStoryNonFunc', 'FunctionalRequirementAndBehaviour');
                    
                    //create node
                    wrappedSentence = sentenceWrap(sentence['sentence'])
                    g.setNode(sentence['sentence'],{label: wrappedSentence})
                    g.setParent(sentence['sentence'], 'UserStoryNonFunc');
                    g.setEdge( sentence['edge'], sentence['sentence'], {curve: d3.curveBasis})

                    highlightMatchingSentence(sentence['sentence'])
                }
            }
        }

        g.nodes().forEach(function(v) {
        var node = g.node(v);
        // Round the corners of the nodes
        node.rx = node.ry = 5;
        });

        // Create the renderer
        var render = new dagreD3.render();

        // Set up an SVG group so that we can translate the final graph.
        var svg = d3.select("#interactive_diagram_svg").append("svg"),
        svgGroup = svg.append("g");

        // Set up zoom support
        var zoom = d3.zoom()
        .on("zoom", function() {
            svgGroup.attr("transform", d3.event.transform);
        });
        
        //Disable double click zoom
        svg.call(zoom).on("dblclick.zoom", null);

        // Run the renderer. This is what draws the final graph.
        render(d3.select("svg g"), g);
    }
    
    //scaleDiagram()

    //Clicking sentences will take you to the relevant place in the document
    $(document).ready(function() {
        $('.node').click(function() {
      
          // This gets the node name from the 'class' attribute
          var class_header = $(this).attr('class').split(' ');
          var node_name = class_header[class_header.length - 1]
          buttonText = d3.select(this).node().childNodes[1].childNodes[0].textContent

          // Execute your function
          searchMatchingSentence(buttonText)
        })
    })
}