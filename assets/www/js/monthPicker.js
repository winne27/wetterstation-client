var monthPicker = function(inputField,options)
{
   var currentTime = new Date()
   this.currentMonth = ('0' + (+currentTime.getMonth() + 1)).substr(-2);
   this.currentYear = currentTime.getFullYear()
   this.inputField = inputField;
   this.datestring = '';
   this.onchanged = function(){};

   inputField.onclick = function(e)
   {
      var pos = $(inputField).offset();
      _this.monthPickerBox.style.display = 'block';
      _this.monthPickerBox.style.top = +pos.top + $(inputField).outerHeight() + 'px';
      _this.monthPickerBox.style.left = pos.left + 'px';
      _this.monthPickerBox.style.position = 'absolute';
     e.stopPropagation();
     $(document).on('click', function (e)
     {
          if ($(e.target).closest(_this.monthPickerBox).length === 0)
          {
              _this.close();
          }
      });
   }

   var monthsLang =
   {
      en:
      {
         long:  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
         short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      de:
      {
         long: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
         short: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      }
   }

   if (typeof(options.onchanged) != 'undefined')
   {
      this.onchanged = options.onchanged;
   }

   if (typeof(options.lang) == 'undefined')
   {
      this.lang = 'de';
   }
   else
   {
      this.lang = options.lang;
   }

   if (typeof(options.monthtype) == 'undefined')
   {
      this.monthtype = 'long';
   }
   else
   {
      this.monthtype = options.monthtype;
   }

   this.months = monthsLang[this.lang][this.monthtype];

   // minMonth setzen
   if (typeof(options.minMonth) == 'undefined')
   {
      this.minMonth = '01';
   }
   else if (options.minMonth == 'now')
   {
      this.minMonth = this.currentMonth;
   }
   else
   {
      this.minMonth = ('0' + options.minMonth).substr(-2);
   }

   // maxMonth setzen
   if (typeof(options.maxMonth) == 'undefined')
   {
      this.maxMonth = '12';
   }
   else if (options.maxMonth == 'now')
   {
      this.maxMonth = this.currentMonth;
   }
   else
   {
      this.maxMonth = ('0' + options.maxMonth).substr(-2);
   }

   // initMonth setzen
   if (typeof(options.initMonth) == 'undefined' || options.initMonth == 'now')
   {
      this.initMonth = this.currentMonth;
   }
   else
   {
      this.initMonth = ('0' + options.initMonth).substr(-2);
   }

   // minYear setzen
   if (typeof(options.minYear) == 'undefined')
   {
      this.minYear = this.currentYear - 25;
   }
   else if (options.minYear == 'now')
   {
      this.minYear = this.currentYear;
   }
   else
   {
      this.minYear = options.minYear;
   }

   // maxYear setzen
   if (typeof(options.maxYear) == 'undefined')
   {
      this.maxYear = this.currentYear + 5;
   }
   else if (options.maxYear == 'now')
   {
      this.maxYear = this.currentYear;
   }
   else
   {
      this.maxYear = options.maxYear;
   }

   // initYear setzen
   if (typeof(options.initYear) == 'undefined' || options.initYear == 'now')
   {
      this.initYear = this.currentYear;
   }
   else
   {
      this.initYear = options.initYear;
   }

   this.maxDate = this.maxYear + '-' + this.maxMonth;
   this.minDate = this.minYear + '-' + this.minMonth;

   // create unique tag for ids
   this.tag = 'monthPicker';

   for (var i = 0;i > 0;i++)
   {
      j = i;
      if (!document.getElementById(tag + j)) break;
   }
   this.tag = this.tag + i;

   this.monthPickerBox = document.createElement('div');
   this.monthPickerBox.id = this.tag + 'Box';
   this.monthPickerBox.className = 'ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all';
   this.monthPickerBox.style.display = 'none';

   var monthPickerHeader = document.createElement('div');
   monthPickerHeader.id = this.tag + 'Header';
   monthPickerHeader.className = 'ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all';
   this.monthPickerBox.appendChild(monthPickerHeader);

   var monthPickerSelectBox = document.createElement('div');
   monthPickerSelectBox.id = this.tag + 'SelectBox';
   monthPickerSelectBox.className = 'ui-datepicker-title';
   monthPickerHeader.appendChild(monthPickerSelectBox);

   var monthPickerActionBox = document.createElement('div');
   monthPickerActionBox.className = 'ui-monthpicker-action-box';
   this.monthPickerBox.appendChild(monthPickerActionBox);

   var monthPickerActionButton = document.createElement('div');
   monthPickerActionButton.id = this.tag + 'ActionBox';
   monthPickerActionButton.innerHTML = 'ok';
   $(monthPickerActionButton).button();
   monthPickerActionBox.appendChild(monthPickerActionButton);

   var monthPickerSelectMonth = document.createElement('select');
   monthPickerSelectMonth.id = this.tag + 'SelectMonth';
   monthPickerSelectMonth.className = 'ui-datepicker-month';
   monthPickerSelectBox.appendChild(monthPickerSelectMonth);

   var monthPickerSelectYear = document.createElement('select');
   monthPickerSelectYear.id = this.tag + 'SelectYear';
   monthPickerSelectYear.className = 'ui-datepicker-year';
   monthPickerSelectBox.appendChild(monthPickerSelectYear);

   $(monthPickerActionButton).on('click', function(event)
   {
      var newDate = document.getElementById(_this.tag + 'SelectYear').value + '-' + document.getElementById(_this.tag + 'SelectMonth').value;
      _this.setDate(newDate);
      _this.close();
      _this.onchanged(newDate);
   });

   var minMonthNum = this.minMonth / 1;
   var maxMonthNum = this.maxMonth / 1;

   for (var i = 1; i <= 12; i++)
   {
      var j = ('0' + i).substr(-2);
      var option = document.createElement('option');
      option.value = j;
      option.innerHTML = this.months[i - 1];
      option.id = this.tag + 'OptionMonth' + j;
      monthPickerSelectMonth.add(option);
   }
   monthPickerSelectMonth.value = this.initMonth;

   for (var i = this.maxYear; i >= this.minYear; i--)
   {
      var option = document.createElement('option');
      option.value = i;
      option.innerHTML = i;
      monthPickerSelectYear.add(option);
   }
   monthPickerSelectYear.value = this.initYear;
   document.body.appendChild(this.monthPickerBox);

   this.fillDateField();
   var _this = this;
}

monthPicker.prototype.setMonth = function(month)
{
   document.getElementById(this.tag + 'SelectMonth').value = month;
   this.fillDateField();
   this.datestring = this.getDate();
}

monthPicker.prototype.setYear = function(year)
{
   document.getElementById(this.tag + 'SelectYear').value = year;
   this.fillDateField();
   this.datestring = this.getDate();
}

monthPicker.prototype.setDate = function(dateString)
{
   this.setMonth(dateString.substr(5));
   this.setYear(dateString.substr(0,4));
}

monthPicker.prototype.getMonth = function()
{
   return document.getElementById(this.tag + 'SelectMonth').value;
}

monthPicker.prototype.getMonthName = function()
{
   return this.months[this.getMonthIndex()];
}

monthPicker.prototype.getMonthIndex = function()
{
   return (document.getElementById(this.tag + 'SelectMonth').value / 1 - 1);
}

monthPicker.prototype.getYear = function()
{
   return document.getElementById(this.tag + 'SelectYear').value;
}

monthPicker.prototype.getDate = function()
{
   return document.getElementById(this.tag + 'SelectYear').value + '-' + document.getElementById(this.tag + 'SelectMonth').value;
}

monthPicker.prototype.getDateText = function()
{
   return this.inputField.value;
}

monthPicker.prototype.fillDateField = function()
{
   this.inputField.value = this.getMonthName() + ' ' + this.getYear();
   this.datestring = this.getDate();
}

monthPicker.prototype.isMaxDate  = function()
{
   return (this.maxDate == this.datestring);
}

monthPicker.prototype.isMinDate  = function()
{
   return (this.minDate == this.datestring);
}

monthPicker.prototype.close  = function()
{
   this.monthPickerBox.style.display = 'none';
}

