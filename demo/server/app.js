const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const router = require('./routers');

const app = express();

app.set('case sensitive routing', true);
app.set('trust proxy', true);

// parse `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({ extended: true, limit: '500kb' }));

// parse `application/octet-stream`
app.use(bodyParser.raw({ limit: '100mb', type: 'application/octet-stream' }));

// parse `application/json`
app.use(bodyParser.json());

app.use((req, res, next) => {
	let reqId = req.query.reqId || req.body.reqId;

	if (!reqId) {
		reqId = shortid()
	}

	req.reqId = reqId;

	next();
});

// 通用路由分发器
app.use('/api', router);

// 处理未被使用（未命中）的路由
app.use((req, res, next) => {
	res.status(501).jsonp({ code: '501', msg: 'Not Implemented' })

	next();
});

// 服务器内部异常错误处理
app.use((err, req, res, next) => {
	if (res.headersSent) return;

	console.error('Internal error', err);

	res.status(500).jsonp({ code: '500', msg: '服务器维护中，请稍后再试' });
});

module.exports = app;
