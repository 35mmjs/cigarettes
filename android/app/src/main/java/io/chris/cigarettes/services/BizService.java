package io.chris.cigarettes.services;

import android.os.AsyncTask;

import org.json.JSONObject;
import org.ksoap2.serialization.SoapObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ExecutionException;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

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

    public JsonObject startPay() {
        JsonObject parValue = new JsonObject();
        parValue.addProperty("paytype", "MICROPAY");
        parValue.addProperty("trade_type", "NATIVE");
        parValue.addProperty("khbh", khbh);
        parValue.addProperty("storeid", "01"); // ??
        parValue.addProperty("total_amount", "0.01"); // 待传入
        parValue.addProperty("subject", "烟草");
        parValue.addProperty("body", "烟草交易");
        parValue.addProperty("product_id", "3456789");

        JsonArray productDetails = new JsonArray();
        parValue.add("goods_detail", productDetails);

        parValue.addProperty("spbill_create_ip", "192.168.1.100");
        parValue.addProperty("w_khbh_id", "P201710161556387");
        parValue.addProperty("operator_id", "001");
        parValue.addProperty("terminal_id", "001");
        parValue.addProperty("xslx", "LS");

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

        JsonObject payResult = new JsonObject();
        try {
            SoapObject res = (SoapObject) task.get();
            String stringValue = res.getProperty("stringValue").toString();
            Integer errorCode = (Integer) res.getProperty("errorCode");

            if (errorCode > 0) {
                payResult.addProperty("success", false);
                payResult.addProperty("errorMessage", stringValue);
            } else {
                payResult.addProperty("success", true);
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            payResult.addProperty("success", false);
            payResult.addProperty("errorMessage", e.getMessage());
        }

        return payResult;
    }
}
