/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app =
{
   // Application Constructor
   initialize: function(isRestart)
   {
      var isSupported = (("WebSocket" in window && window.WebSocket != undefined) || ("MozWebSocket" in window));
      if (!isSupported)
      {
         document.body.innerHTML = "Dieser Browser unterstützt keine Web-Sockets.<br>" +
                                   "Leider lassen sich die Wetterdaten deshalb nicht darstellen.<br>" +
                                   "Installieren Sie einen neuere Version Ihres Browsers um diese Seite zu öffnen.";
         return;
      }

      if (window.innerWidth < 320)
      {
         document.body.innerHTML = "Dieser Bildschirm ist leider zu klein für diese App. Vielleicht klappt es ja im Querformat.";
         return;
      }
      this.types = new Array;
      this.types[0] = 'Akt';
      this.types[1] = 'Tag';
      this.types[2] = 'Monat';
      this.types[3] = 'Jahr';
      this.types[4] = 'Jahre';
      this.typesCount = 5;

      this.startJahr = 2009;

      this.isCordovaApp = !!window.cordova;
      this.widthLimits = new Array(323,641,959,1277,1595);
      this.naviWidth   = new Array(323,641,959,1277,1595);
      this.baeumeLeft  = new Array(0,158,318);
      this.baeumeRight = new Array(0,158,318);
      this.left = [];
      var scrollDelta = 318;

      if ($(window).width() == 320)
      {
         window.scrollTo(2,0);
         this.left[0] = 2;
         this.left[1] = scrollDelta + 2;
         this.left[2] = scrollDelta * 2 + 2;
         this.left[3] = scrollDelta * 3 + 2;
         this.left[4] = scrollDelta * 4 + 2;
      }
      else
      {
         window.scrollTo(0, 0);
         this.left[0] = 0;
         this.left[1] = scrollDelta + 1;
         this.left[2] = scrollDelta * 2 + 1;
         this.left[3] = scrollDelta * 3 + 1;
         this.left[4] = scrollDelta * 4 + 3;
      }

      this.lastTimestamp = '';
      this.connected = false;
      this.weather;
      this.heute = {};
      this.TagDatumPicker;
      this.MonatDatumPicker;
      this.displayedDate = {};
      this.leftScrollOld = 0;
      this.leftCon = 1;
      this.timer = null;

      // init dates
      this.setHeute();
      this.setupDateFields();

      if (this.isCordovaApp)
      {
         this.geoloctimer = window.setTimeout('setGeoLocation()',10000);
      }

      this.arrangeMap();
      document.getElementById('datenBlock').style.visibility = 'visible';

      this.bindEvents();
      if (!this.isCordovaApp || isRestart)
      {
         this.onDeviceReady();
      }
   },
   // Bind Event Listeners
   bindEvents: function()
   {
      document.addEventListener('deviceready', this.onDeviceReady, false);
      $(window).on("orientationchange", function(event)
      {
         window.setTimeout(app.onDeviceReady(),400);
      });

      window.onresize = app.arrangeMap;
      document.addEventListener("menubutton", toggleInfoWindowBlock, false);

      window.onscroll = function()
      {
         app.doScrolling();
      };

      document.addEventListener("resume", function()
      {
         app.weather.connect();
      });

      document.addEventListener("pause", function()
      {
         app.weather.disconnect();
      });
   },

   // deviceready Event Handler
   onDeviceReady: function()
   {
      if (typeof(app.weather) == 'undefined' || app.weather.disconnected)
      {
         if (typeof(device) != 'undefined')
         {
            app.queryext = '&platform=' + device.platform + '&version=' + device.version + '&model=' + device.model;
         }
         else
         {
            app.queryext = '&platform=&version=&model=';
         }
         app.client = (app.isCordovaApp) ? 'App' : 'Browser';
         app.weather = io.connect('https://socken.fehngarten.de',
                                 {
                                    timeout: 5000,
                                    'sync disconnect on unload' : true,
                                    query: 'client=' + app.client + app.queryext
                                 });

         window.setTimeout('app.setupVergleichsCons()',4000);

         app.weather.on('connect_timeout',function(e)
         {
            clearTimeout(app.geoloctimer);
            console.log('connect_timeout');
            document.getElementById('offline').style.display = 'block';
         });

         app.weather.on('error',function(e)
         {
            clearTimeout(app.geoloctimer);
            console.log('websocket error ' + e); 
            document.getElementById('offline').style.display = 'block';
         });

         app.weather.on('data',function(data)
         {
            app.fillPage(data);
            document.getElementById('offline').style.display = 'none';
         })

         app.weather.on('graphic',function(data)
         {
            //console.log('Grafik erhalten: ' + data.Datum + ' - ' + data.type);

            if (data.Datum == app.displayedDate[data.type])
            {
               document.getElementById(data.id).src = data.stream;
            }
            if (data.type == 'Jahr' && document.getElementById(data.id + data.Datum))
            {
               document.getElementById(data.id + data.Datum).src = data.stream;
            }
            document.getElementById('offline').style.display = 'none';
         })

         app.weather.on('successWarningEntry',function(data)
         {
            successWarningEntry(data);
         })

      }
      else
      {
         console.log(app.weather);
         app.weather.emit('refresh',{});
         app.setupVergleichsCons();
      }
   },

   fillPage: function(data)
   {
      // Zahlenwerte schreiben
      for (var section in data)
      {
         if (section != 'Akt')
         {
            if (data[section].special.Datum > app.heute[section])
            {
               app.initialize(true);
               return;
            }
         }
         if (section == 'Akt' || data[section].special.Datum == app.displayedDate[section])
         {
            for (fieldName in data[section].values)
            {
               if (document.getElementById(section + fieldName))
               {
                  document.getElementById(section + fieldName).innerHTML = data[section].values[fieldName];
               }
            }
         }
      }

      // Spezialfelder
      if (typeof(data.Akt) != 'undefined' && typeof(data.Akt.special) != 'undefined')
      {
         if (typeof(data.Akt.special.Forcast) != 'undefined')
         {
            document.getElementById('aussichtenImg').src = data.Akt.special.Forcast;
         }
         if (typeof(data.Akt.special.sonnenProzent) != 'undefined')
         {
            var canvas = document.getElementById("AktSonne");
            var ctx = canvas.getContext("2d");
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var radius = 100;
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(centerX,centerY,radius,0,2*Math.PI);
            ctx.closePath();
            ctx.fill();
            //ctx.strokeStyle="#764c24";
            ctx.strokeStyle="#FFD37A";
            ctx.stroke();
            ctx.fillStyle = "#FFFF00";
            ctx.beginPath();
            var sradius = Math.sqrt(data.Akt.special.sonnenProzent / 100) * 100;
            ctx.arc(centerX,centerY,sradius,0,2*Math.PI,true);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle="#EBD700";
            ctx.stroke();
         }
         if (typeof(data.Akt.special.soilfrostProb) != 'undefined')
         {
            document.getElementById('soilfrostHtml').innerHTML = data.Akt.special.soilfrostHtml;
            document.getElementById('soilfrostProbText').innerHTML = data.Akt.special.soilfrostProb + '%';
            var colorwidth = 312 * data.Akt.special.soilfrostProb / 100;
            document.getElementById('soilfrostProbColor').style.width = colorwidth + 'px';
         }
      }
   },
   setupVergleichsCons: function()
   {
      var conSonne = new Array();
      var imgSonne = new Array();
      var conRegen = new Array();
      var imgRegen = new Array();
      var conTemperatur = new Array();
      var imgTemperatur = new Array();
      var conWindmax = new Array();
      var imgWindmax = new Array();
      var conLuftdruck = new Array();
      var imgLuftdruck = new Array();
      for (var jahr = app.startJahr; jahr <= app.heute.Jahr; jahr++)
      {
         conSonne[jahr] = document.createElement('div');
         conSonne[jahr].className = 'grafikbox';
         conSonne[jahr].textContent = 'Sonnenenergie ' + jahr;
         document.getElementById('vergleichsCon0').appendChild(conSonne[jahr]);
         imgSonne[jahr] = document.createElement('img');
         imgSonne[jahr].id = 'grafikJahrSonne' + jahr;
         conSonne[jahr].appendChild(imgSonne[jahr]);

         conTemperatur[jahr] = document.createElement('div');
         conTemperatur[jahr].className = 'grafikbox';
         conTemperatur[jahr].textContent = 'Temperatur ' + jahr + ' in °C';
         document.getElementById('vergleichsCon1').appendChild(conTemperatur[jahr]);
         imgTemperatur[jahr] = document.createElement('img');
         imgTemperatur[jahr].id = 'grafikJahrTemperatur' + jahr;
         conTemperatur[jahr].appendChild(imgTemperatur[jahr]);

         conRegen[jahr] = document.createElement('div');
         conRegen[jahr].className = 'grafikbox';
         conRegen[jahr].textContent = 'Niederschlag ' + jahr + ' in mm';
         document.getElementById('vergleichsCon2').appendChild(conRegen[jahr]);
         imgRegen[jahr] = document.createElement('img');
         imgRegen[jahr].id = 'grafikJahrRegen' + jahr;
         conRegen[jahr].appendChild(imgRegen[jahr]);

         conWindmax[jahr] = document.createElement('div');
         conWindmax[jahr].className = 'grafikbox';
         conWindmax[jahr].textContent = 'Windgeschwindigkeit ' + jahr + ' in km/h';
         document.getElementById('vergleichsCon3').appendChild(conWindmax[jahr]);
         imgWindmax[jahr] = document.createElement('img');
         imgWindmax[jahr].id = 'grafikJahrWindmax' + jahr;
         conWindmax[jahr].appendChild(imgWindmax[jahr]);

         conLuftdruck[jahr] = document.createElement('div');
         conLuftdruck[jahr].className = 'grafikbox';
         conLuftdruck[jahr].textContent = 'rel. Luftdruck ' + jahr + ' in hPa';
         document.getElementById('vergleichsCon4').appendChild(conLuftdruck[jahr]);
         imgLuftdruck[jahr] = document.createElement('img');
         imgLuftdruck[jahr].id = 'grafikJahrLuftdruck' + jahr;
         conLuftdruck[jahr].appendChild(imgLuftdruck[jahr]);

         var data =
         {
            dateString: jahr,
            type:       'Jahr'
         }
         app.weather.emit('getSpecificData',data);
      }
      var pos = $('#dummyPos').offset();
      var vergleichsTop = pos.top + 6;
      document.getElementById('vergleichsBlock').style.top = vergleichsTop + 'px';
      document.getElementById('vergleichsBlock').style.visibility = 'visible';

      var anzJahre = app.heute.Jahr - app.startJahr + 1;
      var monatsTop = pos.top + 168 * anzJahre + 42;
      document.getElementById('monatsBlock').style.top = monatsTop + 'px';
      document.getElementById('monatsBlock').style.visibility = 'visible';

      var vergleichsMonat = document.getElementById('MonatsDatum');
      var months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
      for (var month = 1; month < 13; month++)
      {
         var option = document.createElement('option');
         option.value = pad(month,2);
         option.innerHTML = months[month - 1];
         if (option.value == app.heute.Monats)
         {
            option.selected = 'selected';
         }
         vergleichsMonat.appendChild(option);
      }
      vergleichsMonat.onchange = function()
      {
         app.requestMonatsGraph();
      };
      conSonneMonat = document.createElement('div');
      conSonneMonat.className = 'grafikbox';
      conSonneMonat.textContent = 'Sonnenenergie';
      document.getElementById('monatsCon0').appendChild(conSonneMonat);
      imgSonneMonat = document.createElement('img');
      imgSonneMonat.id = 'grafikMonatsSonne';
      conSonneMonat.appendChild(imgSonneMonat);

      conTemperaturMonat = document.createElement('div');
      conTemperaturMonat.className = 'grafikbox';
      conTemperaturMonat.textContent = 'Temperatur in °C';
      document.getElementById('monatsCon1').appendChild(conTemperaturMonat);
      imgTemperaturMonat = document.createElement('img');
      imgTemperaturMonat.id = 'grafikMonatsTemperatur';
      conTemperaturMonat.appendChild(imgTemperaturMonat);

      conRegenMonat = document.createElement('div');
      conRegenMonat.className = 'grafikbox';
      conRegenMonat.textContent = 'Niederschlag in mm';
      document.getElementById('monatsCon2').appendChild(conRegenMonat);
      imgRegenMonat = document.createElement('img');
      imgRegenMonat.id = 'grafikMonatsRegen';
      conRegenMonat.appendChild(imgRegenMonat);

      conWindmaxMonat = document.createElement('div');
      conWindmaxMonat.className = 'grafikbox';
      conWindmaxMonat.textContent = 'Windgeschwindigkeit in km/h';
      document.getElementById('monatsCon3').appendChild(conWindmaxMonat);
      imgWindmaxMonat = document.createElement('img');
      imgWindmaxMonat.id = 'grafikMonatsWindmax';
      conWindmaxMonat.appendChild(imgWindmaxMonat);

      conLuftdruckMonat = document.createElement('div');
      conLuftdruckMonat.className = 'grafikbox';
      conLuftdruckMonat.textContent = 'rel. Luftdruck in hPa';
      document.getElementById('monatsCon4').appendChild(conLuftdruckMonat);
      imgLuftdruckMonat = document.createElement('img');
      imgLuftdruckMonat.id = 'grafikMonatsLuftdruck';
      conLuftdruckMonat.appendChild(imgLuftdruckMonat);

      app.requestMonatsGraph();
   },
   requestMonatsGraph: function()
   {
      app.displayedDate['Monats'] = document.getElementById('MonatsDatum').value;
      var data =
      {
         dateString: document.getElementById('MonatsDatum').value,
         type:       'Monats'
      }
      app.weather.emit('getSpecificData',data);
   },
   setupDateFields: function()
   {
      // Tagesdatum
      $.datepicker.setDefaults( $.datepicker.regional["de"]);
      $("#TagDatum").datepicker(
      {
         dateFormat: "d. MM yy",
         altFormat: "yy-mm-dd",
         minDate: "2. Juni 2009",
         maxDate: "+0d",
         changeMonth: true,
         changeYear: true,
         beforeShow : function(input, inst)
         {
             $('#ui-datepicker-div').removeClass('monthPickerWindow');
         },
         onSelect: function(value,date)
         {
              var dateObj = $(this).datepicker("getDate");
              var TagDatum = $.datepicker.formatDate("yy-mm-dd", dateObj);
              app.getSpecificData(TagDatum,'Tag');
         }
      })
      $("#TagDatum").datepicker( "setDate", app.heute.Tag);
      setArrows.Tag();

      // Monat einstellen
      this.monthPicker = new monthPicker(document.getElementById('MonatDatum'),
      {
         minYear: 2009,
         minMonth: 6,
         maxMonth: 'now',
         maxYear: 'now',
         initMonth: 'now',
         initYear: 'now',
         lang: 'de',
         leftArrow: 'leftMonat',
         rightArrow: 'rightMonat',
         onchanged: function(newDate)
         {
            app.getSpecificData(newDate,'Monat');
         }
      });
      setArrows.Monat();

      // Jahr einstellen
      var select = document.getElementById('JahrDatum');
      var option = document.createElement("option");
      option.text = app.heute.Jahr;
      option.value = app.heute.Jahr;
      option.selected = true;
      select.add(option);
      for (var jahr = app.heute.Jahr - 1;jahr >= 2009;jahr--)
      {
         var option = document.createElement("option");
         option.text = jahr;
         option.value = jahr;
         select.add(option);
      }

      select.onchange = function()
      {
         app.getSpecificData(document.getElementById('JahrDatum').value,'Jahr');
      }
      setArrows.Jahr();
   },
   setHeute: function()
   {
      app.heute =
      {
         Tag: getDatum.Tag('',0),
         Monat: getDatum.Monat('',0),
         Monats: getDatum.Monats('',0),
         Jahr: getDatum.Jahr('',0),
         Jahre: getDatum.Jahr('',0) - 1
      }

      for (type in app.heute)
      {
         app.displayedDate[type] = app.heute[type];
      }
   },
   getSpecificData:  function(dateString,type)
   {

      setDateField[type](dateString);
      setArrows[type]();

      $("td[id^='" + type + "']").val('');

      var data =
      {
         dateString: dateString,
         type:       type
      }

      app.weather.emit('getSpecificData',data);

   },
   arrangeMap: function()
   {
      app.conCount = app.typesCount;
      for (var i = 1; i < app.typesCount; i++)
      {
         if ($(window).width() < app.widthLimits[i])
         {
            app.conCount = i;
            break;
         }
      }

      app.handleScrollIcons();
      app.handleBaeume();

      var overlayWidth = Math.max(0,($(window).width() - app.widthLimits[app.conCount - 1]) / 2);
      var naviWidth = app.widthLimits[app.conCount - 1];

      document.getElementById('leftOverlay').style.width = (+overlayWidth + 1) + 'px';
      document.getElementById('rightOverlay').style.width = (+overlayWidth + 1) + 'px';

      document.getElementById('naviBlock').style.width = naviWidth + 'px';
      document.getElementById('naviBlock').style.left = overlayWidth + 'px';

      document.getElementById('datenBlock').style.left = (+overlayWidth + 0) + 'px';
      document.getElementById('datenBlock').style.paddingRight = (overlayWidth - 1) + 'px';

      document.getElementById('monatsKopf').style.width = naviWidth + 'px';
      document.getElementById('monatsBlock').style.left = overlayWidth + 'px';

      document.getElementById('vergleichsKopf').style.width = naviWidth + 'px';
      document.getElementById('vergleichsBlock').style.left = overlayWidth + 'px';
   },
   doScrolling: function()
   {
      if (window.pageYOffset < 40)
      {
         document.getElementById('baeumeLinks').style.overflow = 'visible';
         document.getElementById('baeumeRechts').style.overflow = 'visible';
      }
      else
      {
         document.getElementById('baeumeLinks').style.overflow = 'hidden';
         document.getElementById('baeumeRechts').style.overflow = 'hidden';
      }
      if(app.timer !== null)
      {
         clearTimeout(app.timer);
      }
      app.timer = setTimeout(function()
      {
         if (app.leftScrollOld != window.pageXOffset)
         {
            var doScroll = false;
            if (window.pageXOffset != app.left[0] || window.pageXOffset != app.left[1] || window.pageXOffset != app.left[2] || window.pageXOffset != app.left[3])
            {
                doScroll = true;
                if (app.leftScrollOld < window.pageXOffset)
                {
                   if (window.pageXOffset > app.left[3])
                   {
                      scrollToX = app.left[4];
                      app.leftCon = 5;
                   }
                   else if (window.pageXOffset > app.left[2])
                   {
                      scrollToX = app.left[3];
                      app.leftCon = 4;
                   }
                   else if (window.pageXOffset > app.left[1])
                   {
                      scrollToX = app.left[2];
                      app.leftCon = 3;
                   }
                   else
                   {
                      scrollToX = app.left[1];
                      app.leftCon = 2;
                   }
                }
                else
                {
                   if (window.pageXOffset < app.left[1])
                   {
                      scrollToX = app.left[0];
                      app.leftCon = 1;
                   }
                   else if (window.pageXOffset < app.left[2])
                   {
                      scrollToX = app.left[1];
                      app.leftCon = 2;
                   }
                   else  if (window.pageXOffset < app.left[3])
                   {
                      scrollToX = app.left[2];
                      app.leftCon = 3;
                   }
                   else  if (window.pageXOffset < app.left[4])
                   {
                      scrollToX = app.left[3];
                      app.leftCon = 4;
                   }
                   else
                   {
                      scrollToX = app.left[4];
                      app.leftCon = 5;
                   }
                }
            }
            app.leftScrollOld = window.pageXOffset;
            if (doScroll)
            {
               var overlayWidth = Math.max(0,($(window).width() - app.widthLimits[app.conCount - 1]) / 2);
               document.getElementById('vergleichsKopf').style.paddingLeft = scrollToX + 'px';
               document.getElementById('monatsKopf').style.paddingLeft = scrollToX + 'px';
               $('html, body').animate({scrollLeft: scrollToX}, 300);
            }
            app.handleScrollIcons();
         }
      }, 50);
   },
   handleScrollIcons: function()
   {
      if (app.leftCon == 1)
      {
         document.getElementById('leftScroll').style.visibility = 'hidden';
      }
      else
      {
         document.getElementById('leftScroll').style.visibility = 'visible';
      }
      if (app.leftCon + app.conCount > app.typesCount)
      {
         document.getElementById('rightScroll').style.visibility = 'hidden';
      }
      else
      {
         document.getElementById('rightScroll').style.visibility = 'visible';
      }
   },
   handleBaeume: function()
   {
      if (app.conCount < 3)
      {
         document.getElementById('baeumeLinks').style.display = 'none';
         document.getElementById('baeumeRechts').style.display = 'none';
      }
      else
      {
         document.getElementById('baeumeLinks').style.display = 'block';
         document.getElementById('baeumeRechts').style.display = 'block';
         document.getElementById('baeumeLinks').style.left = app.baeumeLeft[app.conCount - 3] + 'px';
         document.getElementById('baeumeRechts').style.right = app.baeumeRight[app.conCount - 3] + 'px';
      }
   }

};
