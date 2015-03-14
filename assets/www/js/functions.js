//var setDateField =
var setDateField =
{
   Tag: function(dateString)
   {
      var jahr = dateString.substr(0,4) * 1;
      var month = dateString.substr(5,2) - 1;
      var tag = dateString.substr(8,2);
      $("#TagDatum").datepicker( "setDate", new Date(jahr, month, tag));
   },
   Monat: function(dateString)
   {
      app.monthPicker.setDate(dateString);
   },
   Jahr: function(dateString)
   {
      document.getElementById('JahrDatum').value = dateString;
   }
};

var setArrows =
{
   Tag: function()
   {
      var dateObject = $("#TagDatum").datepicker("getDate");
      var TagDatum = $.datepicker.formatDate("yy-mm-dd", dateObject);
      app.displayedDate.Tag = TagDatum;
      if (TagDatum == app.heute.Tag)
      {
         document.getElementById('rightTag').className = 'softy';
         document.getElementById('rightTag').onclick = function(){};
      }
      else
      {
         document.getElementById('rightTag').className = 'full';
         document.getElementById('rightTag').onclick = function()
         {
            var dateObject = $("#TagDatum").datepicker("getDate");
            var TagDatum = $.datepicker.formatDate("yy-mm-dd", dateObject);
            app.getSpecificData(getDatum.Tag(TagDatum,+1),'Tag')
         };
      }
      if (TagDatum == '2009-06-02')
      {
         document.getElementById('leftTag').className = 'softy';
         document.getElementById('leftTag').onclick = function(){};
      }
      else
      {
         document.getElementById('leftTag').className = 'full';
         document.getElementById('leftTag').onclick = function()
         {
            var dateObject = $("#TagDatum").datepicker("getDate");
            var TagDatum = $.datepicker.formatDate("yy-mm-dd", dateObject);
            app.getSpecificData(getDatum.Tag(TagDatum,-1),'Tag')
         };
      }
   },
   Monat: function()
   {
      app.displayedDate.Monat = app.monthPicker.getDate();
      if (app.monthPicker.isMaxDate())
      {
         document.getElementById('rightMonat').className = 'softy';
         document.getElementById('rightMonat').onclick = function(){};
      }
      else
      {
         document.getElementById('rightMonat').className = 'full';
         document.getElementById('rightMonat').onclick = function()
         {
            var MonatDatum = app.monthPicker.getDate();
            app.getSpecificData(getDatum.Monat(MonatDatum,+1),'Monat')
         };
      }

      if (app.monthPicker.isMinDate())
      {
         document.getElementById('leftMonat').className = 'softy';
         document.getElementById('leftMonat').onclick = function(){};
      }
      else
      {
         document.getElementById('leftMonat').className = 'full';
         document.getElementById('leftMonat').onclick = function()
         {
            var MonatDatum = app.monthPicker.getDate();
            app.getSpecificData(getDatum.Monat(MonatDatum,-1),'Monat')
         };
      }
   },
   Jahr: function()
   {
      var JahrDatum = document.getElementById('JahrDatum').value;
      app.displayedDate.Jahr = JahrDatum;
      if (JahrDatum == app.heute.Jahr)
      {
         document.getElementById('rightJahr').className = 'softy';
         document.getElementById('rightJahr').onclick = function(){};
      }
      else
      {
         document.getElementById('rightJahr').className = 'full';
         document.getElementById('rightJahr').onclick = function()
         {
            var JahrDatum = document.getElementById('JahrDatum').value;
            app.getSpecificData(getDatum.Jahr(JahrDatum,+1),'Jahr')
         };
      }
      if (JahrDatum == '2009')
      {
         document.getElementById('leftJahr').className = 'softy';
         document.getElementById('leftJahr').onclick = function(){};
      }
      else
      {
         document.getElementById('leftJahr').className = 'full';
         document.getElementById('leftJahr').onclick = function()
         {
            var JahrDatum = document.getElementById('JahrDatum').value;
            app.getSpecificData(getDatum.Jahr(JahrDatum,-1),'Jahr')
         };
      }
   }
};

// Datumsberechnungen
var getDatum =
{
   Tag: function(datum,diff)
   {
      var trenn = '-';
      if (datum == '')
      {
         var day = new Date();
      }
      else
      {
         var day = new Date(datum.substr(0,4),datum.substr(5,2) - 1,datum.substr(8,2))
      }
      day.setDate(day.getDate() + diff);
      return day.getFullYear() + trenn + pad((+day.getMonth() + 1),2) + trenn + pad((+day.getDate()),2);
   },

   Monat: function(datum,diff)
   {
      var trenn = '-';
      if (datum == '')
      {
         var monat = new Date();
      }
      else
      {
         var monat = new Date(datum.substr(0,4),datum.substr(5,2) - 1,1);
      }
      monat.setMonth(monat.getMonth() + diff);
      return monat.getFullYear() + trenn + pad((+monat.getMonth() + 1),2);
   },

   Monats: function(datum,diff)
   {
      if (datum == '')
      {
         var monat = new Date();
      }
      else
      {
         var monat = new Date(datum.substr(0,4),datum.substr(5,2) - 1,1);
      }
      monat.setMonth(monat.getMonth() + diff);
      return pad((+monat.getMonth() + 1),2);
   },

   Jahr: function(datum,diff)
   {
      var trenn = '-';
      if (datum == '')
      {
         var jahr = new Date();
      }
      else
      {
         var jahr = new Date(datum.substr(0,4),0,1);
      }
      jahr.setFullYear(jahr.getFullYear() + diff);
      return jahr.getFullYear();
   }
};

