import React, { useState } from 'react';
import { Droplets, Sprout, RefreshCw, AlertCircle } from 'lucide-react';
import { recommendFertilizer } from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

import { useTranslation } from 'react-i18next'; // Add import

const Fertilizer = () => {
    const { t } = useTranslation(); // Init hook
    const [formData, setFormData] = useState({
        crop: '',
        nitrogen: '',
        phosphorus: '',
        potassium: ''
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await recommendFertilizer(formData);
            setResult(response.data);

            // Speak summary
            const text = `The status is ${response.data.analysis.status}. Check the screen for detailed recommendations.`;
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);

        } catch (err) {
            setError("Failed to get advice. Make sure all fields are filled.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const crops = [
        "Rice", "Maize", "Chickpea", "Kidney Beans", "Pigeon Peas", "Moth Beans",
        "Mung Bean", "Black Gram", "Lentil", "Pomegranate", "Banana", "Mango",
        "Grapes", "Watermelon", "Muskmelon", "Apple", "Orange", "Papaya",
        "Coconut", "Cotton", "Jute", "Coffee"
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('fert_guide_title')}</h1>
                <p className="text-muted-foreground">{t('fert_desc')}</p>
            </div>

            <Card className="border-none">
                <CardHeader>
                    <CardTitle>{t('nutrient_calc')}</CardTitle>
                    <CardDescription>{t('nutrient_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>{t('select_crop')}</Label>
                            <select
                                name="crop"
                                value={formData.crop}
                                onChange={handleChange}
                                required
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Choose a crop...</option>
                                {crops.map(crop => (
                                    <option key={crop} value={crop.toLowerCase().replace(/\s+/g, '')}>{crop}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>{t('nitrogen')}</Label>
                                <Input type="number" name="nitrogen" placeholder="50" value={formData.nitrogen} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('phosphorus')}</Label>
                                <Input type="number" name="phosphorus" placeholder="50" value={formData.phosphorus} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('potassium')}</Label>
                                <Input type="number" name="potassium" placeholder="50" value={formData.potassium} onChange={handleChange} required />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Droplets className="mr-2 h-4 w-4" />}
                            {loading ? t('analyzing') : t('get_advice')}
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-6 flex items-center justify-center rounded-md bg-destructive/10 p-4 text-destructive font-medium">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-4 rounded-lg border bg-blue-50/50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <Sprout className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold uppercase text-blue-600">{t('status_assessment')}</h4>
                                    <p className="text-lg font-bold text-foreground">{result.analysis.status}</p>
                                </div>
                            </div>

                            <div className="rounded-lg border p-6 bg-muted/20">
                                <div
                                    className="prose prose-sm max-w-none text-foreground"
                                    dangerouslySetInnerHTML={{ __html: result.recommendation }}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Fertilizer;
