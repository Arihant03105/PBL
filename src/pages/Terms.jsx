import { Helmet } from 'react-helmet-async'
import { FileText, Scale, Gavel, AlertCircle } from 'lucide-react'

export default function Terms() {
    return (
        <main className="min-h-screen py-20 px-4">
            <Helmet>
                <title>Terms of Service | EduExchange</title>
                <meta name="description" content="Read the EduExchange terms of service to understand the rules and guidelines for using our platform." />
            </Helmet>

            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                        <Scale size={32} />
                        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                    </div>
                    <p className="text-sm text-slate-500 italic">Last updated: February 21, 2026</p>
                </header>

                <div className="space-y-10">
                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Gavel size={20} className="text-purple-400" /> Acceptance of Terms
                        </h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            By accessing or using EduExchange, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our platform. These terms apply to all visitors, users, and others who access the service.
                        </p>
                    </section>

                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <FileText size={20} className="text-indigo-400" /> User Conduct & Content
                        </h2>
                        <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                            <p>As a user of EduExchange, you agree not to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Upload any content that violates intellectual property rights.</li>
                                <li>Share misleading, fraudulent, or harmful materials.</li>
                                <li>Harass, abuse, or harm other members of the community.</li>
                                <li>Use the service for any illegal or unauthorized purpose.</li>
                            </ul>
                            <p className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 text-xs text-red-400">
                                <strong>Academic Integrity:</strong> EduExchange is for study support. Using these materials to cheat or violate your institution's academic integrity policy is strictly prohibited.
                            </p>
                        </div>
                    </section>

                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white">Intellectual Property</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            You retain all rights to the content you upload. However, by uploading, you grant EduExchange a worldwide, non-exclusive license to host, store, and share that content with other users of the platform.
                        </p>
                    </section>

                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <AlertCircle size={20} className="text-amber-400" /> Disclaimer of Warranties
                        </h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            EduExchange is provided "as is" and "as available" without any warranties. We do not guarantee the accuracy, completeness, or usefulness of any study materials provided by users. Use of the materials is at your own risk.
                        </p>
                    </section>

                    <section className="card p-8">
                        <h2 className="text-xl font-bold mb-4 text-white">Modifications</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes by posting the new terms on this page.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
