({
    baseUrl: '.',
    shim: {
        "lib/builder/jquery-ui": {
            "deps": ['lib/jquery']
        }
    },
    out: "../visbio.js",
    name: "almond",
    include: "main",
    wrap: true
})
