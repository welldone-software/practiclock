package com.practiclock;

import com.facebook.react.ReactActivity;
import com.zmxv.RNSound.RNSoundPackage; 

public class MainActivity extends ReactActivity {

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNSoundPackage()
        );
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "practiclock";
    }
}
