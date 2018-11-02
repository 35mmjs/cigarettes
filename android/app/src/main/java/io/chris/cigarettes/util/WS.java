package io.chris.cigarettes.util;

import android.os.AsyncTask;

import org.ksoap2.serialization.SoapObject;
import org.ksoap2.serialization.SoapSerializationEnvelope;
import org.ksoap2.transport.HttpTransportSE;
import org.ksoap2.SoapFault;

import java.io.IOException;
import org.xmlpull.v1.XmlPullParserException;

public class WS extends AsyncTask<SoapObject, SoapObject, SoapObject> {
    private final String WSDL_URI="http://paytest.zxhsd.com/services/Exchange?wsdl";
    private final String namespace="http://www.bookuu.com";

    public SoapObject getRequest(String methodName) {
        return new SoapObject(namespace, methodName);
    }

    @Override
    protected SoapObject doInBackground(SoapObject[] request) {
        SoapSerializationEnvelope envelope = new SoapSerializationEnvelope(SoapSerializationEnvelope.VER11);
        envelope.implicitTypes = true;
        envelope.setOutputSoapObject(request[0]);
        envelope.dotNet = true;

        HttpTransportSE httpTransport = new HttpTransportSE(WSDL_URI);
        httpTransport.debug = true;

        try {
            httpTransport.call(null, envelope);
        } catch (IOException | XmlPullParserException e) {
            e.printStackTrace();
        }

        try {
            return (SoapObject) envelope.getResponse();
        } catch (SoapFault e) {
            e.printStackTrace();
        }

        return null;
    }
}
