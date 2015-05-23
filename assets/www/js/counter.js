var sid = readCookie('PHPSESSID');
if (sid === '')
{
   sid = createPHPSESSID();
   document.cookie="PHPSESSID=" + sid;
}

function counter(seite,rang)
{
   try
   {
      var params = 'sid='+sid+'&woher='+document.referrer+'&url='+document.domain+'&seite='+seite+'&screen='+screen.width+'x'+screen.height+'&rang='+rang;
      if(XMLHttpRequest)
      {
         var xhr = new XMLHttpRequest();
         xhr.open('POST', 'https://kein-design.de/counter.php');
         xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         xhr.setRequestHeader("Content-length", params.length);
         xhr.send(params);
      }
   }
   catch(err)
   {
      console.log(err);
      return;
   }
}

function readCookie(cname)
{
   var name = cname + "=";
   var ca = document.cookie.split(';');
   for(var i=0; i<ca.length; i++)
   {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
   }
   return "";
}

function createPHPSESSID()
{
   var s = [];
   var digits = "0123456789abcdefghijklmnopqrstuvwxyz";
   for (var i = 0; i < 24; i++)
   {
     s[i] = digits.substr(Math.floor(Math.random() * 36), 1);
   }

   return(s.join(""));
}