AFMS.GenerateVM = function() {
    function n(n, t) {
        this.id = n;
        this.name = t
    }

    function r(r, u, f, e) {
        i = r;
        jQuery.each(r, function(i, r) {
            var o = r.Label,
                s, h;
            f && (o = r.DaxField);
            switch (r.ControlType) {
                case AFMS.configKeys.SingleLineTextBox:
                    r.DaxField === AFMS.configKeys.PostalCodeEntityPath && (o = "postalcode");
                    u[o] = r.RegEx != "" && r.MatchesWith == null ? ko.observable("").extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        },
                        pattern: {
                            params: new RegExp(r.RegEx),
                            message: r.ErrorMessage
                        }
                    }) : ko.observable("").extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        }
                    });
                    r.DaxField == AFMS.configKeys.LoginEntityPath && u[o].extend({
                        validation: {
                            async: !0,
                            validator: function(n, t, i) {
                                var r = {
                                    url: "/api/sitecore/AFMSAuthentication/IsUserNameTaken?username=" + n,
                                    type: "POST",
                                    success: function(n) {
                                        n != AFMS.configKeys.True ? i({
                                            isValid: !0,
                                            message: "User name is not taken"
                                        }) : i({
                                            isValid: !1,
                                            message: jQuery("#UserExistErrorMessage").val()
                                        })
                                    },
                                    error: function() {}
                                };
                                jQuery.ajax(r)
                            },
                            message: "Error Message"
                        },
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        },
                        pattern: {
                            params: new RegExp(r.RegEx),
                            message: r.ErrorMessage
                        }
                    });
                    r.DaxField == AFMS.configKeys.NickNameEntityPath && (u[o].extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        },
                        pattern: {
                            params: new RegExp(r.RegEx),
                            message: r.ErrorMessage
                        }
                    }), e != undefined && e != null && e.hasOwnProperty("shoppingCartModel") && e.shoppingCartModel.hasOwnProperty("ExistingNicknames") && e.shoppingCartModel.hasOwnProperty("errAlreadyExtNickName") && u[o].extend({
                        validation: {
                            validator: function(n, t) {
                                return t.indexOf(n.toUpperCase()) === -1
                            },
                            message: e.shoppingCartModel.errAlreadyExtNickName,
                            params: e.shoppingCartModel.ExistingNicknames
                        }
                    }));
                    r.MatchesWith != null && (s = "", s = t(r.MatchesWith, s, f), u[o].extend({
                        validation: [{
                            getValue: function(n) {
                                return typeof n == "function" ? n() : n
                            },
                            validator: function(n, t) {
                                return n === this.getValue(t)
                            },
                            message: r.ErrorMessage,
                            params: u[s]
                        }]
                    }));
                    break;
                case AFMS.configKeys.Password:
                    u[o] = r.RegEx != "" && r.MatchesWith == null ? ko.observable("").extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        },
                        pattern: {
                            params: new RegExp(r.RegEx),
                            message: r.ErrorMessage
                        }
                    }) : ko.observable("").extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        }
                    });
                    r.MatchesWith != null && (s = "", s = t(r.MatchesWith, s, f), u[o].extend({
                        validation: [{
                            getValue: function(n) {
                                return typeof n == "function" ? n() : n
                            },
                            validator: function(n, t) {
                                return n === this.getValue(t)
                            },
                            message: r.ErrorMessage,
                            params: u[s]
                        }]
                    }));
                    break;
                case AFMS.configKeys.DropDown:
                    if (r.SelectionList != null) {
                        switch (r.DaxField) {
                            case AFMS.configKeys.RegionEntityPath:
                                o = "province";
                                break;
                            case AFMS.configKeys.CountryEntityPath:
                                o = "country"
                        }
                        u[o] = ko.observableArray();
                        h = "selected" + o;
                        jQuery.each(r.SelectionList, function(t, i) {
                            u[o].push(new n(i.Value, i.Text))
                        });
                        u[h] = ko.observable(u[o]()[0]).extend({
                            required: {
                                onlyIf: function() {
                                    return r.IsRequired === AFMS.configKeys.True
                                },
                                message: r.RequiredFieldMessage
                            }
                        });
                        u[h + "name"] = ko.computed(function() {
                            return u[h]() && u[h]().name
                        });
                        u[h + "id"] = ko.computed(function() {
                            return u[h]() && u[h]().id
                        })
                    }
                    break;
                case AFMS.configKeys.CheckBox:
                    u[o] = ko.observable(!1).extend({
                        equal: {
                            params: !0,
                            message: r.ErrorMessage
                        }
                    })
            }
        });
        u.errors = ko.validation.group(u, {
            observable: !0,
            deep: !0
        });
        u.isValid = function() {
            return u.errors().length < 1
        }
    }

    function u(r, u, f) {
        var e, o;
        if (console.log(" WithMapping started "), u == "undefined" || u == null) {
            console.log("objectToMapFrom is invalid");
            return
        }
        i = r;
        o = "";
        jQuery.each(r, function(i, r) {
            var c, s, h;
            r.DaxField != null && (c = r.DaxField.split("."), o = c.reduce(function(n, t) {
                if (n != null) {
                    if (n.hasOwnProperty(t)) return n[t];
                    console.log(t + " is not found ")
                }
            }, u));
            e = r.Label;
            switch (r.ControlType) {
                case AFMS.configKeys.SingleLineTextBox:
                    f[e] = r.RegEx != "" && r.MatchesWith == null ? ko.observable(o).extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        },
                        pattern: {
                            params: new RegExp(r.RegEx),
                            message: r.ErrorMessage
                        }
                    }) : ko.observable(o).extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        }
                    });
                    r.MatchesWith != null && (s = "", s = t(r.MatchesWith, s), f[e].extend({
                        validation: [{
                            getValue: function(n) {
                                return typeof n == "function" ? n() : n
                            },
                            validator: function(n, t) {
                                return n === this.getValue(t)
                            },
                            message: r.ErrorMessage,
                            params: f[s]
                        }]
                    }));
                    break;
                case AFMS.configKeys.Password:
                    f[e] = r.RegEx != "" && r.MatchesWith == null ? ko.observable().extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        },
                        pattern: {
                            params: new RegExp(r.RegEx),
                            message: r.ErrorMessage
                        }
                    }) : ko.observable().extend({
                        required: {
                            onlyIf: function() {
                                return r.IsRequired === AFMS.configKeys.True
                            },
                            message: r.RequiredFieldMessage
                        }
                    });
                    r.MatchesWith != null && (s = "", s = t(r.MatchesWith, s), f[e].extend({
                        validation: [{
                            getValue: function(n) {
                                return typeof n == "function" ? n() : n
                            },
                            validator: function(n, t) {
                                return n === this.getValue(t)
                            },
                            message: r.ErrorMessage,
                            params: f[s]
                        }]
                    }));
                    break;
                case AFMS.configKeys.DropDown:
                    if (r.SelectionList != undefined || r.SelectionList != null) {
                        switch (r.DaxField) {
                            case AFMS.configKeys.RegionEntityPath:
                                e = "province";
                                break;
                            case AFMS.configKeys.RegionEntityPath:
                                e = "country"
                        }
                        f[e] = ko.observableArray();
                        h = "selected" + e;
                        jQuery.each(r.SelectionList, function(t, i) {
                            f[e].push(new n(i.Value, i.Text));
                            i.Selected && (f[h] = ko.observable(new n(i.Value, i.Text)))
                        });
                        f[h] = ko.observable(AFMS.Common.getSelectedKeyValuePair(f[e](), o, !0)).extend({
                            required: {
                                onlyIf: function() {
                                    return r.IsRequired === AFMS.configKeys.True
                                },
                                message: r.RequiredFieldMessage
                            }
                        });
                        f[h + "name"] = ko.computed(function() {
                            return f[h]() && f[h]().name
                        });
                        f[h + "id"] = ko.computed(function() {
                            return f[h]() && f[h]().id
                        })
                    }
                    break;
                case AFMS.configKeys.Label:
                    f[e] = ko.observable(o)
            }
        });
        f.errors = ko.validation.group(f, {
            observable: !0,
            deep: !0
        });
        f.isValid = function() {
            return f.errors().length < 1
        }
    }

    function t(n, t, r) {
        return jQuery.each(i, function(i, u) {
            u.DaxField === n && (t = u.Label, r && (t = u.DaxField))
        }), t
    }
    var i;
    return {
        WithCustomFields: r,
        WithMapping: u,
        keyValue: n
    }
}();
AFMS.UpdateVM = function() {
    function n(n, t, i) {
        var r, u;
        console.log(" WithMapping started ");
        fields = n;
        u = "";
        jQuery.each(n, function(n, f) {
            var o, s, e;
            if (f.DaxField != null && (o = f.DaxField.split("."), u = o.reduce(function(n, t) {
                    if (n != null) {
                        if (n.hasOwnProperty(t)) return n[t];
                        console.log(t + " is not found ")
                    }
                }, t)), r = f.Label, i.hasOwnProperty(r)) switch (f.ControlType) {
                case AFMS.configKeys.SingleLineTextBox:
                    i[r](u);
                    break;
                case AFMS.configKeys.Password:
                    i[r]("");
                    break;
                case AFMS.configKeys.DropDown:
                    if (f.SelectionList != undefined || f.SelectionList != null) {
                        switch (f.DaxField) {
                            case AFMS.configKeys.RegionEntityPath:
                                r = "province";
                                break;
                            case AFMS.configKeys.CountryEntityPath:
                                r = "country"
                        }
                        s = "selected" + r;
                        e = [];
                        jQuery.each(f.SelectionList, function(n, t) {
                            e.push(new AFMS.GenerateVM.keyValue(t.Value, t.Text))
                        });
                        i[r](e);
                        i[s](AFMS.Common.getSelectedKeyValuePair(e, u, !0))
                    }
                    break;
                case AFMS.configKeys.Label:
                    i[r](u)
            }
        })
    }
    return {
        WithObject: n
    }
}();
AFMS.Common = function() {
    function n(n, t, i) {
        if (n != undefined && t != "" && t != null) {
            var r;
            if (i ? jQuery.each(n, function(n, i) {
                    if (i.id == t) return r = n, !1
                }) : jQuery.each(n, function(n, i) {
                    if (i.name == t) return r = n, !1
                }), r != undefined) return n[r]
        } else return new AFMS.GenerateVM.keyValue(null, null)
    }
    return {
        getSelectedKeyValuePair: n
    }
}();
AFMS.Util = {
    toJS: function(n) {
        return JSON.parse(JSON.stringify(n))
    }
};
AFMS.configKeys = {
    True: "True",
    SingleLineTextBox: "singlelinetextbox",
    DropDown: "dropdown",
    Label: "label",
    Password: "password",
    CheckBox: "checkbox",
    SignIn: {
        Login: "Login",
        Password: "Password"
    },
    AddExCard: {
        CardNumber: "CardNumber",
        VerificationNumber: "VerificationNumber",
        createapin: "createapin",
        cardnickname: "cardnickname",
        confirmpin: "confirmpin"
    }
};
AFMS.GetMonthName = function() {
    var t = new Date,
        n = [];
    return n[0] = "January", n[1] = "February", n[2] = "March", n[3] = "April", n[4] = "May", n[5] = "June", n[6] = "July", n[7] = "August", n[8] = "September", n[9] = "October", n[10] = "November", n[11] = "December", n[t.getMonth()]
};
AFMS.GetMonthNames = function(n) {
    var i = n,
        t = [];
    return t[1] = "January", t[2] = "February", t[3] = "March", t[4] = "April", t[5] = "May", t[6] = "June", t[7] = "July", t[8] = "August", t[9] = "September", t[10] = "October", t[11] = "November", t[12] = "December", t[i]
};
