package io.chris.cigarettes.bridge;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import io.chris.cigarettes.services.BizService;

@NativePlugin()
public class BizAPI extends Plugin {

  @PluginMethod()
  public void StartPay(PluginCall call) {
    String message = call.getString("message");

//    BizService.getInstance().startPay();
    call.success();
  }
}