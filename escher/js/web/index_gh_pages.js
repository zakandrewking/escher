// get the models
d3.json('index.json', function(d) {
    data = d; 			// add a callback
    setup();
});
