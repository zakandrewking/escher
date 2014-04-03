({
    baseUrl: '.',
    out: "escher-1.0.dev.js",
    name: "almond",
    paths: {
        'lib/complete.ly': 'lib/complete.ly.1.0.1'
    },
    include: ["main"],
    optimize: "none",
    wrap: {
        startFile: 'almond-start.frag',
        endFile: 'almond-end.frag'
    }
})
