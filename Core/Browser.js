/// <container name="Fit.Browser">
/// 	Provides access to various browser information.
///
/// 	// Example code
///
/// 	var browserName = Fit.Browser.GetBrowser();
/// 	var browserVersion = Fit.Browser.GetVersion();
/// 	var browserLanguage = Fit.Browser.GetLanguage();
///
/// 	if (browserName === &quot;MSIE&quot; &amp;&amp; browserVersion &lt; 7)
/// 	{
/// 		&#160;&#160;&#160;&#160; if (browserLanguage === &quot;da&quot;)
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;Opgrader venligst til IE7 eller nyere&quot;);
/// 		&#160;&#160;&#160;&#160; else
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;Please upgrade to IE7 or newer&quot;);
/// 	}
/// </container>
Fit.Browser = {};
Fit._internal.Browser = {};

/// <function container="Fit.Browser" name="GetBrowser" access="public" static="true" returns="string">
/// 	<description> Returns browser name. Possible values are: Chrome, Safari, Edge, MSIE, Firefox, Opera, Unknown </description>
/// </function>
Fit.Browser.GetBrowser = function()
{
	var agent = navigator.userAgent;

	if (agent.indexOf("Edge/") > -1) // Check Edge first, it contain portions from Chrome's and Safari's user agent strings
		return "Edge";
	if (agent.indexOf("Chrome") > -1)
		return "Chrome";
	if (agent.indexOf("Safari") > -1)
		return "Safari";
	if (agent.indexOf("MSIE") > -1 || agent.indexOf("Trident") > -1)
		return "MSIE";
	if (agent.indexOf("Firefox") > -1)
		return "Firefox";
	if (agent.indexOf("Opera") > -1)
		return "Opera";

	return "Unknown";
}

/// <function container="Fit.Browser" name="GetVersion" access="public" static="true" returns="integer">
/// 	<description> Returns major version number for known browsers, -1 for unknown browsers </description>
/// </function>
Fit.Browser.GetVersion = function()
{
	var start = 0;
	var end = 0;
	var agent = navigator.userAgent;

	if (Fit.Browser.GetBrowser() === "Edge")
	{
		start = agent.indexOf("Edge/");
		start = (start !== -1 ? start + 5 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "Chrome")
	{
		start = agent.indexOf("Chrome/");
		start = (start !== -1 ? start + 7 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "Safari")
	{
		start = agent.indexOf("Version/");
		start = (start !== -1 ? start + 8 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "MSIE")
	{
		if (agent.indexOf("MSIE") > -1)
		{
			start = agent.indexOf("MSIE ");
			start = (start !== -1 ? start + 5 : 0);
			end = agent.indexOf(".", start);
			end = (end !== -1 ? end : 0);
		}
		else if (agent.indexOf("Trident") > -1) // IE11+
		{
			start = agent.indexOf("rv:");
			start = (start !== -1 ? start + 3 : 0);
			end = agent.indexOf(".", start);
			end = (end !== -1 ? end : 0);
		}
	}
	if (Fit.Browser.GetBrowser() === "Firefox")
	{
		start = agent.indexOf("Firefox/");
		start = (start !== -1 ? start + 8 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "Opera")
	{
		start = agent.indexOf("Version/");
		start = (start !== -1 ? start + 8 : -1);

		if (start === -1)
		{
			start = agent.indexOf("Opera/");
			start = (start !== -1 ? start + 6 : -1);
		}

		if (start === -1)
		{
			start = agent.indexOf("Opera ");
			start = (start !== -1 ? start + 6 : -1);
		}

		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}

	if (start !== 0 && start !== 0)
		return parseInt(agent.substring(start, end));

	return -1;
}

/// <function container="Fit.Browser" name="GetQueryString" access="public" static="true" returns="object">
/// 	<description>
/// 		Returns query string object contain the following properties:
/// 		 - Url:string (Full URL)
/// 		 - Parameters:object (associative object array with URL parameters as keys)
/// 		 - Anchor:string (anchor if set, otherwise Null)
/// 	</description>
/// </function>
Fit.Browser.GetQueryString = function()
{
	var qs = { Url: null, Parameters: {}, Anchor: null };

	var url = location.href;
	var params = ((url.indexOf("?") > -1) ? url.split("?")[1] : "");
	var anchor = null;

	params = ((params.indexOf("#") > -1) ? params.split("#")[0] : params);
	anchor = ((url.indexOf("#") > -1) ? url.split("#")[1] : null);

	qs.Url = url;
	qs.Anchor = anchor;

	Fit.Array.ForEach(((params !== "") ? params.split("&") : []), function(p)
	{
		var keyval = p.split("=");
		qs.Parameters[keyval[0]] = ((keyval.length > 1) ? decodeURIComponent(keyval[1]) : "");
	});

	return qs;
}

/// <function container="Fit.Browser" name="GetLanguage" access="public" static="true" returns="string">
/// 	<description> Returns browser language - e.g. &quot;da&quot; (Danish), &quot;en&quot; (English) etc. </description>
/// </function>
Fit.Browser.GetLanguage = function()
{
	var lang = null;

	if (navigator.language)
		lang = navigator.language.toLowerCase();
	else if (navigator.browserLanguage)
		lang = navigator.browserLanguage.toLowerCase();

	if (lang === null || lang === "")
		return "en";

	if (lang.length === 2)
		return lang;

	if (lang.length === 5)
		return lang.substring(0, 2);

	return "en";
}

/// <function container="Fit.Browser" name="GetPageWidth" access="public" static="true" returns="integer">
/// 	<description> Returns page width in pixels </description>
/// </function>
Fit.Browser.GetPageWidth = function()
{
	var w = 0;

	if (window.innerWidth) // W3C
		w = window.innerWidth;
	else if (document.documentElement && document.documentElement.clientWidth) // IE 6-8 (not quirks mode)
		w = document.documentElement.clientWidth;

	return w;
}

/// <function container="Fit.Browser" name="GetPageHeight" access="public" static="true" returns="integer">
/// 	<description> Returns page height in pixels </description>
/// </function>
Fit.Browser.GetPageHeight = function()
{
	var h = 0;

	if (window.innerHeight) // W3C
		h = window.innerHeight;
	else if (document.documentElement && document.documentElement.clientHeight) // IE 6-8 (not quirks mode)
		h = document.documentElement.clientHeight;

	return h;
}

/// <function container="Fit.Browser" name="GetViewPortDimensions" access="public" static="true" returns="object">
/// 	<description> Returns object with Width and Height properties specifying dimensions of viewport </description>
/// </function>
Fit.Browser.GetViewPortDimensions = function()
{
	return { Width: Fit.Browser.GetPageWidth(), Height: Fit.Browser.GetPageHeight() };
}

/// <function container="Fit.Browser" name="GetScrollPosition" access="public" static="true" returns="object">
/// 	<description> Returns object with X and Y properties specifying scroll position </description>
/// </function>
Fit.Browser.GetScrollPosition = function()
{
	var x = document.body.scrollLeft || document.documentElement.scrollLeft || window.pageXOffset || 0;
	var y = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;

	return { X: x, Y: y };
}

/// <function container="Fit.Browser" name="GetScreenWidth" access="public" static="true" returns="integer">
/// 	<description> Get screen width </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenWidth = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);

	if (onlyAvailable === true)
		return window.screen.availWidth;

	return window.screen.width;
}

/// <function container="Fit.Browser" name="GetScreenHeight" access="public" static="true" returns="integer">
/// 	<description> Get screen height </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenHeight = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);

	if (onlyAvailable === true)
		return window.screen.availHeight;

	return window.screen.height;
}

/// <function container="Fit.Browser" name="GetScreenDimensions" access="public" static="true" returns="object">
/// 	<description> Returns object with Width and Height properties specifying screen dimensions </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. Start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenDimensions = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);
	return { Width: Fit.Browser.GetScreenWidth(onlyAvailable), Height: Fit.Browser.GetScreenHeight(onlyAvailable) };
}

/// <function container="Fit.Browser" name="IsMobile" access="public" static="true" returns="boolean">
/// 	<description> Returns value indicating whether devices currently being used is a mobile device or not </description>
/// 	<param name="includeTablets" type="boolean" default="true"> Value indicating whether tablets are considered mobile devices or not </param>
/// </function>
Fit.Browser.IsMobile = function(includeTablets)
{
	Fit.Validation.ExpectBoolean(includeTablets, true);

	// Based on http://detectmobilebrowsers.com
	// See About section for Tablet support: http://detectmobilebrowsers.com/about

	var nav = navigator.userAgent || navigator.vendor;

	if (includeTablets !== false && /android|ipad|playbook|silk/i.test(nav))
		return true;

	return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(nav) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(nav.substr(0,4)));
}


