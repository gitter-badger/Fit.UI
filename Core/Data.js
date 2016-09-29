// =====================================
// Data
// =====================================

Fit.Data = {};

/// <function container="Fit.Data" name="CreateGuid" access="public" static="true" returns="string">
/// 	<description> Returns Version 4 compliant GUID </description>
/// 	<param name="dashFormat" type="boolean" default="true">
/// 		Flag indicating whether to use format with or without dashes.
/// 		True = With dashes (default): 57df75f2-3d09-48ca-9c94-f64a5986518f (length = 36)
/// 		False = Without dashes: 57df75f23d0948ca9c94f64a5986518f (length = 32)
/// 	</param>
/// </function>
Fit.Data.CreateGuid = function(dashFormat)
{
	Fit.Validation.ExpectBoolean(dashFormat, true);

	/*
	// Test case proving that unique GUIDs are generated every time.
	// Use a powerful computer to run this test, and a fast browser (e.g. Safari).

	var guids = {};
	var minors = 0;

	for (var i = 0 ; i < 25000000 ; i++) // 25 million
	{
		var g = Fit.Data.CreateGuid();

		minors++;
		if (minors === 5000)
		{
			console.log("5000 more GUIDs generated");
			minors = 0;
		}

		if (guids[g])
		{
			alert("GUID already in use: " + g);
			break;
		}
		else
		{
			guids[g] = 1;
		}
	}
	*/

	var chars = "0123456789abcdef".split("");

	var uuid = new Array();
	var rnd = Math.random;
	var r = -1;

	if (dashFormat !== false) uuid[8] = "-";
	if (dashFormat !== false) uuid[13] = "-";
	uuid[14] = "4"; // version 4 compliant
	if (dashFormat !== false) uuid[18] = "-";
	if (dashFormat !== false) uuid[23] = "-";

	var length = 32 + ((dashFormat !== false) ? 4 : 0);

	for (var i = 0 ; i < length ; i++)
	{
		if (uuid[i] !== undefined)
			continue;

		r = 0 | rnd() * 16;

		uuid[i] = chars[((i === 19) ? (r & 0x3) | 0x8 : r & 0xf)];
	}

	return uuid.join("");
}


// =====================================
// Math
// =====================================

Fit.Math = {};

/// <function container="Fit.Math" name="Round" access="public" static="true" returns="number">
/// 	<description> Round off value to a number with the specified precision </description>
/// 	<param name="value" type="number"> Number to round off </param>
/// 	<param name="precision" type="integer"> Desired precision </param>
/// </function>
Fit.Math.Round = function(value, precision)
{
	Fit.Validation.ExpectNumber(value);
	Fit.Validation.ExpectInteger(precision, true);

	var decimals = ((Fit.Validation.IsSet(precision) === true) ? precision : 0);

    var factor = 1;
    for (var i = 0 ; i < decimals ; i++) factor = factor * 10;
    var res = Math.round(value * factor) / factor;

	return res;
}

/// <function container="Fit.Math" name="Format" access="public" static="true" returns="string">
/// 	<description>
/// 		Format value to produce a number with the specified number of decimals.
/// 		Value is properly rounded off to ensure best precision.
/// 	</description>
/// 	<param name="value" type="number"> Number to format </param>
/// 	<param name="decimals" type="integer"> Desired number of decimals </param>
/// 	<param name="decimalSeparator" type="string" default="undefined">
/// 		If defined, the specified decimal separator will be used
/// 	</param>
/// </function>
Fit.Math.Format = function(value, decimals, decimalSeparator)
{
	Fit.Validation.ExpectNumber(value);
	Fit.Validation.ExpectInteger(decimals, true);
	Fit.Validation.ExpectString(decimalSeparator, true);

	var res = Fit.Math.Round(value, decimals);

    if (decimals <= 0)
        return res.toString();

    var str = ((res % 1 === 0) ? res.toString() + ".0" : res.toString());

    for (var i = str.split(".")[1].length ; i < decimals ; i++)
        str += "0";

    return ((Fit.Validation.IsSet(decimalSeparator) === true) ? str.replace(".", decimalSeparator) : str);
}


