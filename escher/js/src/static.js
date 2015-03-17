define(["utils"], function(utils) {
    return { load_map_model_from_url: load_map_model_from_url };
    
    function load_map_model_from_url(map_download_url, model_download_url,
                                     local_index, options, callback) {
        var opt = utils.parse_url_components(window, options),
            to_load = [],
            load_map = function (fn) { fn(null); },
            load_model = function (fn) { fn(null); };
        if (opt.map_name) {
            var map_path = _get_path('map', opt.map_name,
                                     local_index, map_download_url);
            if (map_path) {
                load_map = function (fn) {
                    d3.json(map_path, function(error, data) {
                        if (error) console.warn(error);
                        fn(data);
                    });
                };
            }
        }
        if (opt.model_name) {
            var model_path = _get_path('model', opt.model_name,
                                       local_index, model_download_url);
            if (model_path) {
                load_model = function (fn) {
                    d3.json(model_path, function(error, data) {
                        if (error) console.warn(error);
                        fn(data);
                    });
                };
            }
        }
        load_map(function(map_data) {
            load_model(function(model_data) {
                callback(map_data, model_data, options);
            });
        });
    }
    
    function _get_path(kind, name, index, url) {
        var match = index[kind+'s'].filter(function(x) {
            return x[kind+'_name'] == name;
        });
        if (match.length == 0)
            throw new Error('Bad ' + kind + ' ' + name);
        return (url + encodeURIComponent(match[0].organism) + 
                '/' + encodeURIComponent(match[0][kind+'_name'])) + '.json';
    }
});
