({
    baseUrl: '../src',
    name: "../build/almond",
    paths: {
	lib: '../../lib'
    },
    include: ["main"],
    wrap: {
        startFile: '../build/almond-start.frag',
        endFile: '../build/almond-end.frag'
    }
})
