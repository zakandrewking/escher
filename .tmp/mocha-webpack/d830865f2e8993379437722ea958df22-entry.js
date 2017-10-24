
    var testsContext = require.context("../../src/tests", false);

    var runnable = testsContext.keys();

    runnable.forEach(testsContext);
    