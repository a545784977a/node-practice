var express = require('express')
var User = require('./models/user.js')

var router = express.Router()

/* 首页 */
router.get('/', function (req, res) {
	res.render('index.html', {
		user: req.session.user
	})
})

/* 登录 */
router.get('/login', function (req, res) {
	res.render('login.html')
})
router.post('/login', function (req, res) {
	var body = req.body

	User.findOne({
		email: body.email,
		password: body.password
	}, function (err, user) {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误'
			})
		}

		if (!user) {
			return res.status(200).json({
				err_code: 1,
				message: 'email or passward is invalid'
			})
		}

		req.session.user = user

		return res.status(200).json({
			err_code: 0,
			message: 'OK'
		})

	})
})

router.get('/register', function (req, res) {
	res.render('register.html')
})

router.post('/register', function (req, res) {
	var body = req.body
	User.findOne({
		$or: [
			{
				email: body.email
			},
			{
				nickname: body.nickname
			}
		]
	}, function (err, data) {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误!'
			})
		}
		
		if (data) {
			return res.status(200).json({
				err_code: 1,
				message: '邮箱或昵称已存在'
			})
		}

		new User(body).save(function (err, user) {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '数据库存储错误'
				})
			}

			req.session.user = user

			res.status(200).json({
				err_code: 0,
				message: 'OK'
			})
		})
	})
})

router.get('/logout', function (req, res) {
	req.session.user = null
	
	res.redirect('/login')
})



module.exports = router