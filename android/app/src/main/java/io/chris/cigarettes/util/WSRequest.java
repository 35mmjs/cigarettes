package io.chris.cigarettes.util;

import android.util.Log;
import android.widget.Toast;

import org.ksoap2.SoapEnvelope;
import org.ksoap2.SoapFault;
import org.ksoap2.serialization.MarshalBase64;
import org.ksoap2.serialization.SoapObject;
import org.ksoap2.serialization.SoapSerializationEnvelope;
import org.ksoap2.transport.HttpTransportSE;
import org.xmlpull.v1.XmlPullParserException;

import java.io.IOException;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;


public class WSRequest {
    private final String WSDL_URI="http://paytest.zxhsd.com/services/Exchange?wsdl";
    private final String namespace="http://www.bookuu.com";
    private final String methodName="login";

    private String userid = "9999999999";
    private String password = "1516348211";
    private String type = "1";
    private String dh = "9999999999";

    private final String KHID="zhihuishucheng";
    private final String KeyID="355DBBC50859340E72B9C8E5AB2DBB74";
    public final static SimpleDateFormat dateFormater = new SimpleDateFormat("yyyyMM");

    String soapAction =namespace + methodName;
    protected SoapSerializationEnvelope envelope;
    protected HttpTransportSE transport;

    private static WSRequest instance;
    private HashMap<String,String> mParams;

    public WSRequest() {
        envelope = new SoapSerializationEnvelope(SoapEnvelope.VER11);
        envelope.dotNet = true;
        if(mParams == null) {
            mParams = new HashMap<>();
        }
        (new MarshalBase64()).register(envelope);
    }
    public static WSRequest getInstance() {
        if(instance == null) {
            instance = new WSRequest();
        }
        return instance;
    }

    public String Execute() {
        if(transport==null){
            transport=new HttpTransportSE(WSDL_URI);
        }
        SoapObject rpc = new SoapObject(namespace, methodName);

        try {
            rpc.addProperty("userid", userid);
            rpc.addProperty("password", password);
            rpc.addProperty("type", type);
            rpc.addProperty("dh", dh);

            envelope.setOutputSoapObject(rpc);
            transport.call(null, envelope);

            String l_result = envelope.getResponse().toString().trim();
            return l_result;
        } catch (Exception e) {
            return "{code:3,msg:'"+e.getMessage()+"'}";
        }
    }
    public static String getMD5(String str) throws Exception {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(str.getBytes());
            byte[] bytes = md.digest();
            StringBuffer sb = new StringBuffer();
            for (byte aByte : bytes) {
                String s = Integer.toHexString(0xff & aByte);
                if (s.length() == 1) {
                    sb.append("0" + s);
                } else {
                    sb.append(s);
                }
            }
            return sb.toString().toUpperCase();
        } catch (Exception e) {
            throw new Exception("MD5���ܳ��ִ���:" + e.getMessage());
        }
    }
}
