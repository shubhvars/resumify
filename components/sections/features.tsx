"use client"

import { motion } from "framer-motion"
import { FileText, Brain, ShieldCheck, BarChart3, UserCircle2, Sparkles } from "lucide-react"

const features = [
  { title: "Build resume from GitHub", icon: <FileText className="h-5 w-5" aria-hidden />, color: "#00D4FF", old: "Basic static functionality", new: "Upgraded, interactive, and intelligent" },
  { title: "Dynamic dashboard", icon: <BarChart3 className="h-5 w-5" aria-hidden />, color: "#9B5BFF", old: "Not available", new: "Save user all data, dynamic memory" },
  { title: "ATS score checker", icon: <ShieldCheck className="h-5 w-5" aria-hidden />, color: "#00FFA3", old: "Not available", new: "AI-powered ATS score checker" },
  { title: "AI-powered enhancer", icon: <Brain className="h-5 w-5" aria-hidden />, color: "#00D4FF", old: "Not available", new: "AI-powered enhancer,skills suggestions" },
  { title: "Professional templates", icon: <Sparkles className="h-5 w-5" aria-hidden />, color: "#9B5BFF", old: "Not available", new: "fully functional modern templates" },
  { title: "Google authentication & profile", icon: <UserCircle2 className="h-5 w-5" aria-hidden />, color: "#00FFA3", old: "Not available", new: "secure, fast, and easy google authentication" },
]

export default function Features() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <motion.h3
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl md:text-4xl font-semibold mb-6 text-foreground"
      >
        Product capabilities
      </motion.h3>

      <p className="text-muted-foreground leading-relaxed">
        A concise overview of the most impactful improvements—moving from a static tool to an AI‑assisted, data‑aware
        platform with a modern UX and secure auth.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-md p-2" style={{ background: `${f.color}20`, color: f.color }}>
                {f.icon}
              </span>
              <h4 className="font-medium text-foreground">{f.title}</h4>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-background/40 p-2">
                <p className="text-muted-foreground">Old</p>
                <p className="text-foreground/90">{f.old}</p>
              </div>
              <div className="rounded-md bg-background/60 p-2">
                <p className="text-muted-foreground">New</p>
                <p className="text-foreground/90">{f.new}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
