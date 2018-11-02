package io.chris.cigarettes;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import io.chris.cigarettes.services.LoginService;
import io.chris.cigarettes.services.BizService;
import io.chris.cigarettes.bridge.BizAPI;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(BizAPI.class);
    }});

//    LoginService.getInstance().doLogin();
//    BizService.getInstance().startPay();
  }
}
