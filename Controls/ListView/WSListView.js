Fit.Controls.WSListView = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ListView).Apply(ctlId);

	var me = this;
	var url = null;
	var jsonpCallback = null;
	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onAbortHandlers = [];
	var onPopulatedHandlers = [];

	function init()
	{
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.WSListView" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to WebService responsible for providing data to control.
	/// 		WebService must deliver data in the following JSON format:
	/// 		[
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 1", Value: "1001", Selectable: true, Children: [] },
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 2", Value: "1002", Selectable: false, Children: [] }
	/// 		]
	/// 		Only Value is required. Children is a collection of items with the same format as described above.
	/// 		Be aware that items are treated as a flat list, even when hierarchically structured using the Children property.
	/// 		Items with Selectable set to False will simply be ignored (not shown) while children will still be added.
	/// 	</description>
	/// 	<param name="wsUrl" type="string" default="undefined"> If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetItems) </param>
	/// </function>
	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectString(wsUrl, true);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			url = wsUrl;
		}

		return url;
	}

	/// <function container="Fit.Controls.WSListView" name="JsonpCallback" access="public" returns="string">
	/// 	<description>
	/// 		Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication.
	/// 		Often this argument is simply &quot;callback&quot;. Passing Null disables JSONP communication again.
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, enables JSONP and updates JSONP callback argument </param>
	/// </function>
	this.JsonpCallback = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true || val === null)
		{
			jsonpCallback = val;
		}

		return jsonpCallback;
	}

	/// <function container="Fit.Controls.WSListView" name="Reload" access="public">
	/// 	<description> Load/reload data from WebService </description>
	/// </function>
	this.Reload = function()
	{
		getData();
	}

	// See documentation on PickerBase
	this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
	{
		// This will destroy control - it will no longer work!

		me = url = jsonpCallback = onRequestHandlers = onResponseHandlers = onAbortHandlers = onPopulatedHandlers = null;
		base();
	});

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.WSListView" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is being requested.
	/// 		Request can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSListView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSListView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnRequest = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onRequestHandlers, cb);
	}

	/// <function container="Fit.Controls.WSListView" name="OnResponse" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is received,
	/// 		allowing for data transformation to occure before
	/// 		ListView is populated. Function receives two arguments:
	/// 		Sender (Fit.Controls.WSListView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSListView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Items: JSON items received from WebService
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnResponse = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onResponseHandlers, cb);
	}

	/// <function container="Fit.Controls.WSListView" name="OnAbort" access="public">
	/// 	<description>
	/// 		Add event handler fired if data request is canceled.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSListView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSListView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Items: JSON items received from WebService (Null in this particular case)
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnAbort = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onAbortHandlers, cb);
	}

	/// <function container="Fit.Controls.WSListView" name="OnPopulated" access="public">
	/// 	<description>
	/// 		Add event handler fired when ListView has been populated with items.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSListView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSListView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Items: JSON items received from WebService
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnPopulated = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPopulatedHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	function getData()
	{
		if (url === null)
			Fit.Validation.ThrowError("Unable to get data, no WebService URL has been specified");

		// Determine request method

		var request = null;

		if (jsonpCallback !== null)
		{
			request = new Fit.Http.JsonpRequest(url, jsonpCallback);
		}
		else if (url.toLowerCase().indexOf(".asmx/") === -1)
		{
			request = new Fit.Http.Request(url);
		}
		else
		{
			request = new Fit.Http.JsonRequest(url)
		}

		// Fire OnRequest

		var eventArgs = { Sender: me, Request: request, Items: null };

		if (fireEventHandlers(onRequestHandlers, eventArgs) === false)
			return;

		// Define request callbacks

		var onSuccess = function(data)
		{
			// Fire OnResponse

			eventArgs.Items = ((data instanceof Array) ? data : []);
			fireEventHandlers(onResponseHandlers, eventArgs);

			// Populate ListView

			me.RemoveItems();

			Fit.Array.ForEach(eventArgs.Items, function(item)
			{
				populate(item);
			});

			// Fire OnPopulated

			fireEventHandlers(onPopulatedHandlers, eventArgs);
		}

		var onFailure = function(httpStatusCode)
		{
			Fit.Validation.ThrowError("Unable to get data - request failed with HTTP Status code " + httpStatusCode)
		};

		var onAbort = function()
		{
			fireEventHandlers(onAbortHandlers, eventArgs);
		}

		// Register request callbacks

		if (Fit.Core.InstanceOf(request, Fit.Http.JsonpRequest) === false)
		{
			request.OnSuccess(function(req)
			{
				var data = request.GetResponseJson();
				onSuccess(data);
			});

			request.OnFailure(function(req)
			{
				onFailure(request.GetHttpStatus());
			});

			request.OnAbort(function(req)
			{
				onAbort();
			});
		}
		else
		{
			request.OnSuccess(function(req)
			{
				var children = req.GetResponse();
				onSuccess(children);
			});

			request.OnTimeout(function()
			{
				onFailure("UNKNOWN (JSONP)");
			});
		}

		// Invoke request

		request.Start();
	}

	function populate(jsonItem)
	{
		Fit.Validation.ExpectIsSet(jsonItem);
		Fit.Validation.ExpectString(jsonItem.Value);
		Fit.Validation.ExpectString(jsonItem.Title, true);
		Fit.Validation.ExpectBoolean(jsonItem.Selectable, true);
		Fit.Validation.ExpectArray(jsonItem.Children, true);

		if (jsonItem.Selectable !== false)
			me.AddItem((jsonItem.Title ? jsonItem.Title : jsonItem.Value), jsonItem.Value);

		if (jsonItem.Children)
		{
			Fit.Array.ForEach(jsonItem.Children, function(c)
			{
				populate(c);
			});
		}
	}

	function fireEventHandlers(handlers, eventArgs)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, eventArgs) === false)
				cancel = true; // Do not cancel loop - all handlers must be fired!
		});

		return !cancel;
	}

	init();
}
