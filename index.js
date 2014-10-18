var cpr_validation = function(cpr){
	/*
	Jesper Lindstrøm Nielsen.

	This checker is implemented via the description of CPR-numbers from: 
	http://da.wikipedia.org/wiki/CPR-nummer
	
	*/
	var regex = /^(\d{6})\-?(\d{4})$/;
	if (typeof cpr == 'number')
		cpr += "";

	if (typeof cpr != 'string')
		return false;

	if (!regex.test(cpr))
		return false;

	var matches = cpr.match(regex);

	var day = matches[1].substring(0,2);
	var month = matches[1].substring(2,4);
	var year = matches[1].substring(4,6);

	//figure out the year from the 7'th cipher.
	var cipher = matches[2].substr(0,1);
	if (0 <= cipher && cipher <= 3)
		year = "19" + year;
	else if (cipher == 4 || cipher == 9) {
		if (0 <= year && year <= 36)
			year = "20" + year;
		else
			year = "19" + year;
	} else if (5 <= cipher && cipher <= 8){
		if (0 <= year && year <= 57)
			year = "20" + year;
		else
			year = "18" + year;
	}

	var date = new Date(year, month -1, day);
	if (date.getDate() != day || date.getMonth() != month - 1 && date.getYear() != year)
		return false;


	if (year >= 2007 && month >= 10) // CPR numbers on from this day on, cannot be validated.
		return true;

	cpr = matches[1] + "" + matches[2];

	var add_tab = [4,3,2,7,6,5,4,3,2,1];
	var res = 0;
    for(var i = 0; i < 10; i++)
		res += cpr[i] * add_tab[i];

	if (res % 11 === 0)
		return true;

	//The only possibllity is that the person is from 1.1.65 or 1.1.66
	if (day == '01' && month == '01' && (year == '1965' || year == '1966') && cpr[9] % 2 == 1)
		return true;
	else
		return false;
};