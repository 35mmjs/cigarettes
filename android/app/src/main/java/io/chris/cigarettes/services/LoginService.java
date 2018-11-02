package io.chris.cigarettes.services;

import android.os.AsyncTask;

import org.ksoap2.serialization.SoapObject;

import java.util.concurrent.ExecutionException;

import io.chris.cigarettes.util.WS;

public class LoginService {
    private String userid = "PEIXUN_JH";
    private String password = "1";
    private String type = "1";
    private String dh = "9999999999";
    private String methodName = "login";
    private String sessionId = null;
    private static LoginService instance;

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public static LoginService getInstance() {
        if(instance == null) {
            instance = new LoginService();
        }
        return instance;
    }

    public boolean doLogin() {
        WS ws = new WS();
        SoapObject soapObject = ws.getRequest(methodName);
        soapObject.addProperty("userid", userid);
        soapObject.addProperty("password", password);
        soapObject.addProperty("type", type);
        soapObject.addProperty("dh", dh);

        AsyncTask result = ws.execute(soapObject);
        try {
            SoapObject res = (SoapObject) result.get();
            String sessionId = res.getProperty("stringValue").toString();
            Integer errorCode = (Integer) res.getProperty("errorCode");

            if (errorCode > 0) {
                this.setSessionId(null);
            } else {
                this.setSessionId(sessionId);
            }
            return true;
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        return false;
    }
}
