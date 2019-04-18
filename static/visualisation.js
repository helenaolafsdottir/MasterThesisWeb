var baseURI = "http://www.semanticweb.org/masterThesisOntology#"

function scaleDiagram(){
    var self = this
    var svgBCR = d3.select('#interactive_diagram_svg').select('svg').node().getBoundingClientRect()

  
    svgBCR.width = svgBCR.width * 0.63
    
    var gBBox = d3.select('#interactive_diagram_svg').select('.output').node().getBBox()
    
    var widthScale = svgBCR.width / gBBox.width
    var heightScale = svgBCR.height / gBBox.height
    
    var abswidth = gBBox.width * widthScale - svgBCR.width
    var absheight = gBBox.height * widthScale - svgBCR.height

    if(absheight < abswidth){
        var heightDiff = svgBCR.height / widthScale - gBBox.height
        d3.select('#interactive_diagram_svg').select('.output')
        .style('transform','scale(' + widthScale + ') translate(' + 0 + 'px, '+ (heightDiff/2) +'px)')
    }else{
        var widthDiff = svgBCR.width / heightScale - gBBox.width
        d3.select('#interactive_diagram_svg').select('.output')
        .style('transform','scale(' + heightScale + ') translate(' + widthDiff/2 + 'px, '+ 0 +'px)')
    }
}

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
    console.log('buttons: ', buttons)
    for(button of buttons){
        console.log(button)
        group = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){groups.push(group)}
    }
    console.log('groups: ', groups)

    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 20, ranksep: 200, nodesep:10, rankdir: 'RL'})
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
                if(group=='UserStory'){
                    console.log('Found user story!')
                }
                g.setNode(sentence['sentence'], {label:sentence["sentence"]})
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

    

    // // Set up zoom support
    // var zoom = d3.zoom()
    // .on("zoom", function() {
    //     svgGroup.attr("transform", d3.event.transform);
    // });
    
    // //Disable double click zoom
    // svg.call(zoom).on("dblclick.zoom", null);

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

    // var gBBox = d3.select('#interactive_diagram_svg').select('.output').node().getBBox()
    // console.log(gBBox.height)
    
    // var svg = d3.select('SVG').node()
    // console.log(svg.innerHTML)
    // svg.append("style").height(gBBox.height)

    // scaleDiagram()

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

function searchMatchingSentence(sentence){
    text = d3.select('.results').node().childNodes
    console.log("sentence to match: ", sentence)
      
    for(textnodes of text){
        if(textnodes.tagName == 'H1' || textnodes.tagName == 'H2' || textnodes.tagName == 'H3' || textnodes.tagName == 'H4' || textnodes.tagName == 'H5'){
            if(textnodes.innerHTML == sentence){
                textnodes.setAttribute('id', sentence)
                window.location.hash = sentence;
            }
        }
        else{
            for(child of textnodes.childNodes){
                if(child.innerHTML == sentence){
                    console.log('matchin child: ', child)
                    child.setAttribute('id', sentence)
                    window.location.hash = sentence;
                }
            }
        }
    }
}


function unhighlightAllSentences(){
    text = d3.select('.results').node().childNodes
    for(textnodes of text){
        if(textnodes.tagName == 'H1' || textnodes.tagName == 'H2' || textnodes.tagName == 'H3' || textnodes.tagName == 'H4' || textnodes.tagName == 'H5'){
            if(textnodes.getAttribute("class") == 'highlighted'){
                jQuery(textnodes).removeClass('highlighted')
            }
        }
        else{
            for(child of textnodes.childNodes){
                if(child.getAttribute("class") == 'highlighted'){
                    jQuery(child).removeClass('highlighted')
                }
            }
        }
    }
}

function highlightMatchingSentence(sentence){
    text = d3.select('.results').node().childNodes
    for(textnodes of text){
        if(textnodes.tagName == 'H1' || textnodes.tagName == 'H2' || textnodes.tagName == 'H3' || textnodes.tagName == 'H4' || textnodes.tagName == 'H5'){
            if(textnodes.innerHTML == sentence){
                textnodes.setAttribute('class', 'highlighted');
            }
        }
        else{
            for(child of textnodes.childNodes){
                if(child.innerHTML == sentence){
                    child.setAttribute('class', 'highlighted');
                }
            }
        }
    }
}
//Question 2
function createClusterGraph(relevantSentences, feature){
    unhighlightAllSentences()
    //remove sentences that belong to the categories that the user doesn't want to see
    filteredSentences = []
    groups = []
    
    buttons = document.getElementsByClassName("groupButtonForGraph")
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
    console.log(groups)
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 20, ranksep: 200, nodesep:10, rankdir: 'RL'})
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
                g.setNode(sentence['sentence'], {label:sentence["sentence"]})
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
    
    
    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("#interactive_diagram_svg").append("svg"),
    svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

    d3.selectAll("svg g .output .nodes .node")

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


