define(["utils"], function(utils) {
    return { import_and_check: import_and_check,
	     text_for_data: text_for_data,
	     float_for_data: float_for_data
	   };

    function import_and_check(data, styles, name) {
	if (data===null) return null;
	// make array
	if (!(data instanceof Array)) {
	    data = [data];
	}
	// check data
	var check = function() {
	    if (data===null)
		return null;
	    if (data.length==1)
		return null;
	    if (data.length==2) // && styles.indexOf('Diff')!=-1
		return null;
	    return console.warn('Bad data style: '+name);
	};
	check();
	data = utils.array_to_object(data);
	return data;
    }

    function float_for_data(d, styles, ignore_abs) {
	if (ignore_abs===undefined) ignore_abs = false;
	if (d===null) return null;
	var f = null;
	if (d.length==1) f = d[0];
	if (d.length==2) { // && styles.indexOf('Diff')!=-1) {
	    if (d[0]===null || d[1]===null) return null;
	    else f = d[1] - d[0];
	}
	if (styles.indexOf('Abs')!=-1 && !ignore_abs) {
	    f = Math.abs(f);
	}
	return f;
    }

    function text_for_data(d, styles) {
	if (d===null)
	    return null_or_d(null);
	var f = float_for_data(d, styles, true);
	if (d.length==1) {
	    var format = d3.format('.4g');
	    return null_or_d(f, format);
	}
	if (d.length==2) { // && styles.indexOf('Diff')!=-1) {
	    var format = d3.format('.3g'),
		t = null_or_d(d[0], format);
	    t += ', ' + null_or_d(d[1], format);
	    t += ': ' + null_or_d(f, format);
	    return t;
	}
	return '';

	// definitions
	function null_or_d(d, format) {
	    return d===null ? '(nd)' : format(d);
	}
    }
});