// Datumsfelder setzen
var setDateInput =
{
   Tag: function(datum)
   {
      datumObj = document.getElementById('datumTag');
      datumObj.value = datum;
      datumObj.onchange = function()
      {
         app.getWetterdaten(1,this.value);
      }

      if (document.getElementById('datumTag').value != getDatum.Tag('',0))
      {
         document.getElementById('rightTag').className = 'full';
      }
      else
      {
         document.getElementById('rightTag').className = 'softy';
      }
   },

   Monat: function(datum)
   {
      datumObj = document.getElementById('datumMonat');
      datumObj.value = datum;
      datumObj.onchange = function()
      {
         app.getWetterdaten(2,this.value);
      }

      if (document.getElementById('datumMonat').value != getDatum.Monat('',0))
      {
         document.getElementById('rightMonat').className = 'full';
      }
      else
      {
         document.getElementById('rightMonat').className = 'softy';
      }
   },

   Jahr: function(datum)
   {
      datumObj = document.getElementById('datumJahr');
      datumObj.value = datum;
      datumObj.onchange = function()
      {
         app.getWetterdaten(3,this.value);
      }

      if (document.getElementById('datumJahr').value != getDatum.Jahr('',0))
      {
         document.getElementById('rightJahr').className = 'full';
      }
      else
      {
         document.getElementById('rightJahr').className = 'softy';
      }
   }
};

function toggleInfoWindow(displayValue)
{
   document.getElementById('infoWindow').style.top = (+window.pageYOffset + 260) + 'px';
   document.getElementById('infoWindow').style.display = displayValue;
}

function toggleInfos(container)
{
   document.getElementById('impressum').className = 'infoTextHidden';
   document.getElementById('beschreibung').className = 'infoTextHidden';
   document.getElementById('datenschutz').className = 'infoTextHidden';
   document.getElementById(container).className = 'infoText';
}

function toggleInfoWindowBlock()
{
   toggleInfoWindow('block');
}

function checkOnlineAgain()
{
   document.getElementById('offline').style.display = 'none';
   app.initialize(true);
}

function setGeoLocation()
{
   var config =
   {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 18000000
   }
   navigator.geolocation.getCurrentPosition(onGeoLocation, onGeoError, config);
}

function onGeoLocation(position)
{
  document.getElementById('entfernung').innerHTML = 'Entfernung: ' +  calcDist(position).replace('.',',') + ' km';
}

function onGeoError(msg)
{
   var doNothing = true;
}

function calcDist(position)
{
   var R = 6371; // Radius of the earth in km
   var lat1 = position.coords.latitude
   var lon1 = position.coords.longitude
   var lat2 = +53.09037;
   var lon2 = +7.56912;
   var dLat = deg2rad(lat2-lat1);  // deg2rad below
   var dLon = deg2rad(lon2-lon1);
   var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   var d = R * c; // Distance in km
   return d.toFixed(3);
}

function deg2rad(deg)
{
   return deg * (Math.PI/180);
}

function pad(number, length)
{
    var str = '' + number;
    while (str.length < length)
    {
        str = '0' + str;
    }
    return str;
}
function soilFrostDisplay()
{
   document.getElementById('soilFrostDisplay').style.display = 'block';
   document.getElementById('soilFrostDisplay').style.top = (+window.pageYOffset + 280) + 'px';
}
function requestWarningEntry(type)
{
   var data =
   {
      email: document.getElementById('email').value,
      type: type
   }
   app.weather.emit('requestWarningEntry',data);
}
function successWarningEntry(data)
{
   if (data.err === true)
   {
      alert(data.msg.code);
   }
   else
   {
      document.getElementById('warningRequestAnswer').style.display = 'block';
      document.getElementById('warningRequestAnswer').style.top = (+window.pageYOffset + 280) + 'px';
   }
}
function monatsShift(dir)
{
   var monat = +document.getElementById('MonatsDatum').value + dir;
   if (monat == 0) monat = 12;
   if (monat == 13) monat = 1;
   monat = pad(monat,2);
   document.getElementById('MonatsDatum').value = monat;
   app.requestMonatsGraph();
}