function createClusterGraphQuestion3(wordClusters, feature){
    unhighlightAllSentences()
    //remove words that the user doesn't want to see - (filtered by word)
    filteredWordClusters = []
    
    buttons = document.getElementsByClassName("buttonForGraph")
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
    //groups = []
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

    console.log('groups: ')
    console.log(groups)
    console.log('-----------')

    //create an array that contains the groups that the wordGroup and categoryGroup have in common
    commonGroups = groups.filter(value => groupsTest.includes(value))

    //check if the requirement has any related sentences in the chosen categories
    if(commonGroups.length == 0){
        noMatchingSentences = 'This requirement has no matching sentences in the chosen categories.'
        jQuery(".message").append(noMatchingSentences)
    }

    else{
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 20, ranksep: 200, nodesep:10, rankdir: 'LR'})
    .setDefaultEdgeLabel(function() { return {}; });

    //Create super-groups
    if(commonGroups.includes('Stakeholder')){
        //create Domain super-group
        g.setNode('Domain', {label: 'Domain', clusterLabelPos: 'top', style: 'fill: #e6e6e6'});
    }

    if(commonGroups.includes('UseCase') || commonGroups.includes('FunctionalRequirementAndBehaviour') || commonGroups.includes('NonFunctionalRequirementAndBehaviour') || commonGroups.includes('RequirementGeneral') || commonGroups.includes('Feature')){
        console.log('For some reason I want to create a Requirements Analysis node!')
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
        }
        else if( group == 'UserStory'){
            //Do nothing
        }
        // else if (group == 'UserStory'){
        //     if(commonGroups.includes('FunctionalRequirementAndBehaviour')){
        //         g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #fff7e6'});
        //         g.setParent(group, 'FunctionalRequirementAndBehaviour');
        //     }
        // }

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

                            g.setNode(cluster['sentence'], {label: cluster['sentence']})
    
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
        console.log("userStorySentences: ", userStorySentences)

        for(sentence of userStorySentences){
            if(sentence['type'].replace(baseURI,'') == 'NonFunctionalRequirementAndBehaviour' && commonGroups.includes('NonFunctionalRequirementAndBehaviour')){
                console.log('create nonfunc')
                g.setNode('UserStoryFunc', {label: 'UserStory', clusterLabelPos: 'top', style: 'fill: #fff7e6'});
                g.setParent('UserStoryFunc', 'NonFunctionalRequirementAndBehaviour');
                
                //create node
                g.setNode(sentence['sentence'],{label: sentence['sentence']})
                g.setParent(sentence['sentence'], 'UserStoryFunc');
                g.setEdge( sentence['edge'], sentence['sentence'], {curve: d3.curveBasis})

                highlightMatchingSentence(sentence['sentence'])
            }
            else if (sentence['type'].replace(baseURI,'') == 'FunctionalRequirementAndBehaviour'  && commonGroups.includes('FunctionalRequirementAndBehaviour')){
                g.setNode('UserStoryNonFunc', {label: 'UserStory', clusterLabelPos: 'top', style: 'fill: #fff7e6'});
                g.setParent('UserStoryNonFunc', 'FunctionalRequirementAndBehaviour');
                
                //create node
                g.setNode(sentence['sentence'],{label: sentence['sentence']})
                g.setParent(sentence['sentence'], 'UserStoryNonFunc');
                g.setEdge( sentence['edge'], sentence['sentence'], {curve: d3.curveBasis})

                highlightMatchingSentence(sentence['sentence'])
            }
        }
    }



    g.nodes().forEach(function(v) {
    var node = g.node(v);
    console.log(v)
    console.log(node)
    // Round the corners of the nodes
    node.rx = node.ry = 5;
    });


    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("#interactive_diagram_svg").append("svg"),
    svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);
    }


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



