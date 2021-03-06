### Museum and Artwork Recommender 
<p align = "justify">
The tool is designed for any individual who appreciates arts and is interested in visiting museums. It is not easy to find and compare information on similar artworks at various museums. This recommendation tool captures the interest of users in terms of artworks and  helps users to decide which museum to visit next. The Jaccard distance, which measures the similarity between sample sets, is used to rank the similarity between the paintings. The tool also educates users about their interests through comparison of artworks.
	
#### Data Collection and Feature Engineering 

The dataset is collected using SPARQL service. Feature engineering is performed using Pandas library.

<p align = "center">
	<img src = "https://github.com/rojinnew/Museum_Recommender/blob/master/data_collection_feature_engineering.png" width="500">
</p>

#### User Experience	

<p align = "justify">
User Experience: First, select the museum of your choice on the map of France. Next, choose your favorite painting to access cluster view. The color of each cluster represents the museum and the radius represents the similarity degree between favorite image and selected circle and its corresponding painting. As you click on each painting, the features that are similar between the two paintings are highlighted.  
</p>
<p align = "center">
	<img src = "https://github.com/rojinnew/Museum_Recommender/blob/master/screen_shot.png">
</p>

#### Running 

Download the repository and start up the server in src directory using the following command: 

python -m http.serever 8000
 
Enter http://0.0.0.0:8000/ into the browser.
#### References:

(1) https://query.wikidata.org/

(2) https://observablehq.com/@d3/gallery 

