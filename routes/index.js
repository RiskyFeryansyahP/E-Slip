var express = require('express');
var router = express.Router();
var date = require("date-and-time");
var now = new Date();
const mysql = require("mysql");

let connection = mysql.createConnection({
	host 		: 'localhost',
	port 		: 3306,
	database	: 'transaksi',
	user		: 'root',
	password 	: 'akumakan2'
});


// Login
router.get('/login', function(req, res, next) {

	if (!req.session.nama)
	{
		res.render('login/index', { layout : 'layout_login', success : false, errors : req.session.errors });
  		req.session.errors = null;
	}
	else if (req.session.nama) 
	{
		res.redirect("/");
	}
});

router.post("/login", function(req, res, next) {
	// check Validity
	// req.check('nrpp', 'NRPP is required').isEmpty();
	// req.check('password', 'Password is Required').isEmpty(req.body.password);

	// var errors = req.validationErrors();
	// if(errors)
	// {
	// 	req.session.errors = errors;
	// }
	// res.redirect("/login");
	connection.query("select * from tbl_admin where ? && ?", [
		{nrp : req.body.nrp},
		{password : req.body.password}
		], function(err,rows,field) {
		if(rows.length)
		{
			console.log(rows);
			req.session.nama = rows[0].nama;
			req.session.id_karyawan = rows[0].id_karyawan;
			res.redirect('/');
		}
		else
		{
			connection.query("select * from tbl_karyawan where ? && ?", [
				{nrp : req.body.nrp},
				{password : req.body.password}
			], function(err,rows,field) {
				if (rows.length) 
				{
					req.session.nama = rows[0].nama;
					req.session.id_karyawan = rows[0].id_karyawan;
					res.redirect(`/users/`);
				}
				else
				{
					req.session.errors = "Error , Data tidak ditemukan";
					res.redirect("/login");
				}
			})
		}
	})
});

router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		res.redirect('/');
	});
});

// End Login

router.get('/', function(req, res, next) {

	if(req.session.nama)
	{
		var time = date.format(now, 'YYYY:MM:DD');
  		res.render('index', { title: 'Dashboard', time : time, nama : req.session.nama });
	}
	else
	{
		res.redirect("/login");
	}
});

// Gaji

router.get('/addgaji/:id', function(req, res, next) {
	var time = date.format(now, 'DD MMMM YYYY');
	let success = false;
	connection.query("select * from tbl_karyawan where ? ", {
		id_karyawan : req.params.id
	}, function(err,rows,field) {
		if (err) throw err;
		console.log(rows[0].nama);
		res.render('gajian/index', { time : time, success : req.session.success, nama : rows[0].nama });
		req.session.success = null;
	});
});

router.post('/addgaji/:id', function(req, res, next) {
	connection.query("insert into tbl_gaji set ?, id_karyawan = ?", [
		req.body,
		req.params.id
	], function(err,field) {
		if (err) throw err;
		req.session.success = "Data Berhasil ditambahkan";
		res.redirect(`/addgaji/${req.params.id}`);
	})
});

router.get('/detailgaji', function(req, res, next) {
	connection.query("SELECT nama,tanggal,gaji_pokok + bpjs + uang_lapangan + uang_dinas + tunjangan_pajak as total_pendapatan, simpanan_wajib+iuran+potongan_koperasi+potongan_terlambat+potongan_bpjs as total_potongan,(gaji_pokok + bpjs + uang_lapangan + uang_dinas + tunjangan_pajak) -   (simpanan_wajib+iuran+potongan_koperasi+potongan_terlambat+potongan_bpjs) as total_semua FROM tbl_gaji", function(err,rows,field) {
		if (err) throw err
		// rows.forEach(console.log(rows.nama));
		res.render("gajian/detail", { data : rows, nama : req.session.nama });
	})
})
// End Gaji

router.get('/karyawan', function(req, res, next) {
	connection.query("select * from tbl_karyawan", function(err,rows,field) {
		if (err) throw err;
		res.render("karyawan/index", { data : rows, nama : req.session.nama });
	})
});

router.get('/coba/:id?', function(req, res, next) {
	res.end(`ini coba ${req.params.id}`);
});

module.exports = router;
