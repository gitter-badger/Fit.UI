/// <container name="Fit.Controls.PickerBase">
/// 	Class from which all Picker Controls inherit.
/// 	Control developers must override: GetDomElement, Dispose.
/// 	Overriding the following functions is optional:
/// 	UpdateItemSelectionState, SetEventDispatcher, HandleEvent.
/// 	Picker Control must fire OnItemSelectionChanged when an item's
/// 	selection state is update, which is done by invoking
/// 	this._internal.FireOnItemSelectionChanged(title:string, value:string, selected:boolean)
/// </container>
Fit.Controls.PickerBase = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);

	// Support for Fit.Controls.Find(..)

	if (Fit.Validation.IsSet(controlId) === true)
	{
		if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
			Fit.Validation.ThrowError("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

		Fit._internal.ControlBase.Controls[controlId] = this;
	}

	// Private variables

	var me = this;
	var id = (controlId ? controlId : null);

	var onShowHandlers = [];
	var onHideHandlers = [];
	var onChangeHandlers = [];

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="GetId" access="public" returns="string">
	/// 	<description> Get unique Control ID </description>
	/// </function>
	this.GetId = function()
	{
		return id;
	}

	/// <function container="Fit.Controls.PickerBase" name="MaxHeight" access="public" returns="object">
	/// 	<description> Get/set max height of control - returns object with Value (integer) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max height is updated to specified value </param>
	/// 	<param name="unit" type="string" default="undefined"> If defined, max height is updated to specified CSS unit, otherwise px is assumed </param>
	/// </function>
	this.MaxHeight = function(value, unit)
    {
		Fit.Validation.ExpectNumber(value, true);
		Fit.Validation.ExpectStringValue(unit, true);

		var elm = me.GetDomElement();

		if (Fit.Validation.IsSet(value) === true)
		{
			elm.style.maxHeight = value + ((Fit.Validation.IsSet(unit) === true) ? unit : "px");
		}

		var res = { Value: parseInt(elm.style.maxHeight), Unit: "px" };
		res.Unit = elm.style.maxHeight.replace(res.Value, "");

		return res;
    }

	// ============================================
	// Events fired by host control
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="OnShow" access="public">
	/// 	<description>
	/// 		Register event handler firered when picker control is shown in host control.
	/// 		The following argument is passed to event handler function: Sender (PickerBase).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnShow = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onShowHandlers, cb);
	}

	/// <function container="Fit.Controls.PickerBase" name="OnHide" access="public">
	/// 	<description>
	/// 		Register event handler firered when picker control is hidden in host control.
	/// 		The following argument is passed to event handler function: Sender (PickerBase).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnHide = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onHideHandlers, cb);
	}

	// ============================================
	// Events fired by picker control itself
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="OnItemSelectionChanged" access="public">
	/// 	<description>
	/// 		Register event handler firered when item selection is changed.
	/// 		The following arguments are passed to event handler function:
	/// 		Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
    this.OnItemSelectionChanged = function(cb)
    {
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onChangeHandlers, cb);
    }

	// ============================================
	// For derivatives - control developers
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description>
	/// 		Overridden by control developers (required).
	/// 		Get DOMElement representing control.
	/// 	</description>
	/// </function>
	this.GetDomElement = function()
	{
		Fit.Validation.ThrowError("Function not implemented");
	}

	/// <function container="Fit.Controls.PickerBase" name="UpdateItemSelection" access="public">
	/// 	<description>
	/// 		Overridden by control developers (optional).
	/// 		Host control invokes this function when an item's selection state is changed from host
	/// 		control. Function must result in OnItemSelectionChanged event being fired if overridden,
	/// 		which can be done using the following approach.
	///
	/// 		this._internal.FireOnItemSelectionChanged(title:string, value:string, selected:boolean);
	///
	/// 		Be aware that host control may pass information about items not found in picker,
	/// 		e.g. when pasting items which may turn out not to be valid selections.
	/// 		In this case OnItemSelectionChanged should not be fired.
	/// 	</description>
	/// 	<param name="title" type="string"> Item title </param>
	/// 	<param name="value" type="string"> Item value </param>
	/// 	<param name="selected" type="boolean"> True if item was selected, False if item was deselected </param>
	/// </function>
	this.UpdateItemSelection = function(title, value, selected)
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);
	}

	/// <function container="Fit.Controls.PickerBase" name="SetEventDispatcher" access="public" returns="DOMElement">
	/// 	<description>
	/// 		Overriden by control developers (optional).
	/// 		Host control invokes this function, passing a reference to the
	/// 		input control dispatching keyboard events using the HandleEvent function.
	/// 		This function may be called multiple times with identical or different controls.
	/// 	</description>
	/// 	<param name="control" type="DOMElement"> Event dispatcher control </param>
	/// </function>
	this.SetEventDispatcher = function(control)
	{
		Fit.Validation.ExpectDomElement(control);
	}

	/// <function container="Fit.Controls.PickerBase" name="HandleEvent" access="public">
	/// 	<description>
	/// 		Overridden by control developers (optional).
	/// 		Host control dispatches keyboard events to this function to allow
	/// 		picker control to handle keyboard navigation with keys such as
	/// 		arrow up/down/left/right, enter, space, etc.
	/// 	</description>
	/// 	<param name="e" type="Event" default="undefined"> Keyboard event to process </param>
	/// </function>
	this.HandleEvent = function(e)
	{
		Fit.Validation.ExpectEvent(e, true);
	}

	/// <function container="Fit.Controls.PickerBase" name="Dispose" access="public">
	/// 	<description>
	/// 		Overridden by control developers (required).
	/// 		Destroys control to free up memory.
	/// 	</description>
	/// </function>
	this.Dispose = function() // Must be overridden
	{
		Fit.Validation.ThrowError("Function not implemented");
	}

	// ============================================
	// Private
	// ============================================

	// Private members (must be public in order to be accessible to host control and controls inheriting from PickerBase)

	this._internal = (this._internal ? this._internal : {});

	this._internal.FireOnShow = function() // Called by Host Control
	{
		Fit.Array.ForEach(onShowHandlers, function(handler)
		{
			handler(me);
		});
	},

	this._internal.FireOnHide = function() // Called by Host Control
	{
		Fit.Array.ForEach(onHideHandlers, function(handler)
		{
			handler(me);
		});
	},

	this._internal.FireOnItemSelectionChanged = function(title, value, selected) // Called by Picker Control
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);

		Fit.Array.ForEach(onChangeHandlers, function(handler)
		{
			handler(me, { Title: title, Value: value, Selected: selected });
		});
	}
}
