import { SHA256 as sha256 } from 'crypto-es/lib/sha256';

const whitelist = [
	'M29KT',
	'M20KT',
	'M1QKT',
	'M1PKT',
	'M12KT',
	'M1BKT',
	'M1EKT',
	'M1CKT',
	'M1NKT',
	'M1MKT',
	'M38KT',
	'M1RKT',
	'M2DKT',
	'M2DKT',
	'M2EKT',
	'M1QMF',
	'M2RKT',
	'M38KT'
];

const blockList = [
	'20V9',
	'20WC',
	'82E3',
	'20VA',
	'20WD',
	'82E4',
	'20V3',
	'82GX',
	'82KB',
	'82KD',
	'82KA',
	'82KC',
	'20VD',
	'20VE',
	'82F3',
	'82F1',
	'82F2',
	'82F6',
	'82F7',
	'82F8',
	'20VF',
	'20VG',
	'82F9',
	'82FA',
	'82FD',
	'20WE',
	'20YC'
];

console.log((whitelist.reduce((acc, current) => {
	acc.push(sha256(current).toString());
	return acc;
}, [])));
console.log(sha256('BYCN3').toString());
console.log(sha256('81RS').toString());
