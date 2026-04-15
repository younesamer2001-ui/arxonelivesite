import { Home, Users, CreditCard, BookOpen, Briefcase, Mail } from 'lucide-react'

export const navItems = {
  no: [
    { name: 'Hjem', url: '/#hjem', icon: Home },
    { name: 'Om oss', url: '/om-oss', icon: Users },
    { name: 'Priser', url: '/#priser', icon: CreditCard },
    { name: 'Blogg', url: '/blogg', icon: BookOpen },
    { name: 'Karriere', url: '/karriere', icon: Briefcase },
    { name: 'Kontakt', url: '/#kontakt', icon: Mail },
  ],
  en: [
    { name: 'Home', url: '/#hjem', icon: Home },
    { name: 'About', url: '/om-oss', icon: Users },
    { name: 'Pricing', url: '/#priser', icon: CreditCard },
    { name: 'Blog', url: '/blogg', icon: BookOpen },
    { name: 'Careers', url: '/karriere', icon: Briefcase },
    { name: 'Contact', url: '/#kontakt', icon: Mail },
  ],
}