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
   Vorschau: function(dateString)
   {
      var jahr = dateString.substr(0,4) * 1;
      var month = dateString.substr(5,2) - 1;
      var tag = dateString.substr(8,2);
      $("#VorschauDatum").datepicker( "setDate", new Date(jahr, month, tag));
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
   Vorschau: function()
   {
      var dateObject = $("#VorschauDatum").datepicker("getDate");
      var TagDatum = $.datepicker.formatDate("yy-mm-dd", dateObject);

      if (TagDatum == app.heute.Tag)
      {
         document.getElementById('leftVorschau').className = 'softy';
         document.getElementById('leftVorschau').onclick = function(){};
      }
      else
      {
         document.getElementById('leftVorschau').className = 'full';
         document.getElementById('leftVorschau').onclick = function()
         {
            var dateObject = $("#VorschauDatum").datepicker("getDate");
            var TagDatum = $.datepicker.formatDate("yy-mm-dd", dateObject);
            app.fillForecastHourly(getDatum.Tag(TagDatum,-1));
         };
      }

      var maxDate = getDatum.Tag('',9);
      if (TagDatum == maxDate)
      {
         document.getElementById('rightVorschau').className = 'softy';
         document.getElementById('rightVorschau').onclick = function(){};
      }
      else
      {
         document.getElementById('rightVorschau').className = 'full';
         document.getElementById('rightVorschau').onclick = function()
         {
            var dateObject = $("#VorschauDatum").datepicker("getDate");
            var TagDatum = $.datepicker.formatDate("yy-mm-dd", dateObject);
            app.fillForecastHourly(getDatum.Tag(TagDatum,+1));
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

function setWindCircle(canvas,WindData,type)
{
   var angle =
   {
      O:    0,
      OSO:  1,
      SO:   2,
      SSO:  3,
      S:    4,
      SSW:  5,
      SW:   6,
      WSW:  7,
      W:    8,
      WNW:  9,
      NW:   10,
      NNW:  11,
      N:    12,
      NNO:  13,
      NO:   14,
      ONO:  15
   }
   var ctx = canvas.getContext("2d");
   var centerX = canvas.width / 2;
   var centerY = canvas.height / 2;

   var radi =
   {
      big: 60,
      small: 32,
      tiny: 25
   };

   var radius = radi[type];
   ctx.beginPath();
   ctx.fillStyle = "#FFFFFF";
   ctx.arc(centerX,centerY,radius,0,2*Math.PI);
   ctx.closePath();
   ctx.fill();
   ctx.strokeStyle="#FFD37A";
   ctx.stroke();
   ctx.textAlign = 'center';
   ctx.fillStyle = 'black';
   var bft1 = getBeaufort(WindData.WindSpeed);
   if (!WindData.WindGust)
   {
      var bft2 = bft1;
   }
   else
   {
      var bft2 = getBeaufort(WindData.WindGust);
   }
   if (bft1 === bft2)
   {
      var bft = bft1;
   }
   else
   {
      var bft = bft1 + '-' + bft2;
   }
   if (type === 'big')
   {
      ctx.font =  'bold 12px Verdana';
      ctx.fillText(WindData.WindDir,centerX,centerY - 22);
      ctx.fillText(WindData.WindSpeed + ' km/h',centerX,centerY - 5);
      ctx.fillText('Böen ' + WindData.WindGust + ' km/h',centerX,centerY + 12);
      ctx.fillText(bft + ' Bft',centerX,centerY + 29);
      var arrLen = 15;
      var arrArc = 0.1;
   }
   else if (type === 'small')
   {
      ctx.font =  '9px Verdana';
      ctx.fillText(WindData.WindDir,centerX,centerY - 13);
      ctx.fillText(WindData.WindSpeed + ' km/h',centerX,centerY - 3);
      ctx.fillText(WindData.WindGust + ' km/h',centerX,centerY + 7);
      ctx.fillText(bft + ' Bft',centerX,centerY + 17);
      var arrLen = 9;
      var arrArc = 0.15;
   }
   else
   {
      ctx.font =  '9px Verdana';
      ctx.fillText(WindData.WindDir,centerX,centerY - 9);
      ctx.fillText(WindData.WindSpeed + ' km/h',centerX,centerY + 2);
      ctx.fillText(bft + ' Bft',centerX,centerY + 14);
      var arrLen = 7;
      var arrArc = 0.18;
   }
   ctx.save();
   ctx.translate(centerX,centerY);
   ctx.rotate((angle[WindData.WindDir] * Math.PI/8));
   ctx.strokeStyle="#FFD37A";
   ctx.fillStyle = "#FFD37A";
   var x = radius * Math.cos(arrArc);
   var y = radius * Math.sin(arrArc);
   ctx.beginPath();
   ctx.moveTo(radius - arrLen,0);
   ctx.lineTo(x,-y);
   ctx.arc(0,0,radius,0.1,0.1);
   ctx.closePath();
   ctx.fill();
   ctx.stroke();
   ctx.restore();
}
function getBeaufort(v)
{
    if (v < 1) return 0;
    if (v < 5) return 1;
    if (v < 11) return 2;
    if (v < 19) return 3;
    if (v < 28) return 4;
    if (v < 38) return 5;
    if (v < 49) return 6;
    if (v < 61) return 7;
    if (v < 74) return 8;
    if (v < 88) return 9;
    if (v < 102) return 10;
    if (v < 117) return 11;
    return 12;
}
function showDay(obj)
{
   app.fillForecastHourly(obj.children[0].value);
}