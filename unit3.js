var tsp = false;
var stateRegions = ['Magway', 'Yangon', 'Ayeyarwaddy', 'Bago', 'Mon', 'Shan'];
var townships = ['Bahan', 'Dagon', 'Pabedan', 'Kalaw', 'Paung', 'Mawlamyine', 'Chaungzon', 'Bilin'];

	var data = [];
	if (tsp == true) {
		data = stateRegions;
	} else {
		data = townships;
	}

	d3.selectAll("select")
		.selectAll("option")
		.data(data)
		.enter()
		.append("option")
		.attr("value", (d) => d );
