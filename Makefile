test:
       @./node_modules/.bin/mocha -u tdd --reporter spec
grunt:
      grunt test
.PHONY: test grunt
