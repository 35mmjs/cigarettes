package io.chris.cigarettes.services;

import android.os.AsyncTask;

import org.ksoap2.serialization.SoapObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ExecutionException;

import com.getcapacitor.JSObject;
import com.getcapacitor.JSArray;

import io.chris.cigarettes.util.WS;
import io.chris.cigarettes.util.MD5;

public class BizService {
    private String methodName = "service";
    private String dh = "9999999999";
    private String khbh = "9999999999";
    private String user_pass = "1516348211";
    private String unit_pass = "2515D842E14054425A7122403F196ACB";
    private static BizService instance;
    public final static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMM");

    public static BizService getInstance() {
        if(instance == null) {
            instance = new BizService();
        }
        return instance;
    }

    public JSObject startPay(JSObject payRequest) {
        JSObject parValue = new JSObject();
        parValue.put("paytype", "MICROPAY");
        parValue.put("trade_type", "NATIVE");
        parValue.put("khbh", khbh);
        parValue.put("storeid", "01"); // ??
        parValue.put("total_amount", "0.01"); // 待传入
        parValue.put("subject", "烟草");
        parValue.put("body", "烟草交易");
        parValue.put("product_id", "3456789");

        JSArray productDetails = new JSArray();
        parValue.put("goods_detail", productDetails);

        parValue.put("spbill_create_ip", "192.168.1.100");
        parValue.put("w_khbh_id", "P201710161556387");
        parValue.put("operator_id", "001");
        parValue.put("terminal_id", "001");
        parValue.put("xslx", "LS");

        String parValueString = null;
        try {
            parValueString = URLEncoder.encode(parValue.toString(), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        WS ws = new WS();
        SoapObject soapObject = ws.getRequest(methodName);
        soapObject.addProperty("sessionId", LoginService.getInstance().getSessionId());
        soapObject.addProperty("svr_type", "WAPPC1");
        soapObject.addProperty("par_value", parValueString);

        String md5Str = parValueString + khbh + user_pass + dateFormat.format(new Date()) + unit_pass;
        soapObject.addProperty("md5", MD5.encrypt(md5Str).toUpperCase());
        AsyncTask task = ws.execute(soapObject);

        JSObject payResult = new JSObject();
        try {
            SoapObject res = (SoapObject) task.get();
            String stringValue = res.getProperty("stringValue").toString();
            Integer errorCode = (Integer) res.getProperty("errorCode");

            if (errorCode > 0) {
                payResult.put("success", false);
                payResult.put("errorMessage", stringValue);
            } else {
                payResult.put("success", true);
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            payResult.put("success", false);
            payResult.put("errorMessage", e.getMessage());
        }

        return payResult;
    }
}
