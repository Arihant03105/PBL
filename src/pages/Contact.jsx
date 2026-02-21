import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react'

export default function Contact() {
    const [sent, setSent] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent(true)
        setTimeout(() => setSent(false), 3000)
    }

    return (
        <main className="min-h-screen py-20 px-4">
            <Helmet>
                <title>Contact Us | EduExchange Support</title>
                <meta name="description" content="Get in touch with the EduExchange team for support, feedback, or collaboration queries." />
            </Helmet>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="section-title mb-4">Get in <span className="gradient-text">Touch</span></h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Have questions or suggestions? We'd love to hear from you. Our team typically responds within 24 hours.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <aside className="space-y-6">
                        <section className="card p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Email Us</h3>
                                    <p className="text-xs text-slate-500">contact@eduexchange.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Live Chat</h3>
                                    <p className="text-xs text-slate-500">Available Mon-Fri, 9am-6pm</p>
                                </div>
                            </div>
                        </section>

                        <section className="card p-6">
                            <h3 className="text-sm font-semibold text-white mb-4">Campus Presence</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-slate-500 mt-1" />
                                    <p className="text-xs text-slate-400">Academic Block A, Ground Floor<br />Central University Campus</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-slate-500" />
                                    <p className="text-xs text-slate-400">+91 [Your Phone Number]</p>
                                </div>
                            </div>
                        </section>
                    </aside>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400">Full Name</label>
                                    <input type="text" required className="input-field" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400">Email Address</label>
                                    <input type="email" required className="input-field" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">Subject</label>
                                <input type="text" required className="input-field" placeholder="How can we help?" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">Message</label>
                                <textarea required rows={5} className="input-field resize-none" placeholder="Enter your detailed message here..." />
                            </div>

                            <button disabled={sent} className={`btn-primary w-full justify-center py-3.5 glow ${sent ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
                                {sent ? 'Message Sent!' : <><Send size={18} /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
