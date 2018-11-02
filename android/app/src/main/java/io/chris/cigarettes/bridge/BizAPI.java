package io.chris.cigarettes.bridge;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.JSObject;

import io.chris.cigarettes.services.BizService;

@NativePlugin()
public class BizAPI extends Plugin {

  @PluginMethod()
  public void StartPay(PluginCall call) {
      JSObject payRequest = call.getData();
      call.success(BizService.getInstance().startPay(payRequest));
  }
}