// =====================================
// String
// =====================================

Fit.String = {};

/// <function container="Fit.String" name="Trim" access="public" static="true" returns="string">
/// 	<description> Removes any whitespaces in beginning and end of string passed, and returns the new string </description>
/// 	<param name="str" type="string"> String to trim </param>
/// </function>
Fit.String.Trim = function(str)
{
	Fit.Validation.ExpectString(str);
	return str.replace(/^\s+|\s+$/g, "");
}

/// <function container="Fit.String" name="StripHtml" access="public" static="true" returns="string">
/// 	<description> Removes any HTML contained in string, and returns the raw text value </description>
/// 	<param name="str" type="string"> String to strip HTML from </param>
/// </function>
Fit.String.StripHtml = function(str)
{
	Fit.Validation.ExpectString(str);

	return str.replace(/(<([^>]+)>)/g, "");

	// Disabled - whitespaces are not preserved!
	/*var span = document.createElement("span");
	span.innerHTML = str;
	return Fit.String.Trim(Fit.Dom.Text(span));*/
}

/// <function container="Fit.String" name="EncodeHtml" access="public" static="true" returns="string">
/// 	<description> Encode special characters into HTML entities </description>
/// 	<param name="str" type="string"> String to encode </param>
/// </function>
Fit.String.EncodeHtml = function(str)
{
	Fit.Validation.ExpectString(str);
	return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/// <function container="Fit.String" name="DecodeHtml" access="public" static="true" returns="string">
/// 	<description> Decode special characters represented as HTML entities back into their actual characters </description>
/// 	<param name="str" type="string"> String to decode </param>
/// </function>
Fit.String.DecodeHtml = function(str)
{
	Fit.Validation.ExpectString(str);
	return str.replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

/// <function container="Fit.String" name="Hash" access="public" static="true" returns="integer">
/// 	<description> Get Java compatible Hash Code from string </description>
/// 	<param name="str" type="string"> String to get hash code from </param>
/// </function>
Fit.String.Hash = function(str)
{
	Fit.Validation.ExpectString(str);

	if (str.length == 0) return 0;

	var hash = 0;
	var chr = '';

	for (var i = 0 ; i < str.length ; i++)
	{
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash = hash & hash;
	}

	return hash;
}

/// <function container="Fit.String" name="UpperCaseFirst" access="public" static="true" returns="string">
/// 	<description> Returns string with first letter upper cased </description>
/// 	<param name="str" type="string"> String to turn first letter into upper case </param>
/// </function>
Fit.String.UpperCaseFirst = function(str)
{
	Fit.Validation.ExpectString(str);

	if (str === "")
		return str;

	return str[0].toUpperCase() + str.slice(1);
}


// =====================================
// Date
// =====================================

Fit.Date = {};

/// <function container="Fit.Date" name="Format" access="public" static="true" returns="string">
/// 	<description>
/// 		Format instance of Date.
/// 		Example: Fit.Date.Format(new Date(), &quot;YYYY-MM-DD hh:mm:ss&quot;);
/// 		Result: 2016-06-18 15:23:48
///
/// 		Date can be formatted using the following variables:
/// 		YYYY: 4 digits year (e.g. 2016)
/// 		YY: 2 digits year (e.g. 16)
/// 		MM: 2 digits month (e.g. 04)
/// 		M: Prefer 1 digit month if possible (e.g. 4)
/// 		DD: 2 digits day (e.g. 09)
/// 		D: Prefer 1 digit day if possible (e.g. 9)
/// 		W: 1 digit week number (e.g. 35)
/// 		hh: 2 digits hours value (e.g. 08)
/// 		h: 1 digit hours value if possible (e.g. 8)
/// 		mm: 2 digits minutes value (e.g. 02)
/// 		m: 1 digit minutes value if possible (e.g. 2)
/// 		ss: 2 digits seconds value (e.g. 05)
/// 		s: 1 digit seconds value if possible (e.g. 5)
/// 	</description>
/// 	<param name="date" type="Date"> Date to format as string </param>
/// 	<param name="format" type="string"> Date format </param>
/// </function>
Fit.Date.Format = function(date, format)
{
	Fit.Validation.ExpectDate(date);
	Fit.Validation.ExpectString(format);

	format = format.replace(/YYYY/g, date.getFullYear().toString());
	format = format.replace(/YY/g, date.getFullYear().toString().substring(2));
	format = format.replace(/Y/g, parseInt(date.getFullYear().toString().substring(2), 10).toString());
	format = format.replace(/MM/g, ((date.getMonth() + 1 <= 9) ? "0" : "") + (date.getMonth() + 1));
	format = format.replace(/M/g, (date.getMonth() + 1).toString());
	format = format.replace(/DD/g, ((date.getDate() <= 9) ? "0" : "") + date.getDate());
	format = format.replace(/D/g, date.getDate().toString());
	format = format.replace(/W/g, Fit.Date.GetWeek(date).toString());
	format = format.replace(/hh/g, ((date.getHours() <= 9) ? "0" : "") + date.getHours());
	format = format.replace(/h/g, date.getHours().toString());
	format = format.replace(/mm/g, ((date.getMinutes() <= 9) ? "0" : "") + date.getMinutes());
	format = format.replace(/m/g, date.getMinutes().toString());
	format = format.replace(/ss/g, ((date.getSeconds() <= 9) ? "0" : "") + date.getSeconds());
	format = format.replace(/s/g, date.getSeconds().toString());

	return format;
}

/// <function container="Fit.Date" name="Parse" access="public" static="true" returns="Date">
/// 	<description>
/// 		Parse date as string into an instance of Date - example: 18-09/2016 17:03:21
/// 	</description>
/// 	<param name="strDate" type="string"> Date as string </param>
/// 	<param name="format" type="string">
/// 		Specify date format used to allow parser to determine which parts of the string
/// 		is Year, Month, Day, etc. The same variables used for Fit.Date.Format
/// 		can be used, except for W (week).
/// 		Since the parser do not need to know the length of the different parts that
/// 		makes up the Date, one can simply use the shorter variable format: Y, M, D, h, m, s.
/// 		Be aware that the Parse function does not support a Year represented by a
/// 		2 digit value, since it will be impossible to determine which century it belongs to.
/// 		Example: D-M/Y h:m:s
/// 	</param>
/// </function>
Fit.Date.Parse = function(strDate, format)
{
	Fit.Validation.ExpectString(strDate);
	Fit.Validation.ExpectString(format);

	// Format validation

	var regEx = format; // Example: D-M/Y h:m:s
	regEx = regEx.replace(/Y{1,4}/, "\\d{4}");
	regEx = regEx.replace(/M{1,2}/, "\\d{1,2}");
	regEx = regEx.replace(/D{1,2}/, "\\d{1,2}");
	regEx = regEx.replace(/h{1,2}/, "\\d{1,2}");
	regEx = regEx.replace(/m{1,2}/, "\\d{1,2}");
	regEx = regEx.replace(/s{1,2}/, "\\d{1,2}");
	regEx = regEx.replace(/\//g, "\\/"); // Allow use of slash by escaping it (/ => \/)
	regEx = "^" + regEx + "$";
	var regExp = new RegExp(regEx);

	if (regExp.test(strDate) === false)
		throw "InvalidDateFormat - Value '" + strDate + "' does not match format '" + format + "'";

	// Extract numbers from string date

	var regex = /\d+/g;
	var match = null;
	var matches = [];

	while ((match = regex.exec(strDate)) !== null)
	{
		Fit.Array.Add(matches, match[0]);
	}

	// Construct array with supported date parts

	var date = new Date(); //new Date(0); // Jan 01 1970 01:00:00

	var parts =
	[
		{ Name: "Year", Key: "Y", Index: -1, Value: date.getFullYear() },
		{ Name: "Month", Key: "M", Index: -1, Value: date.getMonth() + 1 },
		{ Name: "Day", Key: "D", Index: -1, Value: date.getDate() },
		{ Name: "Hours", Key: "h", Index: -1, Value: date.getHours() },
		{ Name: "Minutes", Key: "m", Index: -1, Value: date.getMinutes() },
		{ Name: "Seconds", Key: "s", Index: -1, Value: date.getSeconds() }
	];

	// Create getter that allows us to retrieve date part value by its Key

	parts.getVal = function(key/*, asString*/)
	{
		var res = null;

		Fit.Array.ForEach(this, function(part)
		{
			if (key === part.Key)
			{
				res = part.Value;
				return false;
			}
		});

		return res;
	}

	// Determine where various date parts are found in date string

	Fit.Array.ForEach(parts, function(part)
	{
		part.Index = format.indexOf(part.Key);
	});

	// Sort date parts accordingly to order in date string

	parts.sort(function(a, b)
	{
		return ((a.Index !== -1) ? a.Index : 999999) - ((b.Index !== -1) ? b.Index : 999999);
	});

	// Update date part values previously parsed out from date string using RegEx

	var idx = -1;

	Fit.Array.ForEach(parts, function(part)
	{
		if (part.Index !== -1)
		{
			idx++;

			if (idx > matches.length - 1)
				throw "InvalidDateFormat - " + part.Name + " not found in value";

			part.Value = parseInt(matches[idx], 10); // Radix (10) set to prevent some implementations of ECMAScript (e.g. on IE8) to intepret the value as octal (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

			if (part.Key === "Y" && part.Value < 1000) // In case value was specified as e.g. 0001 or 0111
				throw "InvalidDataFormat - value '" + part.Value + "' is not valid for '" + part.Name + "'";
			if (part.Key === "M" && (part.Value < 0 || part.Value > 12))
				throw "InvalidDataFormat - value '" + part.Value + "' is not valid for '" + part.Name + "'";
			if (part.Key === "D" && (part.Value < 0 || part.Value > 31))
				throw "InvalidDataFormat - value '" + part.Value + "' is not valid for '" + part.Name + "'";
			if (part.Key === "h" && (part.Value < 0 || part.Value > 23))
				throw "InvalidDataFormat - value '" + part.Value + "' is not valid for '" + part.Name + "'";
			if ((part.Key === "m" || part.Key === "s") && (part.Value < 0 || part.Value > 59))
				throw "InvalidDataFormat - value '" + part.Value + "' is not valid for '" + part.Name + "'";

			if (part.Key === "M")
				part.Value = part.Value - 1; // Month is zero-based
		}
	});

	var dt = new Date(parts.getVal("Y"), parts.getVal("M"), parts.getVal("D", true), 0, 0, 0);

	dt.setHours(parseInt(parts.getVal("h"), 10));
	dt.setMinutes(parseInt(parts.getVal("m"), 10));
	dt.setSeconds(parseInt(parts.getVal("s"), 10));

	return dt;
}

/// <function container="Fit.Date" name="GetWeek" access="public" static="true" returns="integer">
/// 	<description> Get ISO 8601 week number from date </description>
/// 	<param name="date" type="Date"> Date to get week number from </param>
/// </function>
Fit.Date.GetWeek = function(date) // ISO 8601 - use MomentJS for wider support!
{
	Fit.Validation.ExpectDate(date);

	// https://en.wikipedia.org/wiki/Date_and_time_representation_by_country
	// https://en.wikipedia.org/wiki/Week#Week_numbering
	// http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889 (ISO 8601)

	var d = new Date(date.getTime()); // Copy date - do not modify original

	d.setHours(0, 0, 0); // Set hours, minutes, and seconds
	d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Set to nearest Thursday (make Sunday day no. 7 instead of 0)

	var yearStart = new Date(d.getFullYear(), 0, 1);
	var week = Math.ceil((((d.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000)) + 1) / 7);

	return week;

	// http://javascript.about.com/library/blweekyear.htm
	//var janFirst = new Date(date.getFullYear(), 0, 1);
	//return Math.ceil((((date - janFirst) / 86400000) + janFirst.getDay() + ((useIso8601 !== true) ? 1 : 0) ) / 7);
}


// =====================================
// Color
// =====================================

Fit.Color = {};

/// <function container="Fit.Color" name="RgbToHex" access="public" static="true" returns="string">
/// 	<description> Convert RGB colors into HEX color string - returns Null in case of invalid RGB values </description>
/// 	<param name="r" type="integer"> Color index for red </param>
/// 	<param name="g" type="integer"> Color index for green </param>
/// 	<param name="b" type="integer"> Color index for blue </param>
/// </function>
Fit.Color.RgbToHex = function(r, g, b)
{
	Fit.Validation.ExpectNumber(r);
	Fit.Validation.ExpectNumber(g);
	Fit.Validation.ExpectNumber(b);

	if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255)
		return null;

    var rHex = r.toString(16);
    var gHex = g.toString(16);
    var bHex = b.toString(16);

    return ("#" + ((rHex.length === 1) ? "0" : "") + rHex + ((gHex.length === 1) ? "0" : "") + gHex + ((bHex.length === 1) ? "0" : "") + bHex).toUpperCase();
}

/// <function container="Fit.Color" name="HexToRgb" access="public" static="true" returns="string">
/// 	<description> Convert HEX color string into RGB color string - returns Null in case of invalid HEX value </description>
/// 	<param name="hex" type="string"> HEX color string, e.g. #C0C0C0 (hash symbol is optional) </param>
/// </function>
Fit.Color.HexToRgb = function(hex)
{
	Fit.Validation.ExpectString(hex);

	var rgb = Fit.Color.ParseHex(hex);

	if (rgb === null)
		return null;

	return "rgb(" + rgb.Red + ", " + rgb.Green + ", " + rgb.Blue + ")";
}

/// <function container="Fit.Color" name="ParseHex" access="public" static="true" returns="object">
/// 	<description> Convert HEX color string into RGB color object, e.g. { Red: 150, Green: 30, Blue: 185 } - returns Null in case of invalid HEX value </description>
/// 	<param name="hex" type="string"> HEX color string, e.g. #C0C0C0 (hash symbol is optional) </param>
/// </function>
Fit.Color.ParseHex = function(hex)
{
	Fit.Validation.ExpectString(hex);

	var result = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

	if (result === null)
		return null;

	return { Red: parseInt(result[1], 16), Green: parseInt(result[2], 16), Blue: parseInt(result[3], 16) };
}

/// <function container="Fit.Color" name="ParseRgb" access="public" static="true" returns="object">
/// 	<description>
/// 		Parses RGB(A) string and turns result into a RGB(A) color object, e.g.
/// 		{ Red: 100, Green: 100, Blue: 100, Alpha: 0.3 } - returns Null in case of invalid value.
/// 	</description>
/// 	<param name="val" type="string"> RGB(A) color string, e.g. rgba(100, 100, 100, 0.3) or simply 100,100,200,0.3 </param>
/// </function>
Fit.Color.ParseRgb = function(val)
{
	Fit.Validation.ExpectString(val);

	// Parse colors from rgb[a](r, g, b[, a]) string
	var result = val.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(\s*,\s*(\d*.*\d+))*/); // http://regex101.com/r/rZ7rO2/9

	if (result === null)
		return null;

	var c = {};
	c.Red = parseInt(result[1], 10);
	c.Green = parseInt(result[2], 10);
	c.Blue = parseInt(result[3], 10);
	c.Alpha = ((result[5] !== undefined) ? parseFloat(result[5]) : 1.00);

	return c;
}
