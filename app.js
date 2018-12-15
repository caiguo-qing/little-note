const express = require('express');
const app = express();
const db = require('./models/db');

app.get('/', (req, res) => {
	db.insertOne('dafy', 'teacher', {
		"name": '张三',
		age: 49
	}, (err, result) => {
		if (err) {
			res.send('插入数据失败')
			return
		}
		res.send(result);
	})
})

app.get('/du', (req, res) => {
	let page = parseInt(req.query.page) || 1
	db.find('dafy','student',{},{page,pageNumber:2},(err,result) => {
		if(err){
			res.end(err);
			return
		}
		res.send(result);
	})
})

app.get('/update',(req,res) => {
	db.updateMany('dafy','student',{age:13},{$set:{"score.math":100}},(err,result) => {
		if(err){
			res.send('更新失败');
			return;
		}
		res.send(result);

	})
})

app.get('/delete',(req,res) => {
	db.deleteMany('dafy','student',{"score.math":59},(err,result) => {
		if(err){
			res.send('删除失败！');
			return
		}
		res.send(result);
	})
})



app.listen(3000);