"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Target, FileText, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"

const features = [
  "AI-powered suggestions",
  "ATS optimization",
  "Professional templates",
  "GitHub integration"
]

export default function CTASection() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            Ready to Get Started?
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Create Your Perfect Resume Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of professionals who have already transformed their job search with Resumify.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">Why Choose Resumify?</h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-primary" />
              <span className="font-semibold">ATS Score Guarantee</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Our resumes are designed to pass ATS systems with a 95% success rate. Get detailed feedback and improve your score.
            </p>
          </div>
        </motion.div>

        {/* Right side - CTA */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <div className="p-8 bg-background rounded-lg border shadow-lg">
            <div className="mb-6">
              <div className="text-3xl font-bold mb-2">Free to Start</div>
              <div className="text-muted-foreground">No credit card required</div>
            </div>

            <div className="space-y-4">
              <Button size="lg" className="w-full group" asChild>
                <Link href="/builder">
                  <FileText className="w-5 h-5 mr-2" />
                  Start Building Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="w-full group" asChild>
                <Link href="/ats-score">
                  <Target className="w-4 h-4 mr-2" />
                  Check ATS Score Free
                  <Zap className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <p className="text-muted-foreground mb-6">
          Ready to land your dream job? Start building your professional resume now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="group" asChild>
            <Link href="/builder">
              Create Resume Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/template">
              Browse Templates
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
