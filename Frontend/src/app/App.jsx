import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import DriverSetupPage from "../pages/DriverSetupPage";

import {
    getDriverProfile,
    isDriverLoggedIn,
} from "../utils/storage";


function App() {

    /*
    |--------------------------------------------------------------------------
    | DRIVER SESSION
    |--------------------------------------------------------------------------
    |
    | App.jsx controls which part of the application is displayed:
    |
    |   Active driver session
    |       -> Dashboard
    |
    |   No active driver session
    |       -> Driver Registration
    |
    */


    const [profile, setProfile] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | INITIAL SESSION CHECK
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const savedProfile = getDriverProfile();

        const sessionActive =
            isDriverLoggedIn();


        /*
         * Display the dashboard only when:
         *
         * 1. A driver profile exists
         * 2. A driver session is active
         */

        if (
            savedProfile &&
            sessionActive
        ) {

            setProfile(savedProfile);

        } else {

            setProfile(null);

        }

    }, []);


    /*
    |--------------------------------------------------------------------------
    | DRIVER REGISTRATION / LOGIN
    |--------------------------------------------------------------------------
    */

    function handleLogin(driverProfile) {

        /*
         * DriverSetupPage already:
         *
         * 1. Saves the driver profile
         * 2. Starts the driver session
         *
         * We only update React state here.
         */

        setProfile(driverProfile);

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    if (!profile) {

        return (
            <DriverSetupPage
                onLogin={handleLogin}
            />
        );

    }


    return (
        <DashboardLayout
            profile={profile}
            setProfile={setProfile}
        />
    );

}


export default App;