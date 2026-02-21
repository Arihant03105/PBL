import { Helmet } from 'react-helmet-async'
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react'

export default function Privacy() {
    return (
        <main className="min-h-screen py-20 px-4">
            <Helmet>
                <title>Privacy Policy | EduExchange</title>
                <meta name="description" content="Read the EduExchange privacy policy to understand how we collect, use, and protect your data." />
            </Helmet>

            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4 text-indigo-400">
                        <ShieldCheck size={32} />
                        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                    </div>
                    <p className="text-sm text-slate-500 italic">Last updated: February 21, 2026</p>
                </header>

                <div className="space-y-10">
                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Eye size={20} className="text-indigo-400" /> Information We Collect
                        </h2>
                        <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                            <p>We collect information you provide directly to us when you create an account, upload materials, or communicate with us.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Account Information:</strong> Name, email address, password, and university details.</li>
                                <li><strong>Content:</strong> Study materials, descriptions, and tags you upload to our platform.</li>
                                <li><strong>Communications:</strong> Any feedback or support requests you send to us.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Lock size={20} className="text-purple-400" /> How We Use Your Information
                        </h2>
                        <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Provide, maintain, and improve our services.</li>
                                <li>Process transactions and send related information.</li>
                                <li>Personalize your experience and content.</li>
                                <li>Communicate with you about updates and community news.</li>
                                <li>Monitor and analyze trends, usage, and activities.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <FileText size={20} className="text-emerald-400" /> Data Sharing & Disclosure
                        </h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            EduExchange does not sell your personal data. We only share information when required by law, to protect our rights, or with your explicit consent. Public contributions (like uploaded materials) are visible to other logged-in users.
                        </p>
                    </section>

                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white">Third-Party Services</h2>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            We may use third-party services like Google AdSense to display advertisements. These services may use cookies and similar technologies to collect information about your activities across different websites.
                        </p>
                        <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                            <p className="text-xs text-indigo-300">
                                <strong>Note:</strong> You can opt-out of personalized advertising by visiting Google's Ads Settings.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
