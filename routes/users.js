var express = require('express');
var router = express.Router();

const mysql = require("mysql");

let connection = mysql.createConnection({
	host 		: 'localhost',
	port 		: 3306,
	database	: 'transaksi',
	user		: 'root',
	password 	: 'akumakan2'
});

/* GET users listing. */
router.get('/', function(req, res, next) {

	// var time = date.format(now, 'YYYY:MM:DD');
	if (req.session.nama)
	{
 		res.render('index', { layout : 'layout_karyawan', nama : req.session.nama, id_karyawan : req.session.id_karyawan });
	}
	else if (!req.session.nama)
	{
		res.redirect("/login");
	}
});

router.get('/slip', function(req, res, next) {
	connection.query("SELECT id_gaji,nama,tanggal,id_karyawan,FORMAT(gaji_pokok, 0) as gaji_pokok,FORMAT(bpjs, 0) as bpjs,FORMAT(uang_lapangan, 0) as uang_lapangan,FORMAT(uang_dinas, 0) as uang_dinas,FORMAT(tunjangan_pajak, 0) as tunjangan_pajak,FORMAT(simpanan_wajib, 0) as simpanan_wajib,FORMAT(iuran, 0) as iuran,FORMAT(potongan_koperasi, 0) as potongan_koperasi,FORMAT(potongan_terlambat, 0) as potongan_terlambat,FORMAT(potongan_bpjs, 0) as potongan_bpjs,FORMAT(pajak, 0) as pajak,FORMAT(gaji_pokok + bpjs + uang_lapangan + uang_dinas + tunjangan_pajak, 0) as total_pendapatan, FORMAT(simpanan_wajib+iuran+potongan_koperasi+potongan_terlambat+potongan_bpjs+pajak, 0) as total_potongan,FORMAT((gaji_pokok + bpjs + uang_lapangan + uang_dinas + tunjangan_pajak) -   (simpanan_wajib+iuran+potongan_koperasi+potongan_terlambat+potongan_bpjs+pajak), 0) as total_semua FROM tbl_gaji where ?",
			{id_karyawan : req.session.id_karyawan}
		, function(err,rows,field) {
		if (err) throw err
		res.render("users/index", { layout : 'layout_karyawan', nama : req.session.nama, data : rows, id_karyawan : req.session.id_karyawan });
	})
});

router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		res.redirect('/login');
	});
})

router.get("/coba", function(req, res, next) {
	console.log("Tanggal : " + req.session.tanggal);
	res.render("coba/index", { layout : 'layout_karyawan', tanggal : req.session.tanggal });
	req.session.tanggal = null;
});

router.post("/coba", function(req, res, next) {
	req.session.tanggal = req.body.tanggal;
	res.send(`Succesfully ${req.session.tanggal}`);
});

module.exports = router;
