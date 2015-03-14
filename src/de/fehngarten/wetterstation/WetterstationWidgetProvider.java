package de.fehngarten.wetterstation;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
//import android.util.Log;

public class WetterstationWidgetProvider extends AppWidgetProvider
{

   //private static final String LOG = "WetterstationWidgetProvider";

   public void onReceive(Context context, Intent intent)
   {
      //Log.i("trace", "onReiceive startet by " + intent.getAction());
      // super.onReceive(context, intent);
      // make sure the user has actually installed a widget
      // before starting the update service
      if (widgetsInstalledLength(context) != 0
      && (intent.getAction().equals(Intent.ACTION_USER_PRESENT) || intent.getAction().equals(
      "android.appwidget.action.APPWIDGET_UPDATE")))
      {
         intent = new Intent(context.getApplicationContext(), WetterstationWidgetService.class);
         //intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
         context.startService(intent);
      }
   }

   // convenience method to count the number of installed widgets
   private int widgetsInstalledLength(Context context)
   {
      ComponentName thisWidget = new ComponentName(context, WetterstationWidgetProvider.class);
      AppWidgetManager mgr = AppWidgetManager.getInstance(context);
      return mgr.getAppWidgetIds(thisWidget).length;
   }
}
