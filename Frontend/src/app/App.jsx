import {
    useContext,
    useState,
} from "react";

import {
    endDriverSession,
} from "../utils/storage";

import Header from "../components/layout/Header/Header";

import Sidebar from "../components/layout/Sidebar/Sidebar";

import useDriverData from "../hooks/useDriverData";

import DashboardPage from "../pages/DashboardPage";
import VitalsPage from "../pages/VitalsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import HistoryPage from "../pages/HistoryPage";
import SettingsPage from "../pages/SettingsPage";

import {
    ThemeContext,
} from "../app/providers";


function DashboardLayout({
    profile,
    setProfile,
}) {

    const { theme } =
        useContext(
            ThemeContext
        );


    /*
    |--------------------------------------------------------------------------
    | SINGLE LIVE DATA CONNECTION
    |--------------------------------------------------------------------------
    */

    const {
        data,
        loading,
        error,
        location,
        wsStatus,
    } = useDriverData();


    const [activeTab, setActiveTab] =
        useState("Dashboard");


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    function handleLogout() {

        endDriverSession();

        setProfile(null);

    }


    return (

        <div
            className="
                min-h-screen
                flex
                flex-col
                transition-colors
                duration-300
            "
            style={{
                backgroundColor:
                    theme.background,

                color:
                    theme.text,
            }}
        >

            <Header
                setActiveTab={
                    setActiveTab
                }
            />


            <div
                className="
                    flex
                    flex-1
                    min-h-0
                "
            >

                <Sidebar
                    profile={profile}
                    data={data}
                    activeTab={activeTab}
                    setActiveTab={
                        setActiveTab
                    }
                    onLogout={
                        handleLogout
                    }
                />


                <main
                    className="
                        flex-1
                        p-6
                        overflow-auto
                        transition-colors
                        duration-300
                    "
                    style={{
                        backgroundColor:
                            theme.background,

                        color:
                            theme.text,
                    }}
                >

                    {activeTab === "Dashboard" && (

                        <DashboardPage
                            profile={profile}
                            data={data}
                            loading={loading}
                            error={error}
                            location={location}
                            setActiveTab={
                                setActiveTab
                            }
                            wsStatus={
                                wsStatus
                            }
                        />

                    )}


                    {activeTab === "Vitals" && (

                        <VitalsPage
                            data={data}
                            loading={loading}
                            error={error}
                        />

                    )}


                    {activeTab === "Analytics" && (

                        <AnalyticsPage
                            data={data}
                            loading={loading}
                            error={error}
                        />

                    )}


                    {activeTab === "History" && (

                        <HistoryPage
                            profile={profile}
                            data={data}
                        />

                    )}


                    {activeTab === "Settings" && (

                        <SettingsPage
                            profile={profile}
                        />

                    )}

                </main>

            </div>

        </div>

    );

}


export default DashboardLayout;