package de.fehngarten.wetterstation;

import java.net.URISyntaxException;

import org.json.JSONException;
import org.json.JSONObject;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import android.annotation.TargetApi;
import android.app.PendingIntent;
import android.app.Service;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.hardware.display.DisplayManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;
import android.view.Display;
import android.widget.RemoteViews;

public class WetterstationWidgetService extends Service
{
   private Socket socket;
   private IO.Options options;
   private AppWidgetManager appWidgetManager;
   private int[] allWidgetIds;
   public RemoteViews views;
   public Handler handler = new Handler();
   public PowerManager pm;
   private Context context;
   
   private Runnable checkSocket = new Runnable()
   {
      @Override
      public void run()
      {
         //Log.i("trace", "socket connected: " + socket.connected() + " - power status: " + pm.isScreenOn());
         if (!socket.connected() & isScreenOn())
         {
            socket.disconnect();
            socket.connect();
         }
         else if (socket.connected() & !isScreenOn())
         {
            socket.disconnect();
         }

         handler.removeCallbacks(this);
         handler.postDelayed(this, 130000);
      }
   };

   public boolean isScreenOn()
   {
      if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH)
      {
         return isScreenOnNew();  
      }
      else
      {
         return isScreenOnOld();
      }
   }

   @SuppressWarnings("deprecation")
   public boolean isScreenOnOld()
   {
      PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
      return pm.isScreenOn();
   }
   
   @TargetApi(Build.VERSION_CODES.KITKAT_WATCH) 
   public boolean isScreenOnNew()
   {
      DisplayManager dm = (DisplayManager) context.getSystemService(Context.DISPLAY_SERVICE);
      boolean screenOn = false;
      for (Display display : dm.getDisplays())
      {
         if (display.getState() != Display.STATE_OFF)
         {
            screenOn = true;
         }
      }
      return screenOn;      
   }
   
   private Runnable initSocket = new Runnable()
   {
      @Override
      public void run()
      {
         createSocket();
         socket.connect();
         handler.postDelayed(checkSocket, 130000);
      }
   };

   private void updateView(JSONObject obj, RemoteViews views) throws JSONException
   {
      if (obj.has("Timestamp"))
      {
         String Timestamp = obj.getString("Timestamp").substring(0, 5);
         views.setTextViewText(R.id.uhrzeit, String.valueOf(Timestamp));
      }
      if (obj.has("TempOut"))
      {
         String TempOut = obj.getString("TempOut");
         views.setTextViewText(R.id.temp, String.valueOf(TempOut));
      }

      if (obj.has("RelHumOut"))
      {
         String RelHumOut = obj.getString("RelHumOut");
         views.setTextViewText(R.id.humi, String.valueOf(RelHumOut) + "%");
      }

      if (obj.has("WindSpeed"))
      {
         String WindSpeed = obj.getString("WindSpeed");
         views.setTextViewText(R.id.wind, String.valueOf(WindSpeed) + " - ");
      }

      if (obj.has("WindGust"))
      {
         String WindGust = obj.getString("WindGust");
         views.setTextViewText(R.id.windgust, String.valueOf(WindGust));
      }

      if (obj.has("WindDir"))
      {
         String WindDir = obj.getString("WindDir");
         views.setTextViewText(R.id.winddir, String.valueOf(WindDir));
      }

      if (obj.has("RelPressure"))
      {
         String RelPressure = obj.getString("RelPressure");
         views.setTextViewText(R.id.press, String.valueOf(RelPressure) + " hPa");
      }

      if (obj.has("Sunriseset"))
      {
         String Sunriseset = obj.getString("Sunriseset");
         views.setTextViewText(R.id.stag, String.valueOf(Sunriseset));
      }
      
      int SonnenProzent = 0;
      if (obj.has("SonnenProzent"))
      {
         SonnenProzent = obj.getInt("SonnenProzent");
         views.setProgressBar(R.id.sonneprogress, 100, SonnenProzent, false);
         views.setTextViewText(R.id.sonneproz, getString(R.string.sonnelabel) + " " + String.valueOf(SonnenProzent) + "%");
      }
   }

   public void onStart(Intent intent, int startId)
   {
      //Log.i("trace", "onStart fired");
      pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
      //Log.i("string", "screen on: " + pm.isScreenOn());
      if (!isScreenOn()) { return; }
      appWidgetManager = AppWidgetManager.getInstance(getApplicationContext());

      ComponentName thisWidget = new ComponentName(getApplicationContext(), WetterstationWidgetProvider.class);
      context = getApplicationContext();
      
      allWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
      //allWidgetIds = intent.getIntArrayExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS);

      views = new RemoteViews(this.getApplicationContext().getPackageName(), R.layout.wetterstation_widget_layout);
      for (int widgetId : allWidgetIds)
      {
         Intent clickIntent = new Intent(this.getApplicationContext(), WetterstationWidgetProvider.class);

         clickIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
         clickIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, allWidgetIds);

         clickIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
         clickIntent.setComponent(new ComponentName("de.fehngarten.wetterstation",
         "de.fehngarten.wetterstation.WetterstationRhauderfehn"));
         clickIntent.addCategory("android.intent.category.LAUNCHER");
         PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0, clickIntent,
         PendingIntent.FLAG_UPDATE_CURRENT);

         views.setOnClickPendingIntent(R.id.layout, pendingIntent);

         // Tell the AppWidgetManager to perform an update on the current app
         // widget
         appWidgetManager.updateAppWidget(widgetId, views);
      }
      if (socket instanceof Socket)
      {
         handler.postDelayed(checkSocket, 100);
      }
      else
      {
         options = new IO.Options();
         options.reconnection = false;
         options.timeout = 5000;
         options.query = "client=Widget&platform=Android&version=" + android.os.Build.VERSION.RELEASE + "&model=" + android.os.Build.MODEL + "&appver=" + getString(R.string.appver);
         handler.postDelayed(initSocket, 1000);
      }
 
      handler.postDelayed(new Runnable()
      {
         @Override
         public void run()
         {
            socket.emit("sendActData");
         }
      }, 25000);
   }

   private void createSocket()
   {
      try
      {
         socket = IO.socket("https://socken.fehngarten.de", options);
      }
      catch (URISyntaxException e1)
      {
         // TODO Auto-generated catch block
         e1.printStackTrace();
      }

      socket.off("data");
      socket.on("data", new Emitter.Listener()
      {
         @Override
         public void call(Object... args)
         {
            //Log.i("data", args[0].toString());
            for (final int widgetId : allWidgetIds)
            {
               try
               {
                  updateView((JSONObject) args[0], views);
               }
               catch (JSONException e)
               {
                  // TODO Auto-generated catch block
                  e.printStackTrace();
               }
               appWidgetManager.updateAppWidget(widgetId, views);
            }
         }
      });

      socket.off(Socket.EVENT_CONNECT);
      socket.on(Socket.EVENT_CONNECT, new Emitter.Listener()
      {
         @Override
         public void call(Object... args)
         {
            socket.emit("sendActData");
         }

      });
   }

   @Override
   public IBinder onBind(Intent arg0)
   {
      return null;
   }
}
