package io.chris.cigarettes.bridge;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.JSObject;

import io.chris.cigarettes.services.BizService;
import io.chris.cigarettes.services.LoginService;

@NativePlugin()
public class BizAPI extends Plugin {

  @PluginMethod()
  public void StartPay(PluginCall call) {
      JSObject payRequest = call.getData();
      if (!LoginService.getInstance().doLogin()) {
          JSObject res = new JSObject();
          res.put("success", false);
          res.put("errorMessage", "登录失败!");
          call.success(res);
      } else {
          call.success(BizService.getInstance().startPay(payRequest));
      }
  }

  @PluginMethod()
  public void QueryPayResult(PluginCall call) {
      JSObject queryObject = call.getData();
      JSObject res = BizService.getInstance().queryPayResult(queryObject);
      call.success(res);
  }

  @PluginMethod()
  public void Print(PluginCall call) {
      JSObject printData = call.getData();
      JSObject res = BizService.getInstance().print(printData);
      call.success(res);
  }
}