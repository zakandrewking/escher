requirejs.config({
    baseUrl: 'js',
    shim: {
        "lib/builder/jquery-ui": {
            "deps": ['lib/jquery']
        }
    }
});
