all:	grunt test
test:
	pwd
	@./node_modules/.bin/mocha test/spec/server/*.js
grunt:
	grunt test
.PHONY: test grunt
