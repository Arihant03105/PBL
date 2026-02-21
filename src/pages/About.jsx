import { Helmet } from 'react-helmet-async'
import { BookOpen, Target, Users, Shield, Heart } from 'lucide-react'

export default function About() {
    return (
        <main className="min-h-screen py-20 px-4">
            <Helmet>
                <title>About Us | EduExchange - Our Mission & Vision</title>
                <meta name="description" content="Learn more about EduExchange, the community-driven platform dedicated to making study materials accessible to every campus student." />
            </Helmet>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-sm"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h1 className="section-title mb-4">Empowering <span className="gradient-text">Campus Learning</span></h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        EduExchange was born out of a simple idea: No student should ever struggle to find high-quality study resources.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <section className="card p-8">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 text-indigo-400">
                            <Target size={24} />
                        </div>
                        <h2 className="text-xl font-bold mb-3 text-white">Our Mission</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            To create a unified, open-access repository for academic materials where students can share knowledge, help their peers, and excel together without barriers.
                        </p>
                    </section>
                    <section className="card p-8">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-5 text-purple-400">
                            <Heart size={24} />
                        </div>
                        <h2 className="text-xl font-bold mb-3 text-white">Our Values</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            We believe in academic integrity, community collaboration, and the power of shared knowledge. Our platform is built on trust and mutual support.
                        </p>
                    </section>
                </div>

                <section className="card p-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-indigo-500 to-purple-600" />
                    <div className="relative">
                        <h2 className="text-2xl font-bold mb-4 text-white">How it Works</h2>
                        <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                            EduExchange is powered by students like you. When you upload a high-quality resource, you're not just sharing a file—you're helping a peer pass an exam or understand a complex concept.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { icon: <Shield size={18} />, title: 'Verified', desc: 'Secure campus login' },
                                { icon: <Users size={18} />, title: 'Collaborative', desc: 'Peer-reviewed content' },
                                { icon: <BookOpen size={18} />, title: 'Accessible', desc: 'Free for everyone' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="mx-auto text-indigo-400">{item.icon}</div>
                                    <div className="text-sm font-bold text-white">{item.title}</div>
                                    <div className="text-xs text-slate-500">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
