import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, Sprout, Droplets, Sun, CloudRain, ArrowRight, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { fetchMandiPrices } from '../api/mandi';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [greeting, setGreeting] = useState('');
    const [marketData, setMarketData] = useState([]);
    const [loadingMarket, setLoadingMarket] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('good_morning');
        else if (hour < 18) setGreeting('good_afternoon');
        else setGreeting('good_evening');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }

        loadMarketData();
    }, []);

    const loadMarketData = async () => {
        try {
            setLoadingMarket(true);
            const data = await fetchMandiPrices({ State: "Tamil Nadu" }, 5, 0);
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
            color: "text-rose-500",
            bg: "bg-rose-50 dark:bg-rose-950/20"
        },
        {
            title: t('recommend_crop'),
            description: t('recommend_crop_desc'),
            icon: Sprout,
            path: "/crop",
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-950/20"
        },
        {
            title: t('fertilizer_guide'),
            description: t('fertilizer_guide_desc'),
            icon: Droplets,
            path: "/fertilizer",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-950/20"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="space-y-8 pb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        {t(greeting)}, <span className="text-primary block text-4xl mt-1">Farmer</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">{t('daily_overview')}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm">
                    <span className="font-bold text-lg text-primary">FA</span>
                </div>
            </motion.div>

            {/* Weather Widget */}
            <motion.div variants={itemVariants}>
                <Card className="border-none shadow-glow-green overflow-hidden relative bg-gradient-to-br from-primary to-emerald-700 text-white">
                    <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-primary-foreground/80 font-medium mb-1">Current Weather</p>
                                <div className="text-5xl font-bold tracking-tighter">
                                    {weather ? `${Math.round(weather.temperature_2m)}°` : '--°'}
                                </div>
                                <div className="flex items-center mt-2 text-primary-foreground/90 font-medium">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {t('sunny_clear')}
                                </div>
                            </div>
                            <Sun className="h-16 w-16 text-yellow-300 animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">{t('services')}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            onClick={() => navigate(feature.path)}
                            className="border-none shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.99] group"
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-foreground">{feature.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{feature.description}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>

            {/* Market Updates */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">{t('market_trends')}</h3>
                    <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
                </div>
                <Card className="border-none shadow-soft">
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {loadingMarket ? (
                                <div className="p-8 text-center text-muted-foreground animate-pulse">Loading market rates...</div>
                            ) : marketData.length > 0 ? (
                                marketData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xs uppercase border border-orange-100">
                                                {item.Commodity.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{item.Commodity}</p>
                                                <p className="text-xs font-medium text-muted-foreground">{item.Market}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-primary">₹{item.Modal_Price}</p>
                                            <p className="text-xs text-muted-foreground font-medium">{item.Variety}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">No market data available</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default Home;
