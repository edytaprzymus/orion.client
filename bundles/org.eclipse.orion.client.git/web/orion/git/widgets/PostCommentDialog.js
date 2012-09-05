/*******************************************************************************
 * @license
 * Copyright (c) 2011, 2012 IBM Corporation and others. 
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/
/*global define window dojo dijit dojox orion*/
/*jslint browser:true */

define(['i18n!git/nls/gitmessages', 'dojo', 'dijit', 'dojox', 'dijit/Dialog', 'dojo/data/ItemFileReadStore', 'dojox/form/Uploader', 'dojox/form/uploader/FileList', 
        'dojox/form/uploader/plugins/IFrame', 'dijit/form/Button','dijit/form/CheckBox','dijit/ProgressBar', 'orion/widgets/_OrionDialogMixin', 
        'text!orion/git/widgets/templates/PostCommentDialog.html'], 
        function(messages, dojo, dijit, dojox) {

/**
 */
dojo.declare("orion.git.widgets.PostCommentDialog", [ dijit.Dialog, orion.widgets._OrionDialogMixin ], { //$NON-NLS-0$
	widgetsInTemplate : true,
	templateString : dojo.cache('orion', 'git/widgets/templates/PostCommentDialog.html'), //$NON-NLS-1$ //$NON-NLS-0$

	constructor : function() {
		this.inherited(arguments);
		this.options = arguments[0] || {};
	},
	postMixInProperties : function() {
		this.inherited(arguments);
		this.title = this.options.title;
	},
	
	postCreate : function() {
		var that = this;
		this.inherited(arguments);
		if(this.options.weakMatched && !this.options.matched){
			for(var i=0;i<this.options.processUrls.length;i++){
				if(i===0){
					dojo.create("div", {"name": "bugzilla", "id": "radioDiv" + i, "type" : "radio"}, dojo.byId("bugzillaRadios"));
					dojo.create("input", {"name": "bugzilla", "id": "radio" + i, "type" : "radio"}, dojo.byId("radioDiv" + i));
					dojo.create("label", {"for": "radio" + i, "innerHTML" : this.options.bugzillaNames[i]}, dojo.byId("radioDiv" + i) );
					var radio = new dijit.form.RadioButton({
		            checked: true,
		            value: this.options.processUrls[i],
		            name: "bugzilla"
		            },"radio" + i);
	            }
	            else{
	            	dojo.create("div", {"name": "bugzilla", "id": "radioDiv" + i, "type" : "radio"}, dojo.byId("bugzillaRadios"));
					dojo.create("input", {"name": "bugzilla", "id": "radio" + i, "type" : "radio"}, dojo.byId("radioDiv" + i));
					dojo.create("label", {"for": "radio" + i, "innerHTML" : this.options.bugzillaNames[i]}, dojo.byId("radioDiv" + i) );
					var radio = new dijit.form.RadioButton({
		            checked: false,
		            value: this.options.processUrls[i],
		            name: "bugzilla"
		            },"radio" + i);
	            }
			}
		}
		else{
			this.bugzillaRadiosLabel.innerHTML = "You are going to post your comment on " + this.options.bugzillaName;
		}
		if(this.options.defaultBugId){
			this.bugIdInput.value = this.options.defaultBugId;
		}
		dojo.connect(this.bugIdInput, "onchange", dojo.hitch(this, this.validate));
		if(this.bugIdInput.value && this.options.general){
			this.okButton.disabled = false;
		}
		if(this.options.general.length>0){
			this.commentPreview.innerHTML = this.options.preview;
		}

	},
	
	execute: function(){
		var that = this;
		if(this.options.matched){
			location.href = this.options.urls[this.options.index] + "&comment=" + this.options.preview;
		}
		else{
			for(var i=0;i<this.options.processUrls.length;i++){
				var checked = dojo.attr(dojo.byId("radio" + i),"aria-pressed");
				if(checked){
					that.index = i;
					break;
				}
			}
			var refs = that.options.serviceRegistry.getServiceReferences("orion.git.bugzilla");
			var service = that.options.serviceRegistry.getService(refs[that.index]);
			service.run(this.bugIdInput.value).then(
				function(result){
					location.href = result + "&comment=" + that.options.preview;
				}
			);
		
		}
		
	},

	validate: function(){
		if(this.bugIdInput.value && this.options.general){
			this.okButton.disabled = false;
		}
		else{
			this.okButton.disabled = true;
		}
	
	}
});

});