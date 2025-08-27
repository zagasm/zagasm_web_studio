import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiCalendar, FiImage, FiChevronRight, FiUsers, FiUser, FiChevronLeft, FiUploadCloud, FiEdit2, FiTrash2, FiPlus, FiX, FiClock, FiGlobe, FiDollarSign, FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import './eventFormStyling.css';
import { CheckCircle } from "lucide-react";
import { useAuth } from '../../../auth/AuthContext';
import axios from "axios";

import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { Link } from 'react-router-dom';

countries.registerLocale(enLocale);

const countryList = Object.entries(countries.getNames('en', { select: 'official' })).map(
    ([code, name]) => ({ name, code })
);

// Primary color constant
const PRIMARY_COLOR = 'rgba(143, 7, 231, 1)';
const PRIMARY_COLOR_LIGHT = 'rgba(143, 7, 231, 0.1)';



// Currency data with flags (simplified)
const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'NG', symbol: '#', name: 'Nigria naira' },
    // Add more currencies as needed
];

// Genre options
const genres = [
    'Music & Entertainment',
    'Performance & Arts',
    'Education / Training',
    'Faith & Spirituality',
    'Wellness & Lifestyle',
    'Business & Networking',
    'Cultural & Social'
];

// Streaming options
const streamingOptions = [
    'in_app',
    'rtmp',
    'zoom'
];

// Visibility options
const visibilityOptions = [
    { value: 'public', label: 'Public', icon: <FiEye /> },
    { value: 'private', label: 'Private', icon: <FiLock /> },
    { value: 'unlisted', label: 'Unlisted', icon: <FiEyeOff /> }
];

