const MongoClient = require('mongodb').MongoClient;


// 链接数据库
function _connectDB(callback) {

	const url = 'mongodb://localhost:27017';

	const client = new MongoClient(url, {
		useNewUrlParser: true
	});

	client.connect(function(err, client) {
		callback(err, client);
	});
}

// 插入数据
// params:
// dbName:需要添加到那个数据库
// collectionName:需要插入到那个集合
// json:需要添加的数据
// callback:回到函数
exports.insertOne = (dbName, collectionName, json, callback) => {
	_connectDB((err, client) => {
		if (err) {
			console.log('数据库链接失败');
			return;
		}
		const col = client.db(dbName).collection(collectionName);
		col.insertOne(json, (err, result) => {
			callback(err, result);
			client.close();
		})
	})
}

// 查询数据
// /*
// params:
// dbName:需要查询的数据库
// collectionName:需要查询的集合
// json:查询条件
// D:分页参数-可选
// F：回调函数
// *
exports.find = (dbName, collectionName, json, D, F) => {
	_connectDB((err, client) => {
		if (err) {
			console.log('数据库链接失败');
			return;
		}
		let args, callback;
		if (arguments.lenght === 4) { //args参数未传
			args = {
				page: 1,
				pageNumber: 10,
				sort:{},
			};
			callback = D
		} else if (arguments.length === 5) {
			args = D;
			callback = F;
		} else {
			callback('参数不正确！');
			client.close();
			return;
		}

		let skipNumber = parseInt((args.page - 1) * args.pageNumber);
		let limitNumber = parseInt(args.pageNumber) || 0;
		let sort = args.sort || {}
		const col = client.db(dbName).collection(collectionName);
		let cursor = col.find(json).skip(skipNumber).limit(limitNumber).sort(sort);
		let result = [];
		cursor.each((err, doc) => {
			if (err) {
				callback(err, null);
				client.close();
				return;
			}
			if (doc != null) {
				result.push(doc);
			} else {
				callback(null, result);
				client.close();
			}
		})
	})
}

// 删除数据
// params:
// dbName:数据库
// collectionName:集合
// json:要删除的数据
// callback:回调函数
exports.deleteMany = (dbName, collectionName, json, callback) => {
	_connectDB((err, client) => {
		if (err) {
			console.log('链接数据库失败！');
			return;
		}
		let col = client.db(dbName).collection(collectionName);
		col.deleteMany(json, (err, result) => {
			if (err) {
				callback(err, null);
				client.close();
				return;
			}
			callback(null, result);
			client.close();
		})
	})
}

// 更新数据
//params:
//dbName:数据库
//collectionName:集合
//json1:需要查询的数据
//json2:修改值
//callback:回调函数
exports.updateMany = (dbName, collectionName, json1, json2, callback) => {
	_connectDB((err, client) => {
		if (err) {
			console.log('链接数据库失败！');
			return;
		}
		let col = client.db(dbName).collection(collectionName);
		col.updateMany(json1, json2, (err, result) => {
			if (err) {
				callback(err, null);
				client.close();
				return;
			}
			callback(null, result);
			client.close();
		})
	})
}


// 查询总数
// params:
// dbName:数据库
// collectionName:集合
// json:查询数据参数
// callback:回调函数
exports.getAllMount = (dbName,collectionName,json,callback) => {
	_connectDB((err,client) => {
		if(err){
			console.log('链接数据库失败！');
			return;
		}
		let col = client.db(dbName).collection(collectionName);
		col.count(json).then(data => {
			callback(null,data);
			client.close();
		})
	}) 
}














