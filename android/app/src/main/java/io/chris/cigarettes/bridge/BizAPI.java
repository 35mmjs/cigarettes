package io.chris.cigarettes.bridge;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.gson.JsonObject;
import com.getcapacitor.JSObject;

import org.json.JSONException;
import org.json.JSONObject;

import io.chris.cigarettes.services.BizService;

@NativePlugin()
public class BizAPI extends Plugin {

  @PluginMethod()
  public void StartPay(PluginCall call) {
    String message = call.getString("message");
    JsonObject payResult = BizService.getInstance().startPay();

    try {
      call.success(new JSObject(payResult.toString()));
    } catch (JSONException e) {
      call.error("Parse Pay Result Error");
    }
  }
}