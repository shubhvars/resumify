"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, TrendingUp, Users, Award } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "TechCorp Inc.",
    content: "Resumify helped me land my dream job at a FAANG company. The ATS optimization feature is incredible!",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "Growth Solutions",
    content: "The AI suggestions improved my resume significantly. I got 3x more interview calls after using this tool.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Emily Watson",
    role: "UX Designer",
    company: "Design Studio Pro",
    content: "The templates are beautiful and professional. The entire process took me less than 30 minutes!",
    rating: 5,
    avatar: "EW"
  }
]

const stats = [
  {
    number: "50K+",
    label: "Resumes Created",
    icon: <Users className="h-5 w-5" />,
    color: "#00D4FF"
  },
  {
    number: "95%",
    label: "ATS Pass Rate",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "#00FFA3"
  },
  {
    number: "4.9/5",
    label: "User Rating",
    icon: <Star className="h-5 w-5" />,
    color: "#FFD93D"
  }
]

export default function TestimonialsSection() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32 bg-muted/30">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of successful job seekers who have transformed their careers with Resumify.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="relative mb-4">
                  <Quote className="w-8 h-8 text-primary/30 absolute -top-2 -left-2" />
                  <p className="text-sm italic text-muted-foreground pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Company logos placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-muted-foreground mb-8">Trusted by employees from leading companies</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {[
            "EY",
            "Blackstone",
            "Deloitte",
            "Growth School",
            "TechCorp",
            "Design Studio Pro"
          ].map((company, index) => (
            <div key={index} className="text-lg font-bold text-muted-foreground">
              {company}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