// Schema validation for each step
const eventInfoSchema = z.object({
    title: z.string().min(10, 'Event title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    location: z.string().min(1, 'Please select a location'),
    organizer: z.string().min(3, 'Organizer name must be at least 3 characters'),
    genre: z.string().min(1, 'Please select a genre'),
    date: z.string().refine(val => new Date(val) > new Date(), {
        message: 'Event date must be in the future'
    }),
    time: z.string().min(1, 'Please select a time'),
});

const mediaSchema = z.object({
    eventImage: z.instanceof(File, { message: 'Event image is required' })
        .refine(file => file.size <= 2 * 1024 * 1024, {
            message: 'Image must be less than 2MB'
        }),
    performers: z.array(z.object({
        name: z.string().min(2, 'Performer name must be at least 2 characters'),
        image: z.instanceof(File, { message: 'Performer image is required' })
            .refine(file => file.size <= 2 * 1024 * 1024, {
                message: 'Image must be less than 2MB'
            }),
    })).min(1, 'At least one performer is required')
});

const ticketingSchema = z.object({
    price: z.number().min(0),
    maxTickets: z.enum(['limited', 'unlimited']),
    ticketLimit: z.number().min(1).optional(),
    currency: z.string().min(1, 'Please select a currency')
}).refine(data => data.maxTickets !== 'limited' || data.ticketLimit, {
    message: "Ticket limit is required when tickets are limited",
    path: ["ticketLimit"]
});
const streamingSchema = z.object({
    streamingOption: z.string().min(1, 'Please select a streaming option'),
    enableReplay: z.boolean(),
    streamingDuration: z.string().optional()
});

const accessSchema = z.object({
    visibility: z.string().min(1, 'Please select visibility'),
    matureContent: z.boolean()
});

const EventCreationWizard = ({ setSelectedEvent, eventType }) => {
    const [currentEventType, SetcurrentEventType] = useState(eventType);
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [timezone, setTimezone] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [eventImage, setEventImage] = useState(null);
    const [performers, setPerformers] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState({
        eventInfo: {},
        media: {},
        ticketing: {},
        streaming: {},
        access: {}
    });

    // Refs for file inputs
    const eventImageInputRef = useRef(null);
    const performerImageInputRefs = useRef({});

    // Set user's timezone on component mount
    useEffect(() => {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    // Handle file drop
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*') && file.size <= 2 * 1024 * 1024) {
            setEventImage(file);
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*') && file.size <= 2 * 1024 * 1024) {
            setEventImage(file);
        }
    };

    // Add new performer
    const addPerformer = () => {
        const newPerformer = { name: '', image: null, id: Date.now() };
        setPerformers([...performers, newPerformer]);
        // Focus on the new performer's name input
        setTimeout(() => {
            const input = document.getElementById(`performer-name-${newPerformer.id}`);
            if (input) input.focus();
        }, 100);
    };

    // Update performer name
    const updatePerformerName = (id, name) => {
        setPerformers(performers.map(p =>
            p.id === id ? { ...p, name } : p
        ));
    };


    // Handle performer image click
    const handlePerformerImageClick = (id) => {
        const inputId = `performer-image-${id}`;
        if (!performerImageInputRefs.current[inputId]) {
            performerImageInputRefs.current[inputId] = document.createElement('input');
            performerImageInputRefs.current[inputId].type = 'file';
            performerImageInputRefs.current[inputId].accept = 'image/*';
            performerImageInputRefs.current[inputId].style.display = 'none';
            performerImageInputRefs.current[inputId].onchange = (e) => {
                const file = e.target.files[0];
                if (file && file.type.match('image.*') && file.size <= 5 * 1024 * 1024) {
                    setPerformers(performers.map(p => p.id === id ? { ...p, image: file } : p));
                }
            };
            document.body.appendChild(performerImageInputRefs.current[inputId]);
        }
        performerImageInputRefs.current[inputId].click();
    };

    // Remove performer
    const removePerformer = (id) => {
        setPerformers(performers.filter(p => p.id !== id));
    };

    // Handle form submission
    const handleSubmit = (data) => {
        console.log('Event created:', data);
        setShowSuccessModal(true);
    };

    // Move to next step
    const nextStep = (stepData) => {
        // Save data for current step
        setFormData(prev => ({
            ...prev,
            [`step${currentStep}`]: stepData
        }));

        // Mark current step as completed
        setCompletedSteps(prev =>
            prev.includes(currentStep) ? prev : [...prev, currentStep]
        );

        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        } else {
            // On final step, submit all data
            const allData = {
                ...formData.step1,
                ...formData.step2,
                ...formData.step3,
                ...formData.step4,
                ...formData.step5,
                ...stepData
            };
            handleSubmit(allData);
        }
    };

    // Move to previous step
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    // Format currency input
    const formatCurrency = (value) => {
        if (!value) return '';
        return parseFloat(value).toFixed(2);
    };
    // Step 1: Event Information
    const EventInformationStep = () => {
        const { register, handleSubmit, formState: { errors } } = useForm({
            resolver: zodResolver(eventInfoSchema),
            defaultValues: formData.step1 || {}
        });
        const { user,token } = useAuth();
        const fullname = user.lastName;
        return (
            <div className="container p-2">
                <h6 className="text-2xl font-bol mb-6">Basic event details</h6>

                <div className="mt-4">
                    <div className="form-group">
                        <label>Event Title</label>
                        <input
                            type="text"
                            {...register('title')}
                            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                            placeholder="Enter event title"
                        />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                    </div>



                    <div className="form-group md:col-span-2">
                        <label>Description*</label>
                        <textarea
                            {...register('description')}
                            className={`form-input ${errors.description ? 'border-red-500' : ''}`}
                            rows={4}
                            placeholder="Describe your event in detail"
                        />
                        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Location*</label>
                        <select {...register('location')} className="form-input">
                            <option value="">Select Country</option>
                            {countryList.map((country) => (
                                <option key={country.code} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>

                        {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
                    </div>
                    <div className="form-group">
                        <label>Organizer's Name*</label>
                        { }
                        <input
                            type="text"
                            {...register('organizer')}
                            className={`form-input ${errors.organizer ? 'border-red-500' : ''}`}
                            placeholder="Enter organizer name" value={fullname}
                            readOnly
                        />
                        {errors.organizer && <span className="text-red-500 text-sm">{errors.organizer.message}</span>}
                    </div>
                    <div className="form-group">
                        <label>Genre*</label>
                        <select
                            {...register('genre')}
                            className={`form-input ${errors.genre ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select Genre</option>
                            {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                        {errors.genre && <span className="text-red-500 text-sm">{errors.genre.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Event Date*</label>
                        <div className="relative">
                            <input
                                type="date"
                                {...register('date')}
                                min={new Date().toISOString().split('T')[0]}
                                className={`form-input pr-10 ${errors.date ? 'border-red-500' : ''}`}
                            />
                            {/* <FiCalendar className="absolute right-3 top-3 text-gray-400" /> */}
                        </div>
                        {errors.date && <span className="text-red-500 text-sm">{errors.date.message}</span>}
                    </div>

                    <div className="row">
                        <div className="form-group col">
                            <label>Event Time*</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    {...register('time')}
                                    className={`form-input pr-10 ${errors.time ? 'border-red-500' : ''}`}
                                />
                                {/* <FiClock className="absolute right-3 top-3 text-gray-400" /> */}
                            </div>
                            {errors.time && <span className="text-red-500 text-sm">{errors.time.message}</span>}
                        </div>

                        <div className="form-group col">
                            <label>Timezone</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={timezone}
                                    readOnly
                                    className="form-input bg-gray-100 pr-10"
                                />
                                {/* <FiGlobe className="absolute right-3 top-3 text-gray-400" /> */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 w-100 flex justify-content-end">
                    <button
                        type="button"
                        onClick={handleSubmit(nextStep)}
                        className="btn btn-sm  btn-purple text-light px-3 px-sm-4 py-2"
                        style={{ borderRadius: '20px', backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                    >
                        <span className=" d-sm-inline">Next</span>
                        {/* <FiChevronRight className="ms-0 ms-sm-2" /> */}
                    </button>
                </div>


            </div>
        );
    };
    // Step 2: Media Upload
    const MediaUploadStep = () => {
        const { register, handleSubmit, formState: { errors }, setValue } = useForm({
            resolver: zodResolver(mediaSchema)
        });

        useEffect(() => {
            setValue('performers', performers);
            if (eventImage) {
                setValue('eventImage', eventImage);
            }
        }, [performers, eventImage, setValue]);

        return (
            <div className="container p-2">
                <h2 className="h5 mb-4 ">Event Media</h2>

                {/* Poster Upload Section */}
                <div className="mb-5">
                    <span className="form-labe">Poster upload* (Max 5MB)</span>
                    <div
                        className={`border-dashed-upload ${isDragging ? 'active-drag' : ''} ${errors.eventImage ? 'border-danger' : ''}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => eventImageInputRef.current.click()}
                    >
                        {eventImage ? (
                            <div className="position-relative">
                                <img
                                    src={URL.createObjectURL(eventImage)}
                                    alt="Event preview"
                                    className="img-fluid rounded mx-auto d-block hover-grow"
                                    style={{ maxHeight: '200px', borderRadius: '18px' }}
                                />
                                <button
                                    type="button"
                                    className="position-absolute top-0 end-0 bg-none border-0 rounded-circle  shadow-sm hover-scale"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEventImage(null);
                                    }}
                                >
                                    <FiX className="text-danger" />
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center justify-content-center py-4">
                                <FiUploadCloud className="fs-4 mb-3 " />

                                <p className="text-purple mb-1">Drag & drop your image here</p>
                                <p className="text-muted small">or click to browse</p>
                                <p className="text-muted small mt-2">JPG or PNG (Max 5MB)</p>
                                <FiPlus className="fs-1 mb-3  text-light" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }} />
                            </div>
                        )}
                        <input
                            ref={eventImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="d-none"

                        />
                    </div>
                    {errors.eventImage && <div className="text-danger small mt-2">{errors.eventImage.message}</div>}
                </div>
                <span className=" form-span fw-bol">Performer's / Speaker's Name*</span>
                {/* Performers Section */}
                <div className="mb-4">


                    {performers.length === 0 && (
                        <div className="text-center py-4 border-dashed-placeholder rounded">
                            <FiUsers className="fs-4 text-purple mb-2" />
                            <p className="text-muted mb-0">No performers added yet</p>
                        </div>
                    )}

                    <div className="row g-3">
                        {performers.map((performer) => {
                            const [localName, setLocalName] = useState(performer.name);
                            return (
                                <div key={performer.id} className="card col-12 col-sm-6 col-md-4">
                                    <div className="border-0 rounded p-3 position-relative hover-card">
                                        {/* Input at the top */}
                                        <div className="mb-3">
                                            <input
                                                id={`performer-name-${performer.id}`}
                                                type="text"
                                                value={localName}
                                                onChange={(e) => setLocalName(e.target.value)}
                                                onBlur={() => updatePerformerName(performer.id, localName)}
                                                placeholder="Performer name"
                                                style={{ borderRadius: '10px', }}
                                                className="form-control  px-1 py-1 bg-transparent w-100"
                                            />
                                        </div>

                                        {/* Image and delete button at bottom */}
                                        <div className="d-flex justify-content-between align-items-end border p-2 rounded">
                                            {/* Image section at bottom left */}
                                            <div
                                                className="rounded-circle bg-light-purple d-flex align-items-center justify-content-center overflow-hidden cursor-pointer hover-scale"
                                                style={{
                                                    width: '74px',
                                                    height: '74px',
                                                    border: '2px dashed rgba(244, 230, 253, 1)'
                                                }}
                                                onClick={() => handlePerformerImageClick(performer.id)}
                                            >
                                                {performer.image ? (
                                                    <img
                                                        src={URL.createObjectURL(performer.image)}
                                                        alt="Performer"
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                ) : (
                                                    <FiPlus className="text-purple fs-5" />
                                                )}
                                            </div>

                                            {/* Delete button at bottom right */}
                                            <button
                                                type="button"
                                                onClick={() => removePerformer(performer.id)}
                                                className="btn text-right  btn-link text-danger hover-bounce pull-right"
                                                style={{ marginBottom: '20px', width: '100px' }}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>

                                        {/* Image name below if exists */}
                                        {performer.image && (
                                            <p className="text-muted small mt-2 text-truncate">
                                                {performer.image.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="container d-flex  justify-content-end mb-3 mt-5">
                        <div>
                            <button
                                type="button"
                                onClick={addPerformer}
                                style={{ borderRadius: '20px', }}
                                className=" btn btn-sm btn-outline-purple "
                            >
                                Add Guest Artiste  <FiPlus className="me-1" />
                            </button>
                        </div>
                    </div>
                    {errors.performers && <div className="text-danger small mt-2">{errors.performers.message}</div>}
                </div>

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-5">
                    {/* Back Button */}
                    <div>
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn btn-sm  btn-outline-purple px-3 px-sm-4 py-2"
                        >
                            <FiChevronLeft className="me-0 me-sm-2" />
                            <span className=" d-sm-inline">Back</span>
                        </button>
                    </div>

                    {/* Next Button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleSubmit(nextStep)}
                            className="btn btn-sm  btn-purple text-light px-3 px-sm-4 py-2"
                            style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                        >
                            <span className=" d-sm-inline">Next</span>
                            <FiChevronRight className="ms-0 ms-sm-2" />
                        </button>
                    </div>
                </div>
                {/* Add this CSS to your stylesheet */}
                <style jsx>{`
            .border-dashed-upload {
                border: 1px dashed ${PRIMARY_COLOR};
                border-radius: 12px;
                background-color: rgba(244, 230, 253, 0.3);
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .active-drag {
                border-color: ${PRIMARY_COLOR};
                background-color: rgba(244, 230, 253, 0.6);
                transform: scale(1.01);
            }
            
            .border-dashed-placeholder {
                border: 2px dashed rgba(244, 230, 253, 1);
                background-color: rgba(244, 230, 253, 0.2);
            }
            
            .hover-card {
                transition: all 0.3s ease;
                background-color: rgba(244, 230, 253, 0.1);
            }
            
            .hover-card:hover {
                background-color: rgba(244, 230, 253, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            
            .hover-scale {
                transition: transform 0.2s ease;
            }
            
            .hover-scale:hover {
                transform: scale(1.1);
            }
            
            .hover-grow {
                transition: transform 0.3s ease;
            }
            
            .hover-grow:hover {
                transform: scale(1.02);
            }
            
            .hover-bounce {
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .hover-bounce:hover {
                transform: translateY(-2px);
            }
            
            .bg-light-purple {
                background-color: rgba(244, 230, 253, 0.5);
            }
            
            .btn-purple {
                background-color: ${PRIMARY_COLOR};
                color: white;
                transition: all 0.3s ease;
            }
            
            .btn-purple:hover {
                background-color: ${PRIMARY_COLOR};
                opacity: 0.9;
                transform: translateY(-1px);
            }
            
            .btn-outline-purple {
                border-color: ${PRIMARY_COLOR};
                color: ${PRIMARY_COLOR};
                transition: all 0.3s ease;
            }
            
            .btn-outline-purple:hover {
                background-color: rgba(244, 230, 253, 0.3);
                transform: translateY(-1px);
            }
            
            .text-purple {
                color: ${PRIMARY_COLOR};
            }
        `}</style>
            </div>
        );
    };

    // Step 3: Ticketing & Pricing
    const TicketingStep = () => {
        const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
            resolver: zodResolver(ticketingSchema),
            defaultValues: {
                ...formData.step3,
                maxTickets: 'unlimited' // Default to unlimited
            }
        });

        const maxTickets = watch('maxTickets');

        return (
            <div className="container p-2">
                <h2 className="h6 mb-4">Ticketing & Pricing</h2>

                <div className="mb-4">
                    <span className="form-span">Ticket Price*</span>
                    <div className="input-group">

                        <input
                            type="number"
                            {...register('price', { valueAsNumber: true })}
                            step="0.01"
                            min="0"
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                            placeholder="0.00"
                            onBlur={(e) => {
                                if (e.target.value) {
                                    setValue('price', parseFloat(e.target.value).toFixed(2));
                                }
                            }}
                        />
                    </div>
                    {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                </div>

                <div className="mb-4">
                    <span className="form-span">Currency*</span>
                    <select
                        {...register('currency')}
                        className={`form-select ${errors.currency ? 'is-invalid' : ''}`}
                    >
                        <option value="">Select Currency</option>
                        {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>
                                {currency.symbol} - {currency.name} ({currency.code})
                            </option>
                        ))}
                    </select>
                    {errors.currency && <div className="invalid-feedback">{errors.currency.message}</div>}
                </div>

                <div className="mb-4">
                    <span className="form-span">Ticket Availability*</span>
                    <select
                        {...register('maxTickets')}
                        className={`form-select ${errors.maxTickets ? 'is-invalid' : ''}`}
                    >
                        <option value="unlimited">Unlimited tickets</option>
                        <option value="limited">Limited tickets</option>
                    </select>
                    {errors.maxTickets && <div className="invalid-feedback">{errors.maxTickets.message}</div>}
                </div>

                {maxTickets === 'limited' && (
                    <div className="mb-4">
                        <span className="form-span">Total Number of Tickets*</span>
                        <input
                            type="number"
                            {...register('ticketLimit', { valueAsNumber: true })}
                            min="1"
                            className={`form-control ${errors.ticketLimit ? 'is-invalid' : ''}`}
                            placeholder="Enter total tickets available"
                        />
                        {errors.ticketLimit && <div className="invalid-feedback">{errors.ticketLimit.message}</div>}
                    </div>
                )}

                <div className="d-flex justify-content-between mt-5">
                    {/* Back Button */}
                    <div>
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn btn-sm  btn-outline-purple px-3 px-sm-4 py-2"
                        >
                            <FiChevronLeft className="me-0 me-sm-2" />
                            <span className=" d-sm-inline">Back</span>
                        </button>
                    </div>

                    {/* Next Button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleSubmit(nextStep)}
                            className="btn btn-sm  btn-purple text-light px-3 px-sm-4 py-2"
                            style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                        >
                            <span className=" d-sm-inline">Next</span>
                            <FiChevronRight className="ms-0 ms-sm-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Step 4: Streaming Setup
    const StreamingStep = () => {
        const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
            resolver: zodResolver(streamingSchema),
            defaultValues: {
                enableReplay: true,
                streamingOption: '', // Ensure this matches your schema
                streamingDuration: '24', // Set default duration
                ...formData.step4
            }
        });

        const onSubmit = (data) => {
            console.log('Form data:', data);
            nextStep(data); // Proceed to next step
        };

        return (
            <div className="container p-2">
                <h2 className="h5 mb-4">How will you stream this event?</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="form-label">Streaming Options*</label>
                        <select
                            {...register('streamingOption', { required: 'Please select a streaming option' })}
                            className={`form-select ${errors.streamingOption ? 'is-invalid' : ''}`}
                        >
                            <option value="">Select Streaming Option</option>
                            {streamingOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {errors.streamingOption && (
                            <div className="invalid-feedback">{errors.streamingOption.message}</div>
                        )}
                    </div>

                    <div className="mb-4 d-flex justify-content-between align-items-center">
                        <span className="form-label">Enable Event Replay</span>
                        <label className="form-check form-switch">
                            <input
                                type="checkbox"
                                {...register('enableReplay')}
                                className="form-check-input"
                                role="switch"
                                style={{
                                    backgroundColor: watch('enableReplay') ? PRIMARY_COLOR : '#ccc',
                                    borderColor: PRIMARY_COLOR,
                                    width: '3em',
                                    height: '1.5em'
                                }}
                            />
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Replay Duration</label>
                        <div className="d-flex gap-2">
                            {['24', '48', '72'].map(hours => (
                                <button
                                    type="button"
                                    key={hours}
                                    onClick={() => setValue('streamingDuration', hours)}
                                    className={`btn btn-sm p-0 p-2 ${watch('streamingDuration') === hours ? 'btn-purple' : 'btn-outline-secondary'}`}
                                    style={watch('streamingDuration') === hours ? {
                                        backgroundColor: PRIMARY_COLOR,
                                        borderColor: PRIMARY_COLOR,
                                        color: 'white'
                                    } : {}}
                                >
                                    {hours} Hours
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-5">
                        {/* Back Button */}
                        <div>
                            <button
                                type="button"
                                onClick={prevStep}
                                className="btn btn-sm  btn-outline-purple px-3 px-sm-4 py-2"
                            >
                                <FiChevronLeft className="me-0 me-sm-2" />
                                <span className=" d-sm-inline">Back</span>
                            </button>
                        </div>

                        {/* Next Button */}
                        <div>
                            <button
                                type="button"
                                onClick={handleSubmit(nextStep)}
                                className="btn btn-sm  btn-purple text-light px-3 px-sm-4 py-2"
                                style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                            >
                                <span className=" d-sm-inline">Next</span>
                                <FiChevronRight className="ms-0 ms-sm-2" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    // Step 5: Access & Visibility
    const AccessStep = () => {
        const { register, handleSubmit, formState: { errors }, watch } = useForm({
            resolver: zodResolver(accessSchema),
            defaultValues: {
                matureContent: false,
                ...formData.step5
            }
        });

        return (
            <div className="container p-2">
                <h2 className="h5 mb-4">Access & Visibility</h2>

                <div className="mb-4">
                    <label className="form-label">Visibility*</label>
                    <select
                        {...register('visibility', { required: 'Please select visibility' })}
                        className={`form-select ${errors.visibility ? 'is-invalid' : ''}`}
                    >
                        <option value="">Select Visibility</option>
                        {visibilityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.icon} {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.visibility && <div className="invalid-feedback">{errors.visibility.message}</div>}
                </div>

                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">This event contains mature content</label>
                    <div className="form-check form-switch">
                        <input
                            type="checkbox"
                            {...register('matureContent')}
                            className="form-check-input"
                            role="switch"
                            style={{
                                backgroundColor: watch('matureContent') ? PRIMARY_COLOR : '#ccc',
                                borderColor: PRIMARY_COLOR,
                                width: '3em',
                                height: '1.5em'
                            }}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-5">
                    {/* Back Button */}
                    <div>
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn btn-sm  btn-outline-purple px-3 px-sm-4 py-2"
                        >
                            <FiChevronLeft className="me-0 me-sm-2" />
                            <span className=" d-sm-inline">Back</span>
                        </button>
                    </div>

                    {/* Next Button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleSubmit(nextStep)}
                            className="btn btn-sm  btn-purple text-light px-3 px-sm-4 py-2"
                            style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                        >
                            <span className=" d-sm-inline">Next</span>
                            <FiChevronRight className="ms-0 ms-sm-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Step 6: Review & Publish
    const ReviewStep = () => {
        const { handleSubmit } = useForm();
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [error, setError] = useState(null);
        const { user,token } = useAuth();
        console.log(token);
        const reviewData = {
            ...formData.step1,
            ...formData.step2,
            ...formData.step3,
            ...formData.step4,
            ...formData.step5
        };
        console.log(formData);
        const submitEvent = async () => {
            setIsSubmitting(true);
            setError(null);

            try {
                // Create FormData object
                const formData = new FormData();
                const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                formData.append('event_type_id', currentEventType.id);
                formData.append('time_zone', userTimezone);

                // Add all the basic fields from step1
                formData.append('title', reviewData.title || '');
                formData.append('description', reviewData.description || '');
                formData.append('location', reviewData.location || '');
                formData.append('genre', reviewData.genre || '');
                // formData.append('organizer', reviewData.organizer || '');

                // Format date and time
                const formattedDate = reviewData.date ? new Date(reviewData.date).toLocaleDateString('en-US') : '';
                formData.append('event_date', formattedDate);
                formData.append('start_time', reviewData.time || '');

                // Add ticketing data from step3
                formData.append('price', reviewData.price || '0');
                formData.append('ticket_limit', reviewData.maxTickets === 'limited' ? 'limited' : 'unlimited');
                if (reviewData.maxTickets === 'limited') {
                    formData.append('ticket_limit_number', reviewData.ticketLimit || '0');
                }

                // Find currency ID based on selected currency
                const selectedCurrency = currencies.find(c => c.code === reviewData.currency);
                formData.append('currency', selectedCurrency.code + 'N'); // Default to 1 if not found

                // Add streaming data from step4
                formData.append('streaming_option', reviewData.streamingOption || '');
                formData.append('enable_replay', reviewData.enableReplay ? true : false);
                if (reviewData.enableReplay) {
                    formData.append('replay_time', reviewData.streamingDuration || '24');
                }

                // Add access data from step5
                formData.append('visibility', reviewData.visibility || 'public');
                formData.append('post_mature_content', reviewData.matureContent ? 'true' : 'false');

                // Add performers with their names and images
                performers.forEach((performer, index) => {
                    formData.append(`performers[${index}][name]`, performer.name || '');
                    if (performer.image) {
                        formData.append(`performers[${index}][image]`, performer.image);
                    }
                });

                // Add event image if exists
                if (eventImage) {
                    formData.append('poster', eventImage);
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/v1/event/store`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                // console.log('-----------------',response);
                if (!response.status) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create event');
                }

                // const data = await response.json();
                setShowSuccessModal(true);
            } catch (err) {
                console.log(err);
                setError(err.message || 'Failed to create event');
            } finally {
                setIsSubmitting(false);
            }
        };

        const onSubmit = (data) => {
            submitEvent();
        };

        return (
            <div className="container review_container py-4">
                {/* <h2 className="text-center fw-bold mb-4" style={{ color: PRIMARY_COLOR }}>Review Your Event</h2> */}

                <div className="bg-white rounded shadow-sm p-3 p-md-4">
                    {/* Event Image */}
                    <div className="mb-4 border-bottom pb-3">
                        <div className="d-flex justify-content-between w-100 mb-2 bg-">
                            <h5 className="mb-0 bg-">Event Image</h5>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="bt btn-sm btn-link  text-decoration-none"
                                style={{ color: PRIMARY_COLOR, background: 'none', border: 'none', marginTop: '-10px' }}
                            >
                                <FiEdit2 className="me-1" /> Edit
                            </button>
                        </div>
                        {eventImage ? (
                            <div className="text-center">
                                <img
                                    src={URL.createObjectURL(eventImage)}
                                    alt="Event preview"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '300px' }}
                                />
                            </div>
                        ) : (
                            <div className="text-center border rounded bg-light py-4">
                                <FiImage className="fs-1 text-muted mb-2" />
                                <p className="text-muted">No image uploaded</p>
                            </div>
                        )}
                    </div>

                    {/* Performers */}
                    {performers.length > 0 && (
                        <div className="mb-4 border-bottom pb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">Guest Performers</h5>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    className="bt btn-sm btn-link  text-decoration-none"
                                    style={{ color: PRIMARY_COLOR, background: 'none', border: 'none', marginTop: '-10px' }}
                                >
                                    <FiEdit2 className="me-1" /> Edit
                                </button>
                            </div>
                            <div className="row g-3">
                                {performers.map((performer) => (
                                    <div key={performer.id} className="col-6 col-sm-4 col-md-3 col-lg-2 text-center">
                                        <div className="mx-auto rounded-circle overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                            {performer.image ? (
                                                <img
                                                    src={URL.createObjectURL(performer.image)}
                                                    alt={performer.name}
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            ) : (
                                                <FiUser className="fs-4 text-muted" />
                                            )}
                                        </div>
                                        <p className="small mt-2 text-truncate mb-0">{performer.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Event Details */}
                    <div className="mb-4 border-bottom pb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Event Details</h5>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="bt btn-sm btn-link  text-decoration-none"
                                style={{ color: PRIMARY_COLOR, background: 'none', border: 'none', marginTop: '-10px' }}
                            >
                                <FiEdit2 className="me-1" /> Edit
                            </button>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Title</small>
                                <p>{reviewData.title || 'Not provided'}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Organizer</small>
                                <p>{reviewData.organizer || 'Not provided'}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Date & Time</small>
                                <p>
                                    {reviewData.date ? new Date(reviewData.date).toLocaleDateString() : 'Not provided'}
                                    {reviewData.time && ` at ${reviewData.time}`}
                                </p>
                                <small className="text-muted">{timezone}</small>
                            </div>
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Location</small>
                                <p>{reviewData.location || 'Not provided'}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Genre</small>
                                <p>{reviewData.genre || 'Not provided'}</p>
                            </div>
                            <div className="col-12 mb-3">
                                <small className="text-muted">Description</small>
                                <p>{reviewData.description || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ticketing */}
                    <div className="mb-4 border-bottom pb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Ticketing</h5>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(3)}
                                className="bt btn-sm btn-link  text-decoration-none"
                                style={{ color: PRIMARY_COLOR, background: 'none', border: 'none', marginTop: '-10px' }}
                            >
                                <FiEdit2 className="me-1" /> Edit
                            </button>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Ticket Type</small>
                                <p className="text-capitalize">{reviewData.ticketType || 'Not provided'}</p>
                            </div>
                            {reviewData.ticketType === 'paid' && (
                                <>
                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">Price</small>
                                        <p>
                                            {reviewData.currency && currencies.find(c => c.code === reviewData.currency)?.symbol}
                                            {reviewData.price || '0.00'}
                                        </p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">Currency</small>
                                        <p>{reviewData.currency || 'Not provided'}</p>
                                    </div>
                                </>
                            )}
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Availability</small>
                                <p className="text-capitalize">
                                    {reviewData.maxTickets === 'limited'
                                        ? `Limited (${reviewData.ticketLimit || '?'})`
                                        : 'Unlimited'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Streaming */}
                    {reviewData.enableStreaming && (
                        <div className="mb-4 border-bottom pb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">Streaming</h5>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(4)}
                                    className="bt btn-sm btn-link  text-decoration-none"
                                    style={{ color: PRIMARY_COLOR, background: 'none', border: 'none', marginTop: '-10px' }}
                                >
                                    <FiEdit2 className="me-1" /> Edit
                                </button>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <small className="text-muted">Option</small>
                                    <p>{reviewData.streamingOption || 'Not provided'}</p>
                                </div>
                                {reviewData.streamingDuration && (
                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">Duration</small>
                                        <p>{reviewData.streamingDuration} Hours</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Access */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Access & Visibility</h5>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(5)}
                                className="bt btn-sm btn-link  text-decoration-none"
                                style={{ color: PRIMARY_COLOR, background: 'none', border: 'none', marginTop: '-10px' }}
                            >
                                <FiEdit2 className="me-1" /> Edit
                            </button>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Visibility</small>
                                <p className="text-capitalize">{reviewData.visibility || 'Not provided'}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Mature Content</small>
                                <p>{reviewData.matureContent ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-5">
                        {/* Back Button */}
                        <div>
                            <button
                                type="button"
                                onClick={prevStep}
                                className="btn btn-sm  btn-outline-purple px-3 px-sm-4 py-2"
                            >
                                <FiChevronLeft className="me-0 me-sm-2" />
                                <span className=" d-sm-inline">Back</span>
                            </button>
                        </div>

                        {/* Next Button */}
                        <div>
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                className="btn btn-sm  btn-purple text-light px-3 px-sm-4 py-2"
                                style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Event'}
                            </button>

                        </div>
                    </div>
                    {error && (
                        <div className="alert alert-danger mt-3">
                            {error}
                        </div>
                    )}

                </div>
            </div>
        );
    };


    // Success Modal
    const SuccessModal = () => {
        const reviewData = {
            ...formData.step1
        };
        return (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content animate__animated animate__zoomIn">
                        <div className="modal-body text-center ">
                            <div className="mb-4">
                                <div className="mx-auto bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '80px', height: '80px' }}>
                                    <svg className="bi bi-check-circle-fill text-success"
                                        style={{ width: '48px', height: '48px' }}
                                        viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="h3 mb-3 fw-bold">Event Created !</h3>
                            <p className="text-muted mb-4">You have successfully published your event {reviewData.title}. Attendees would be alerted on the event.</p>
                            <div className="d-flex justify-content-between mt-5">
                                {/* Back Button */}
                                <div>
                                    <Link
                                        to={'/account'}
                                        className="btn btn-sm  btn-outline-purple px-3 px-sm-4 py-2"
                                    >
                                        <span className="d-sm-inline">Go To Profile</span>
                                    </Link>
                                </div>

                                {/* Next Button */}
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-sm  btn-purple text-light px-3 px-sm-4 py-2"
                                        style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                                        onClick={() => {
                                            setShowSuccessModal(false);
                                            // setCurrentStep(1);
                                            // setEventImage(null);
                                            // setPerformers([]);
                                        }}
                                    >
                                        <span className=" d-sm-inline">Go Home</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Progress Steps

    const ProgressSteps = ({ currentStep, completedSteps = [] }) => {
        const steps = [
            "Event Information",
            "Media upload",
            "Ticketing & pricing",
            "Streaming setup",
            "Access & Visibility",
            "Review & publish",
        ];
        const pprevStep = () => {
            if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
            }
        };
        return (
            <div className="w-100 mb-5   create_event_section d-non">
                {/* <p className='text-center '>
                    <button className='btn text-light btn-inline btn-sm' style={{ cursor: 'pointer', backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}>
                        <span className='fa fa-cancle' onClickCapture={() => setSelectedEvent(null)}></span>Cancle
                    </button>
                </p> */}

                <div className="mobile_step  justify-content-between">
                    <div className="goBack">
                        {currentStep > 1 && (
                            <span style={{ cursor: 'pointer' }} className='fa fa-angle-left' onclick={pprevStep}></span>
                        )}
                    </div>
                    <div className="step_label">
                        <b> {steps[currentStep - 1]}</b>
                    </div>
                    <div className="stepCounter">
                        {'step ' + currentStep + ' of 8'}
                    </div>
                </div>
                <div className=" align-items-center justify-content-center flex-nowrap overflow-auto main_step ">
                    {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = completedSteps.includes(stepNumber);
                        const isActive = currentStep === stepNumber;
                        return (
                            <React.Fragment key={index}>
                                {/* Step circle & label */}
                                <div className="d-flex flex-column align-items-center text-center position-relative mx-2 min-width-step ">
                                    <div
                                        className={`step-circle mb-1 ${isCompleted ? "completed" : isActive ? "active" : "inactive"}`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle size={20} strokeWidth={2.5} />
                                        ) : (
                                            <span className="step-number">{'0' + stepNumber}</span>
                                        )}
                                    </div>
                                    <small className={`step-label ${isActive ? "active-label fw-bold" : "text-muted"}`}>
                                        {label}
                                    </small>
                                </div>


                                {/* Connector Line (except after last) */}
                                {index < steps.length - 1 && (
                                    <div className="d-flex align-items-center justify-content-center " style={{ minWidth: 80 }}>
                                        <div className="w-100 position-relative">
                                            <div className="bg-secondary w-100" style={{ position: 'absolute', top: '-20px', height: "2px", borderRadius: "2px" }}></div>
                                            {currentStep - 1 > index && (
                                                <div className="bg-prima position-absolute  start-0" style={{ background: 'rgba(143, 7, 231, 1)', position: 'absolute', top: '-20px', height: "2px", width: "100%", borderRadius: "2px" }}></div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}

                </div>
            </div>
        );
    };








    return (
        <div className="containe m mx-auto pb-5 mb-5">
            {/* <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
            <p className="text-gray-600 mb-8">Fill in the details below to create your event</p> */}

            <ProgressSteps currentStep={currentStep} completedSteps={completedSteps} />

            {currentStep === 1 && <EventInformationStep />}
            {currentStep === 2 && <MediaUploadStep />}
            {currentStep === 3 && <TicketingStep />}
            {currentStep === 4 && <StreamingStep />}
            {currentStep === 5 && <AccessStep />}
            {currentStep === 6 && <ReviewStep />}

            {showSuccessModal && <SuccessModal />}
        </div>
    );
};

export default EventCreationWizard;