import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, Sprout, Droplets, Sun, CloudRain, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

import { fetchMandiPrices } from '../api/mandi';

import { useTranslation } from 'react-i18next'; // Add import

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(); // Init hook
    const [weather, setWeather] = useState(null);
    const [greeting, setGreeting] = useState('');
    const [marketData, setMarketData] = useState([]);
    const [loadingMarket, setLoadingMarket] = useState(true);

    const getTodayDate = () => {
        const d = new Date();
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('good_morning');
        else if (hour < 18) setGreeting('good_afternoon');
        else setGreeting('good_evening');

        const storedLocation = localStorage.getItem('userLocation');
        if (storedLocation) {
            const { latitude, longitude } = JSON.parse(storedLocation);
            fetchWeather(latitude, longitude);
        }

        loadMarketData();
    }, []);

    const loadMarketData = async () => {
        try {
            setLoadingMarket(true);

            const filters = {
                // Arrival_Date: getTodayDate(),
                State: "Tamil Nadu" // optional but improves reliability
            };

            const data = await fetchMandiPrices(filters, 5, 0);

            if (data?.records?.length > 0) {
                setMarketData(data.records);
            } else {
                setMarketData([]);
            }
        } catch (error) {
            console.error("Failed to load market data", error);
        } finally {
            setLoadingMarket(false);
        }
    };

    const fetchWeather = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&timezone=auto`
            );
            setWeather(response.data.current);
        } catch (err) {
            console.error("Error fetching weather:", err);
        }
    };

    const features = [
        {
            title: t('detect_disease'),
            description: t('detect_disease_desc'),
            icon: ScanLine,
            path: "/disease",
        },
        {
            title: t('recommend_crop'),
            description: t('recommend_crop_desc'),
            icon: Sprout,
            path: "/crop",
        },
        {
            title: t('fertilizer_guide'),
            description: t('fertilizer_guide_desc'),
            icon: Droplets,
            path: "/fertilizer",
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {t(greeting)}, <span className="text-primary">Farmer</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">{t('daily_overview')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="font-bold text-sm text-primary">FA</span>
                </div>
            </div>

            {/* Weather Widget - Minimal Card */}
            <Card className="glass-card hover:shadow-2xl transition-all duration-300 border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">Current Weather</CardTitle>
                    <Sun className="h-5 w-5 text-custom-yellow animate-pulse" /> {/* Assuming custom-yellow or generic yellow class needed, using text-yellow-500 for safety if not defined */}
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        {weather ? `${Math.round(weather.temperature_2m)}°C` : '--°C'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {weather ? t('sunny_clear') : t('weather_loading')}
                    </p>
                </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">{t('services')}</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            onClick={() => navigate(feature.path)}
                            className="glass-card cursor-pointer hover:bg-white/90 dark:hover:bg-black/40 transition-all duration-300 border-l-4 border-l-primary group"
                        >
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                                <feature.icon className="h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Market Updates - Table/List Style */}
            <div>
                <h3 className="text-lg font-semibold mb-4">{t('market_trends')}</h3>
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {loadingMarket ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">{t('market_loading')}</div>
                            ) : marketData.length > 0 ? (
                                marketData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-medium">{item.Commodity}</p>
                                            <p className="text-xs text-muted-foreground">{item.Market}, {item.State}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">₹{item.Modal_Price}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.Variety}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-muted-foreground">{t('no_market_data')}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Home;
