const Md5 = require('ts-md5');

const whitelist = ['M29KT', 'M20KT', 'M1QKT', 'M1PKT', 'M12KT', 'M1BKT', 'M1EKT', 'M1CKT', 'M1NKT', 'M1MKT', 'M38KT', 'M1RKT', 'M2DKT', 'M2DKT', 'M2EKT', 'M1QMF', 'M2RKT', 'M38KT'];

console.log((whitelist.reduce((acc, current) => {
	acc.push(Md5.Md5.hashStr(current));
	return acc;
}, [])));
