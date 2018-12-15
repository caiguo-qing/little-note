const express = require('express');
const formidable = require('formidable')
const app = express();
const db = require('./models/db');
ObjectID = require('mongodb').ObjectID,

	// 设置静态资源
	app.use('/static', express.static('./static'));
app.use(express.static('./views'));

// 提交笔记
app.post('/dopost', (req, res) => {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields) {
		const {
			name,
			note
		} = fields
		db.insertOne('dafy', 'note', {
			name,
			note,
			'date': new Date()
		}, (err, result) => {
			if (err) {
				res.json({
					result: -1
				})
				return
			}
			res.json({
				result: 1
			});
		})

	});
})

// 获取列表
app.get('/list', (req, res) => {
	let search = req.query.search || {};
	let page = req.query.page || 1;
	let pageNumber = req.query.pageNumber || 10;
	// 获得数据库中数据总条数
	db.getAllMount('dafy', 'note', {}, (err, count) => {
		// 查找符合条件的数据
		db.find('dafy', 'note', search, {
			page,
			pageNumber,
			sort: {
				date: -1
			}
		}, (err, result) => {
			if (err) {
				res.json({
					code: 1,
					data: '查询失败'
				})
				return;
			}
			res.json({
				code: 0,
				data: result,
				count
			})
		})
	})

})

// 删除

app.get('/delete',(req,res) => {
	let id = req.query.id
	db.deleteMany('dafy','note',{"_id":ObjectID(id)},(err,result) => {
		if(err){
			res.json({code:1,data:'删除失败'})
		}
		res.json({code:0,data:'ok'})
	})
})


app.listen(3000);