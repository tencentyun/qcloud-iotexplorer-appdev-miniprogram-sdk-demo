const app = require('./app');

app.listen('7788', () => {
	console.info('Express server listening on port: %s', 7788);
});