function createClusterGraphQuestion3Spare(wordClusters, feature){

    //remove words that the user doesn't want to see
    filteredWordClusters = []
    
    buttons = document.getElementsByClassName("buttonForGraph")
    for(button of buttons){
        word = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){
            for(wordCluster in wordClusters){
                if(wordClusters[wordCluster]['word'] == word){
                    console.log(wordClusters[wordCluster])
                    filteredWordClusters.push(wordClusters[wordCluster])
                }
            }
        }
    }
    
    
    //remove groups that the user doesn't want to see
    //groups = []
    groups = []
    buttons = document.getElementsByClassName("groupButtonForGraph")
    for(button of buttons){        
        group = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){groups.push(group)}
    }
    console.log('groupsTest: ', groups)
    
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 20, ranksep: 200, nodesep:10, rankdir: 'LR'})
    .setDefaultEdgeLabel(function() { return {}; });

    //Find relevant groups that need to be created
    let groupsOfSentences = new Array()
    for(let wordCluster of filteredWordClusters){
        for (let cluster of wordCluster['cluster']){
            type = cluster['type'].replace(baseURI,'');
            groupsOfSentences.push(type)
         }
    }
    groupsOfSentences = new Set(groupsOfSentences);

    

    //Create super-groups
    if(groups.includes('Stakeholder') && groupsOfSentences.has('Stakeholder')){
        //create Domain super-group
        g.setNode('Domain', {label: 'Domain', clusterLabelPos: 'top', style: 'fill: #e6e6e6'});
    }

    if((groups.includes('UseCase') && groupsOfSentences.has('UseCase')) || (groups.includes('FunctionalRequirementAndBehaviour') && groupsOfSentences.has('FunctionalRequirementAndBehaviour')) || (groups.includes('NonFunctionalRequirementAndBehaviour') && groupsOfSentences.has('NonFunctionalRequirementAndBehaviour')) || (groups.includes('RequirementGeneral') && groupsOfSentences.has('RequirementGeneral')) || (groups.includes('Feature')  && groupsOfSentences.has('Feature')) || (groups.includes('UserStory') && groupsOfSentences.has('UserStory'))){
        g.setNode('Requirements Analysis', {label: 'Requirements Analysis', clusterLabelPos: 'top', style: 'fill: #ffe6b3'});
    }
    
    if((groups.includes('S-Architecture') && groupsOfSentences.has('S-Architecture')) || (groups.includes('S-TechnologySolution') && groupsOfSentences.has('S-TechnologySolution')) || (groups.includes('S-SourceCode') && groupsOfSentences.has('S-SourceCode')) || (groups.includes('B-TechnologySolution') && groupsOfSentences.has('B-TechnologySolution')) || (groups.includes('B-General') && groupsOfSentences.has('B-General')) || (groups.includes('D-Architecture') && groupsOfSentences.has('D-Architecture')) || (groups.includes('U-Architecture') && groupsOfSentences.has('U-Architecture'))  || (groups.includes('U-Implementation') && groupsOfSentences.has('U-Implementation'))){
        //create system super-group
        g.setNode('System', {label: 'System', clusterLabelPos: 'top', style: 'fill: #bcc4dc'});

        if((groups.includes('S-Architecture') && groupsOfSentences.has('S-Architecture')) || (groups.includes('S-TechnologySolution') && groupsOfSentences.has('S-TechnologySolution'))  || (groups.includes('S-SourceCode') && groupsOfSentences.has('S-SourceCode'))){
            //Create Structure sub-super-group
            g.setNode('Structure', {label: 'Structure', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
            g.setParent('Structure', 'System');

            if((groups.includes('S-TechnologySolution') && groupsOfSentences.has('S-TechnologySolution')) || (groups.includes('S-SourceCode') && groupsOfSentences.has('S-SourceCode'))){
                //Create Structure - Implementation sub-super-group
                g.setNode('S-Implementation', {label: 'Implementation', clusterLabelPos: 'top', style: 'fill: #dde1ee'});
                g.setParent('S-Implementation', 'Structure');
            }
        }

        if((groups.includes('B-TechnologySolution') && groupsOfSentences.has('B-TechnologySolution')) || (groups.includes('B-General') && groupsOfSentences.has('B-General'))){
            //Create Behaviour - Implementation sub-super-group
            g.setNode('Behaviour', {label: 'Behaviour', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
            g.setParent('Behaviour', 'System');

            g.setNode('B-Implementation', {label: 'Implementation', clusterLabelPos: 'top', style: 'fill: #dde1ee'});
            g.setParent('B-Implementation', 'Behaviour');
        }
        if((groups.includes('D-Architecture') && groupsOfSentences.has('D-Architecture'))){
            //Create Data sub-super-group
            g.setNode('Data', {label: 'Data', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
            g.setParent('Data', 'System');
        }
        if((groups.includes('U-Architecture') && groupsOfSentences.has('U-Architecture')) || (groups.includes('U-Implementation') && groupsOfSentences.has('U-Implementation'))){
            //Create UI sub-super-groups
            g.setNode('UI Design', {label: 'UI Design', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
            g.setParent('UI Design', 'System');
        }
        
    }

    if((groups.includes('DevelopmentPractice') && groupsOfSentences.has('DevelopmentPractice')) || (groups.includes('Testing') && groupsOfSentences.has('Testing')) || (groups.includes('Risk') && groupsOfSentences.has('Risk')) || (groups.includes('Issue') && groupsOfSentences.has('Issue')) ){
        //create devProcess super-group
        g.setNode('Development Process', {label: 'Development Process', clusterLabelPos: 'top', style: 'fill: #e0b3ff'});
        
        if((groups.includes('Testing') && groupsOfSentences.has('DevelopmentPractice')) || (groups.includes('Risk') && groupsOfSentences.has('Risk')) || (groups.includes('Issue') && groupsOfSentences.has('Issue'))){
            //Create QA sub-super-group
            g.setNode('Quality Assurance', {label: 'Quality Assurance', clusterLabelPos: 'top', style: 'fill: #ebccff'});
            g.setParent('Quality Assurance', 'Development Process');
        }
    }


    //create the groups
    for(let group of groups){
        console.log(group)

        if(group == 'Stakeholder' && groupsOfSentences.has('Stakeholder')){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #f2f2f2'});
            g.setParent(group, 'Domain');
        }

        else if((group == 'UseCase' && groupsOfSentences.has('UseCase')) || (group == 'FunctionalRequirementAndBehaviour' && groupsOfSentences.has('FunctionalRequirementAndBehaviour')) || (group == 'NonFunctionalRequirementAndBehaviour' && groupsOfSentences.has('NonFunctionalRequirementAndBehaviour')) || (group == 'RequirementGeneral' && groupsOfSentences.has('RequirementGeneral')) || (group == 'Feature' && groupsOfSentences.has('Feature'))){
            console.log('creating group: ', group)
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ffeecc'});
            g.setParent(group, 'Requirements Analysis');
        }else if (group == 'UserStory' && groupsOfSentences.has('UserStory')){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #fff7e6'});
            g.setParent(group, 'FunctionalRequirementAndBehaviour');
        }

        else if (group == 'S-Architecture' && groupsOfSentences.has('S-Architecture')){            
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #dde1ee'});
            g.setParent(group, 'Structure');
        }else if ((group == 'S-TechnologySolution' && groupsOfSentences.has('S-TechnologySolution')) || (group == 'S-SourceCode' && groupsOfSentences.has('S-SourceCode'))){            
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #eef0f6'});
            g.setParent(group, 'S-Implementation');
        }else if ((group == 'B-TechnologySolution' && groupsOfSentences.has('B-TechnologySolution')) || (group == 'B-General' && groupsOfSentences.has('B-General'))){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #eef0f6'});
            g.setParent(group, 'B-Implementation');
        }else if (group == 'D-Architecture' && groupsOfSentences.has('D-Architecture')){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #dde1ee'});
            g.setParent(group, 'Data');
        }else if ((group == 'U-Architecture' && groupsOfSentences.has('U-Architecture')) || (group == 'U-Implementation' && groupsOfSentences.has('U-Implementation'))){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #dde1ee'});
            g.setParent(group, 'UI Design');
        }

        else if (group == 'DevelopmentPractice' && groupsOfSentences.has('DevelopmentPractice')){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ebccff'});
            g.setParent(group, 'Development Process');
        }else if ((group == 'Testing' && groupsOfSentences.has('Testing')) || (group == 'Risk' && groupsOfSentences.has('Risk')) || (group == 'Issue' && groupsOfSentences.has('Issue'))){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #f5e6ff'});
            g.setParent(group, 'Quality Assurance');
        }
        
        else{
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ffffe6'});
        }
    }

    // //create nodes for the wordClusters
    // for(let wordCluster of filteredWordClusters){
    //     g.setNode(wordCluster['word'], {label: wordCluster['word']})
    // }

    // //Add sentences as node and append to their clusterWords
    // for(let wordCluster of filteredWordClusters){
    //     for (let cluster of wordCluster['cluster']){

    //         g.setNode(cluster['sentence'], {label: cluster['sentence']})

    //         //append to its group
    //         type = cluster['type'].replace(baseURI,'')
    //         g.setParent(cluster['sentence'], type);

    //         //create edge to cluster
    //         g.setEdge( wordCluster['word'], cluster['sentence'])
    //     }
    // }

    
    //create nodes for the wordClusters
    for(let wordCluster of filteredWordClusters){
        g.setNode(wordCluster['word'], {label: wordCluster['word']})
    }

    for(let group of groups){
        g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ffeecc'}); 
        //for(let sentence of filteredWordClusters){
        for(let wordCluster of filteredWordClusters){
            for (let cluster of wordCluster['cluster']){
                // create nodes, add them to their categories and createa an edge to the feature
                if(cluster['type'].includes(group)){
                    console.log("setting node for: ", cluster)
                    g.setNode(cluster['sentence'], {label: cluster['sentence']})
                    //append to its group
                    type = cluster['type'].replace(baseURI,'')
                    g.setParent(cluster['sentence'], type);
                    g.setEdge(wordCluster['word'], cluster['sentence'])
                    //g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo'})
                }
            }
        }  
    }

    console.log("nodes:")
    g.nodes().forEach(function(v) {
        console.log(v)
        var node = g.node(v);
        console.log(node)
        console.log('------')
        // Round the corners of the nodes
        node.rx = node.ry = 5;
    });


    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("#interactive_diagram_svg").append("svg"),
    svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

}






function createClusterGraphQuestion3SpareOriginal(wordClusters, feature){

    //remove words that the user doesn't want to see
    filteredWordClusters = []
    
    buttons = document.getElementsByClassName("buttonForGraph")
    for(button of buttons){
        console.log(button.getAttribute("id"))
        console.log(button.getAttribute("chosen"))
        word = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){
            for(wordCluster in wordClusters){
                if(wordClusters[wordCluster]['word'] == word){
                    console.log(wordClusters[wordCluster])
                    filteredWordClusters.push(wordClusters[wordCluster])
                }
            }
        }
    }
    
    
    //remove groups that the user doesn't want to see
    //groups = []
    groupsTest = []
    buttons = document.getElementsByClassName("groupButtonForGraph")
    for(button of buttons){        
        group = button.getAttribute("id")
        chosen = button.getAttribute("chosen")
        if(chosen == "True"){groupsTest.push(group)}
    }
    console.log('groupsTest: ', groupsTest)
    //console.log('filtered sentences: ', filteredSentences)

    
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 20, ranksep: 200, nodesep:10, rankdir: 'LR'})
    .setDefaultEdgeLabel(function() { return {}; });

    //Find relevant groups that need to be created
    let groups = new Array()
    for(let wordCluster of filteredWordClusters){
        for (let cluster of wordCluster['cluster']){
            type = cluster['type'].replace(baseURI,'');
            groups.push(type)
         }
    }
    groups = new Set(groups);

    console.log('groups: ')
    console.log(groups)
    console.log('-----------')
    //Create super-groups
    if(groups.has('Stakeholder')){
        //create Domain super-group
        g.setNode('Domain', {label: 'Domain', clusterLabelPos: 'top', style: 'fill: #e6e6e6'});
    }

    if(groups.has('UseCase') || groups.has('FunctionalRequirementAndBehaviour') || groups.has('NonFunctionalRequirementAndBehaviour') || groups.has('RequirementGeneral') || groups.has('Feature') || groups.has('UserStory')){
        g.setNode('Requirements Analysis', {label: 'Requirements Analysis', clusterLabelPos: 'top', style: 'fill: #ffe6b3'});
    }
    
    if(groups.has('S-Architecture') || groups.has('S-TechnologySolution') || groups.has('S-SourceCode') || groups.has('B-TechnologySolution') || groups.has('B-General') || groups.has('D-Architecture') || groups.has('U-Architecture') || groups.has('U-Implementation') ){
        //create system super-group
        g.setNode('System', {label: 'System', clusterLabelPos: 'top', style: 'fill: #bcc4dc'});

        if(groups.has('S-Architecture') || groups.has('S-TechnologySolution') || groups.has('S-SourceCode')){
            //Create Structure sub-super-group
            g.setNode('Structure', {label: 'Structure', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
            g.setParent('Structure', 'System');

            if(groups.has('S-TechnologySolution') || groups.has('S-SourceCode')){
                //Create Structure - Implementation sub-super-group
                g.setNode('S-Implementation', {label: 'Implementation', clusterLabelPos: 'top', style: 'fill: #dde1ee'});
                g.setParent('S-Implementation', 'Structure');
            }
        }

        if(groups.has('B-TechnologySolution') || groups.has('B-General')){
            //Create Behaviour - Implementation sub-super-group
            g.setNode('Behaviour', {label: 'Behaviour', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
            g.setParent('Behaviour', 'System');

            g.setNode('B-Implementation', {label: 'Implementation', clusterLabelPos: 'top', style: 'fill: #dde1ee'});
            g.setParent('B-Implementation', 'Behaviour');
        }
        if(groups.has('D-Architecture') ){
            //Create Data sub-super-group
            g.setNode('Data', {label: 'Data', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
            g.setParent('Data', 'System');
        }
        if(groups.has('U-Architecture') || groups.has('U-Implementation')){
            //Create UI sub-super-groups
            g.setNode('UI Design', {label: 'UI Design', clusterLabelPos: 'top', style: 'fill: #cdd3e5'});
            g.setParent('UI Design', 'System');
        }
        
    }

    if(groups.has('DevelopmentPractice') || groups.has('Testing') || groups.has('Risk') || groups.has('Issue')){
        //create devProcess super-group
        g.setNode('Development Process', {label: 'Development Process', clusterLabelPos: 'top', style: 'fill: #e0b3ff'});
        
        if(groups.has('Testing') || groups.has('Risk') || groups.has('Issue')){
            //Create QA sub-super-group
            g.setNode('Quality Assurance', {label: 'Quality Assurance', clusterLabelPos: 'top', style: 'fill: #ebccff'});
            g.setParent('Quality Assurance', 'Development Process');
        }
    }


    //create the groups
    for(let group of groups){

        if(group == 'Stakeholder'){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #f2f2f2'});
            g.setParent(group, 'Domain');
        }

        else if(group == 'UseCase' || group == 'FunctionalRequirementAndBehaviour' || group == 'NonFunctionalRequirementAndBehaviour' || group == 'RequirementGeneral' || group == 'Feature'){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #ffeecc'});
            g.setParent(group, 'Requirements Analysis');
        }else if (group == 'UserStory'){
            g.setNode(group, {label: group, clusterLabelPos: 'top', style: 'fill: #fff7e6'});
            g.setParent(group, 'FunctionalRequirementAndBehaviour');
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

    //Add sentences as node and append to their clusterWords
    for(let wordCluster of filteredWordClusters){
        for (let cluster of wordCluster['cluster']){

            g.setNode(cluster['sentence'], {label: cluster['sentence']})

            //append to its group
            type = cluster['type'].replace(baseURI,'')
            g.setParent(cluster['sentence'], type);

            //create edge to cluster
            g.setEdge( wordCluster['word'], cluster['sentence'])
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

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

}


function createTreeVisualisation (data){
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 2000 - margin.right - margin.left,
    height = 2000 - margin.top - margin.bottom;
    
  var i = 0,
    duration = 750,
    root;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select(".second-column").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root = data;
  root.x0 = height / 2;
  root.y0 = 0;
    
  update(root);

  d3.select(self.frameElement).style("height", "500px");



  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; })

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#ADADAD")
      .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
      });


    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
    });

    node.each(function(d){
      if (d.name == "root") 
          d3.select(this).remove();});
    link.each(function(d){
      if (d.source.name == "root") 
          d3.select(this).remove();});
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
    d._children = d.children;
    d.children = null;
    } else {
    d.children = d._children;
    d._children = null;
    }
    update(d);
  }
}