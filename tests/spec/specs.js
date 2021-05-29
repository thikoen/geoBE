const Jasmine = require('jasmine');
const reporters = require('jasmine-reporters');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const jasmine = new Jasmine();
var reporter = new JasmineConsoleReporter({
        colors: 1,
        cleanStack: 3,
        verbosity: 4,
        listStyle: 'indent',
        activity: false
});
var junitReporter = new jasmineReporters.JUnitXMLReporter({
        savePath = 'reports',
        consolidateAll: false
});
jasmine.addReporter(reporter);
jasmine.addReporter(junitReporter);
jasmine.showColors(true);
jasmine.loadConfigFile('tests/spec/support/jasmine.json');
jasmine.execute();