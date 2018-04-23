package com.etoll;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.surialabs.rn.geofencing.GeoFencingPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import org.reactnative.camera.RNCameraPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new RNBackgroundFetchPackage(),
            new MainReactPackage(),
            new RealmReactPackage(),
            new ReactNativePushNotificationPackage(),
            new GeoFencingPackage(),
            new BackgroundTaskPackage(),
            new LottiePackage(),
            new RNCameraPackage(),
            new ReactNativeConfigPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    BackgroundTaskPackage.useContext(this);
  }
}
