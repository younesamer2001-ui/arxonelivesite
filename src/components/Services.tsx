'use client';

import { motion } from 'framer-motion';
import VoiceTestimonial from './ui/voice-testimonial';
import { Heart, Home, Calculator, Target, Car, Zap } from 'lucide-react';

// Demo AI receptionists
const aiReceptionists = {
  no: [
    {
      name: 'Lisa',
      jobtitle: 'Helse & Klinikk',
      text: 'Jeg hjelper klinikker med timebooking, påminnelser og pasienthenvendelser. Jeg kan snakke om behandlinger og tilgjengelighet.',
      phoneNumber: '+47 123 45 678',
      audio: '/audio/lisa-demo.mp3',
      icon: Heart,
      assistantId: '3e6bee7b-00b2-41e9-8225-f314800d8e5e'
    },
    {
      name: 'Marcus',
      jobtitle: 'Eiendom',
      text: 'Jeg hjelper eiendomsmeglere med visningsbooking, salgsspørsmål og kundeoppfølging. Jeg kjenner alle eiendommene.',
      phoneNumber: '+47 123 45 679',
      audio: '/audio/marcus-demo.mp3',
      icon: Home,
      assistantId: '4b2b63e9-eabf-4662-9dc0-05948413103f'
    },
    {
      name: 'Emma',
      jobtitle: 'Regnskap & Økonomi',
      text: 'Jeg hjelper regnskapsførere med kundehenvendelser, fakturaspørsmål og booking av møter.',
      phoneNumber: '+47 123 45 680',
      audio: '/audio/emma-demo.mp3',
      icon: Calculator,
      assistantId: 'f0739e18-7732-4a69-93ea-7645b0e22a31'
    },