/// <function container="Fit.Browser" name="Log" access="public" static="true">
/// 	<description> Log message or object </description>
/// 	<param name="msg" type="object"> Message or object to log </param>
/// </function>
Fit.Browser.Log = function(msg) // msg not validated - any object or value (including null/undefined) can be logged
{
	if (window.console)
		console.log(msg);
}

/// <function container="Fit.Browser" name="GetInfo" access="public" static="true" returns="object">
/// 	<description> Returns cached object with browser information available through Name, Version, and Language properties </description>
/// </function>
Fit.Browser.GetInfo = function()
{
	if (!Fit._internal.Browser.Info)
	{
		Fit._internal.Browser.Info = {};

		Fit._internal.Browser.Info.Name = Fit.Browser.GetBrowser();
		Fit._internal.Browser.Info.Version = Fit.Browser.GetVersion();
		Fit._internal.Browser.Info.Language = Fit.Browser.GetLanguage();
		Fit._internal.Browser.Info.IsMobile = Fit.Browser.IsMobile();
		Fit._internal.Browser.Info.IsPhone = Fit.Browser.IsMobile(false); // Phone only
		Fit._internal.Browser.Info.IsTablet = (Fit.Browser.IsMobile() === true && Fit.Browser.IsMobile(false) === false); // Tablet only
	}

	return Fit.Core.Clone(Fit._internal.Browser.Info); // Clone to ensure values are not shared and potentially changed
}

/// <function container="Fit.Browser" name="IsStorageSupported" access="public" static="true" returns="boolean">
/// 	<description> Returns value indicating whether Session and Local storage is supported or not </description>
/// </function>
Fit.Browser.IsStorageSupported = function()
{
	if (Fit._internal.Browser.StorageSupported === undefined)
	{
		Fit._internal.Browser.StorageSupported = false;

		try
		{
			if (window.localStorage && window.sessionStorage)
			{
				var x = "__FITUITEST__";

				localStorage.setItem(x, x);
				localStorage.removeItem(x);

				sessionStorage.setItem(x, x);
				sessionStorage.removeItem(x);

				Fit._internal.Browser.StorageSupported = true;
			}
		}
		catch (err)
		{
		}
	}

	return Fit._internal.Browser.StorageSupported;
}
