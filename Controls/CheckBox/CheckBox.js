/// <container name="Fit.Controls.CheckBox">
/// 	Simple CheckBox control.
/// 	Extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.CheckBox" name="CheckBox" access="public">
/// 	<description> Create instance of CheckBox control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.CheckBox = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var checkbox = null;
	var label = null;
	var width = { Value: -1, Unit: "px" };	// Initial width - a value of -1 indicates that size adjusts to content
	var orgChecked = false;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	// ============================================
	// Init
	// ============================================

	function init()
	{
		me.AddCssClass("FitUiControlCheckBox");
		me.GetDomElement().tabIndex = 0;

		checkbox = document.createElement("div");
		Fit.Dom.AddClass(checkbox, "fa");
		Fit.Dom.AddClass(checkbox, "fa-check");

		Fit.Events.AddHandler(me.GetDomElement(), "click", function(e)
		{
			if (me.Enabled() === true)
			{
				//var orgVal = orgChecked;
				me.Checked(!me.Checked(), true);
				//orgChecked = orgVal;
			}
		});
		Fit.Events.AddHandler(me.GetDomElement(), "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (me.Enabled() === true && ev.keyCode === 32) // Spacebar
			{
				//var orgVal = orgChecked;
				me.Checked(!me.Checked(), true);
				//orgChecked = orgVal;

				Fit.Events.PreventDefault(ev); // Prevent scroll
			}
		});

		label = document.createElement("span");

		me._internal.AddDomElement(checkbox);
		me._internal.AddDomElement(label);

		me.Enabled(true);
		me.Checked(false);
		me.Width(-1);
	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (focus === true)
				me.GetDomElement().focus();
			else
				me.GetDomElement().blur();
		}

		// Fit.Dom.Contained(..) portion added to support IE which incorrectly assigns focus to contained elements, even though tabIndex is not set
		return (document.activeElement === me.GetDomElement() || (document.activeElement && Fit.Dom.Contained(me.GetDomElement(), document.activeElement)));
	}

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var valStr = val.toLowerCase();

			if (valStr === "true")
			{
				me.Checked(true);
			}
			else if (valStr === "false")
			{
				me.Checked(false);
			}
		}

		return ((me.Checked() === true) ? "true" : "false");
	}

	/// <function container="Fit.Controls.CheckBox" name="Checked" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is checked </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, control's checked state is updated to specified value </param>
	/// </function>
	this.Checked = function(val, preserveDirtyState) // preserveDirtyState is for internal use only - do not add to documentation!
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(preserveDirtyState, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var before = (Fit.Dom.Data(me.GetDomElement(), "checked") === "true");

			Fit.Dom.Data(me.GetDomElement(), "checked", val.toString());

			if (preserveDirtyState !== true)
				orgChecked = (Fit.Dom.Data(me.GetDomElement(), "checked") === "true");

			if (before !== val)
			{
				repaint();
				me._internal.FireOnChange();
			}
		}

		return (Fit.Dom.Data(me.GetDomElement(), "checked") === "true");
	}

	/// <function container="Fit.Controls.CheckBox" name="Width" access="public" returns="object">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit) // Differs from ControlBase.Width(..) when -1 is passed - this control resets to width:auto while ControlBase resets to width:200px
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				width = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				me.GetDomElement().style.width = width.Value + width.Unit;
			}
			else
			{
				width = { Value: -1, Unit: "px" };
				me.GetDomElement().style.width = ""; // Notice: width:auto is applied in CheckBox.css
			}
		}

		return width;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (orgChecked !== me.Checked());
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		me.Checked(false);
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		// This will destroy control - it will no longer work!

		me = checkbox = label = width = orgChecked = isIe8 = null;

		base();
	});

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.CheckBox" name="Label" access="public" returns="string">
	/// 	<description> Get/set label associated with checkbox </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, label is updated to specified value </param>
	/// </function>
	this.Label = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			label.innerHTML = val;
		}

		return label.innerHTML;
	}

	/// <function container="Fit.Controls.CheckBox" name="Enabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is enabled or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If specified, True enables control, False disables it </param>
	/// </function>
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Dom.Data(me.GetDomElement(), "enabled", val.toString());
			me.GetDomElement().tabIndex = ((val === true) ? 0 : -1);
		}

		return (Fit.Dom.Data(me.GetDomElement(), "enabled") === "true");
	}

	// ============================================
	// Private
	// ============================================

	function repaint()
	{
		if (isIe8 === true)
		{
			// IE8 does not update pseudo elements properly.
			// Changing CSS classes or content within the control
			// is not sufficient - we actually have to remove the
			// control temporarily from the DOM to make it update.
			// Unfortunately this results in focus being lost if
			// control had focus, so we have to restore it as well.

			var focused = document.activeElement;

			var elm = document.createElement("");
			Fit.Dom.Replace(checkbox, elm);
			Fit.Dom.Replace(elm, checkbox);

			if (document.activeElement !== focused)
				focused.focus();
		}
	}

	init();
}
