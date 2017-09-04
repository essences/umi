const eraDataList=
	[{
		text:'平成',
		firstDate:'1989-01-08',
	},
	{
		text:'昭和',
		firstDate:'1926-12-25',
	},
	{
		text:'大正',
		firstDate:'1912-07-30',
	},
	{
		text:'明治',
		firstDate:'1873-01-01'
	}];

module.exports = class WarekiCreator {
	constructor () {
	};


	getWareki(dateObj) {
		const year = dateObj.getFullYear();
		const month = dateObj.getMonth() + 1;
		const date = dateObj.getDate();

		var wareki;
		for (let i = 0; i < eraDataList.length; i++) {
			let eraData = eraDataList[i];
			let eraFirstDateObj = new Date(eraData.firstDate);
			if (dateObj - eraFirstDateObj >= 0) {
				let eraYear = year - eraFirstDateObj.getFullYear() + 1;
				wareki = `${eraData.text}${eraYear}年${month}月${date}日`;
				break;
			}
		}
		return wareki;
	};
};