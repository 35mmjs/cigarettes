package io.chris.cigarettes.services;

import android.os.AsyncTask;

import org.ksoap2.serialization.SoapObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.security.MessageDigest;
//import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
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
    public static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMM");

    public static BizService getInstance() {
        if(instance == null) {
            instance = new BizService();
        }
        return instance;
    }

    public JSObject startPay(JSObject payRequest) {
        payRequest.put("paytype", "MICROPAY");
        payRequest.put("trade_type", "NATIVE");
        payRequest.put("khbh", khbh);
        payRequest.put("storeid", "01"); // ??
        payRequest.put("subject", "烟草");
        payRequest.put("body", "烟草交易");
        payRequest.put("spbill_create_ip", "192.168.1.100");
        payRequest.put("w_khbh_id", "P" + new Timestamp(new Date().getTime()).getTime()); // 商户订单号
        payRequest.put("operator_id", "001");
        payRequest.put("terminal_id", "001");
        payRequest.put("xslx", "LS");

        /*
        // Test Data
        payRequest.put("paytype", "MICROPAY");
        payRequest.put("trade_type", "NATIVE");
        payRequest.put("khbh", "9999999999"); // 9999999999
        payRequest.put("storeid", "01");
        payRequest.put("total_amount", "0.01");
        payRequest.put("subject", "图书");
        payRequest.put("body", "图书交易");
        payRequest.put("product_id", "商品ID");
        payRequest.put("spbill_create_ip", "192.168.1.100");
        payRequest.put("w_khbh_id", "P201710161556387");
        payRequest.put("operator_id", "001");
        payRequest.put("terminal_id", "001");
        payRequest.put("xslx", "LS");

        JSArray goods = new JSArray();
        JSObject g1 = new JSObject();
        g1.put("goods_id", "730504654124642");
        g1.put("goods_name", "一年级小学生作文起跑线作文初学入门");
        g1.put("price", "12");
        g1.put("quantity", "1");
        g1.put("sale_price", "12");
        g1.put("discountable_type", "0");
        g1.put("isbn", "730504654124642");
        g1.put("tm", "730504654124642");
        goods.put(g1);
        payRequest.put("goods_detail", goods);
        */

        String parValueString = null;
        try {
            parValueString = URLEncoder.encode(payRequest.toString(), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        WS ws = new WS();
        SoapObject soapObject = ws.getRequest(methodName);
        soapObject.addProperty("sessionId", LoginService.getInstance().getSessionId());
        soapObject.addProperty("svr_type", "WAPPC1");
        soapObject.addProperty("par_value", parValueString);

        String md5Str = parValueString + khbh + user_pass + dateFormat.format(new Date()) + unit_pass;

        /*
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        byte[] hashInBytes = md.digest(md5Str.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte aByte : hashInBytes) {
            String s = Integer.toHexString(0xff & aByte);
            if (s.length() == 1) {
                sb.append("0" + s);
            } else {
                sb.append(s);
            }
        }
        soapObject.addProperty("md5_value", sb.toString().toUpperCase());
        */

        soapObject.addProperty("md5_value", MD5.encrypt(md5Str).toUpperCase());
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

    public void queryPayResult() {
        JSObject query = new JSObject();
    }
}
