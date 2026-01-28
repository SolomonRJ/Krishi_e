import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle, RefreshCw, X, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { predictDisease } from '../api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Disease = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('camera') === 'true' && cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    }, [searchParams]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (selectedFile) => {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setResult(null);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!file) return;

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
            className="space-y-6 pb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t('disease_detection')}</h1>
                <p className="text-muted-foreground text-lg">{t('disease_desc')}</p>
            </motion.div>

            {/* Main Action Area */}
            {!preview ? (
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 mt-8">
                    {/* Camera Option */}
                    <Card
                        className="group relative overflow-hidden border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-br from-white to-primary/5 active:scale-[0.98]"
                        onClick={() => cameraInputRef.current.click()}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                <Camera className="h-8 w-8" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-xl font-bold text-foreground">{t('take_photo')}</h3>
                                <p className="text-sm text-muted-foreground">{t('tap_to_open')}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upload Option */}
                    <Card
                        className="group relative overflow-hidden border-none shadow-soft hover:shadow-lg transition-all cursor-pointer bg-white active:scale-[0.98]"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <CardContent className="flex items-center p-6 space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                <Upload className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-foreground">Upload from Gallery</h3>
                                <p className="text-sm text-muted-foreground">Select an existing photo</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="hidden">
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={cameraInputRef}
                            onChange={handleFileChange}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative space-y-6"
                >
                    <div className="relative overflow-hidden rounded-3xl shadow-lg border-4 border-white">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full max-h-[500px] object-cover"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={reset}
                            className="absolute top-4 right-4 rounded-full shadow-lg"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {!result && (
                        <div className="flex justify-center pt-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full max-w-sm h-14 text-lg shadow-glow-green"
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> {t('analyzing')}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" /> {t('analyze_disease')}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100"
                    >
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Result Section */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-[32px] shadow-[0_-5px_30px_rgba(0,0,0,0.1)] p-6 pb-28 border-t border-gray-100 max-h-[85vh] overflow-y-auto"
                    >
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-primary/10 text-primary mb-2">
                                        {result.crop}
                                    </span>
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                        {result.disease}
                                    </h2>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-3xl font-black text-primary">
                                        {result.confidence}%
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium uppercase">Confidence</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                                    Diagnosis & Treatment
                                </h3>
                                <div className="prose prose-sm prose-green bg-gray-50 p-5 rounded-2xl text-gray-600 leading-relaxed">
                                    {result.recommendation.replace(/<br\/>/g, '\n')}
                                </div>
                            </div>

                            <Button onClick={reset} size="lg" variant="outline" className="w-full h-14 rounded-2xl border-2 text-lg font-bold">
                                {t('scan_another')}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Disease;
