import React, { useState, useRef, useEffect } from 'react';
import { Camera, AlertCircle, CheckCircle, RefreshCw, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { predictDisease } from '../api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

import { useTranslation } from 'react-i18next'; // Add import

const Disease = () => {
    const { t } = useTranslation(); // Init hook
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('camera') === 'true' && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [searchParams]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError(t("Please select an image first.")); // You might want to add this key or keep as fallback
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await predictDisease(formData);
            setResult(response.data);

            // Speak result
            const textVals = `I found ${response.data.disease} on the ${response.data.crop}. Confidence is ${response.data.confidence} percent.`;
            const utterance = new SpeechSynthesisUtterance(textVals);
            window.speechSynthesis.speak(utterance);

        } catch (err) {
            setError(err.response?.data?.detail || "Error predicting disease. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('disease_detection')}</h1>
                <p className="text-muted-foreground">{t('disease_desc')}</p>
            </div>

            <Card className="min-h-[60vh] flex flex-col justify-center text-center glass-card border-none">
                <CardContent className="pt-6">
                    {!preview ? (
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-primary/20 p-10 hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Camera className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-foreground">{t('take_photo')}</h3>
                                <p className="text-sm text-muted-foreground">{t('tap_to_open')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-lg mb-6 border border-border">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full max-h-[400px] object-cover"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={reset}
                                className="absolute top-2 right-2 rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <input
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                    />

                    {file && !result && (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full mt-6"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> {t('analyzing')}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" /> {t('analyze_disease')}
                                </>
                            )}
                        </Button>
                    )}

                    {error && (
                        <div className="mt-6 flex items-center justify-center rounded-md bg-destructive/10 p-4 text-destructive">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="mt-8 text-left space-y-6">
                            <div className="rounded-lg border bg-green-50/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
                                        {result.crop}
                                    </span>
                                    <span className="text-sm font-bold text-green-600">
                                        {result.confidence}% Match
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold mb-4 leading-tight text-foreground">{result.disease}</h2>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Treatment / Info</h4>
                                    <p className="text-base leading-relaxed whitespace-pre-line text-foreground/90">
                                        {result.recommendation.replace(/<br\/>/g, '\n')}
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={reset}
                                className="w-full"
                            >
                                {t('scan_another')}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Disease;
