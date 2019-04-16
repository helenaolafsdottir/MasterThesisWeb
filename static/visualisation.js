var baseURI = "http://www.semanticweb.org/masterThesisOntology#"

function createClusterGraphQuestion1(sentences){
    
    //remove words that the user doesn't want to see
    features = ["Display product", "Purchase product", "User management"]
    filteredSentences = []
    
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

    console.log(filteredSentences)

    
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 20, ranksep: 200, nodesep:10, rankdir: 'RL'})
    .setDefaultEdgeLabel(function() { return {}; });


    // Here we're setting the nodes
    g.setNode('requirementAnalysisGroup', {label: 'Requirement Analysis', clusterLabelPos: 'top', style: 'fill: #ffe6b3'});
    g.setNode('featureGroup', {label: 'Feature', clusterLabelPos: 'top', style: 'fill: #ffeecc'});
    g.setNode('funcReqGroup', {label: 'Functional requirements', clusterLabelPos: 'top', style: 'fill: #ffeecc'});
    g.setNode('useCasesGroup', {label: 'Use cases', clusterLabelPos: 'top', style: 'fill: #ffeecc'});

    //Set the feature nodes
    for(let feature of features){
        g.setNode(feature, {label: feature})
        g.setParent(feature, 'featureGroup')

    }
    
    // //Add sentences as node and append to their feature
    // for(let sentence of filteredSentences){
    
    //     g.setNode(sentence['sentence'], {label: sentence['sentence']})

    //     //append to its group
    //     type = sentence['type'].replace(baseURI,'')
    //     g.setParent(sentence['sentence'], type);

    //     //create edge to feature
    //     for(let feature of Features){
    //         if(sentence['feature'].toLowerCase().includes(feature.toLowerCase())){
    //             g.setEdge(feature, sentence['sentence'])
    //         }
    //     }
    // }

    //build nodes and parent-child connections for all sentences
    for(let sentence of filteredSentences){

        g.setNode(sentence['sentence'], {label:sentence["sentence"]})
    
        if(sentence['type'] == "http://www.semanticweb.org/masterThesisOntology#FunctionalRequirementAndBehaviour"){
            g.setParent(sentence['sentence'],'funcReqGroup')
            for(let feature of features){
                if(sentence['feature'].toLowerCase().includes(feature.toLowerCase())){
                    g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo'})
                }
            }
        }
        else if(sentence['type'] == "http://www.semanticweb.org/masterThesisOntology#UseCase") {
            g.setParent(sentence['sentence'],'useCasesGroup')
            for(let feature of features){
                if(sentence['feature'].toLowerCase().includes(feature.toLowerCase())){
                    g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo'})
                }
            }
        }
    }

    // Set the parents to define which nodes belong to which cluster
    g.setParent('featureGroup', 'requirementAnalysisGroup');
    g.setParent('funcReqGroup', 'requirementAnalysisGroup');
    g.setParent('useCasesGroup', 'requirementAnalysisGroup');


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

//Question 2
function createClusterGraph(relevantSentences, feature){
     
 
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true})
    .setGraph({edgesep: 20, ranksep: 200, nodesep:10, rankdir: 'RL'})
    .setDefaultEdgeLabel(function() { return {}; });

    // Here we're setting the nodes
    g.setNode('requirementAnalysisGroup', {label: 'Requirement Analysis', clusterLabelPos: 'top', style: 'fill: #ffe6b3'});
    g.setNode('featureGroup', {label: 'Feature', clusterLabelPos: 'top', style: 'fill: #ffeecc'});
    g.setNode('funcReqGroup', {label: 'Functional requirements', clusterLabelPos: 'top', style: 'fill: #ffeecc'});
    g.setNode('useCasesGroup', {label: 'Use cases', clusterLabelPos: 'top', style: 'fill: #ffeecc'});


    g.setNode(feature, {label: feature, labelType: "html", class: "feature"})
    g.setParent(feature, 'requirementAnalysisGroup')

    
    //Set the feature node
    g.setNode(feature, {label: feature})
    g.setParent(feature, 'featureGroup')
    

    //build nodes and parent-child connections for all sentences
    console.log('relevantSentences')
    console.log(relevantSentences)
    for(let sentence of relevantSentences){

        g.setNode(sentence['sentence'], {label:sentence["sentence"]})
    
        if(sentence['type'] == "http://www.semanticweb.org/masterThesisOntology#FunctionalRequirementAndBehaviour"){
            g.setParent(sentence['sentence'],'funcReqGroup')
            g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo'})
        }
        else if(sentence['type'] == "http://www.semanticweb.org/masterThesisOntology#UseCase") {
            g.setParent(sentence['sentence'],'useCasesGroup')
            g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo'})
        }
        //{sentence: "Empty list message:", type: "http://www.semanticweb.org/masterThesisOntology#FunctionalRequirementAndBehaviour"}
    }

    // Set the parents to define which nodes belong to which cluster
    g.setParent('featureGroup', 'requirementAnalysisGroup');
    g.setParent('funcReqGroup', 'requirementAnalysisGroup');
    g.setParent('useCasesGroup', 'requirementAnalysisGroup');

    
    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("#interactive_diagram_svg").append("svg"),
    svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

    console.log('-----------')
    console.log(g.node('displayProduct')._children)
    console.log(g.node('List orders')._children)
    console.log('-----------')

    d3.selectAll("svg g .output .nodes .node")
       

}


function createClusterGraphQuestion3(wordClusters, feature){

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