import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Sparkles } from "lucide-react";
import FeatureBadges from "./featureBadges";
// import TrustIndicators from "./trustIndicators";
import ResumePreview from "./resumePreview";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen hero-gradient overflow-hidden bg-mesh-gradient">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-dots-pattern opacity-30"></div>

      {/* Floating orbs with animations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/15 rounded-full blur-2xl animate-float"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 ">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-12">
          {/* Left Column - Content */}
          <div className="space-y-8 stagger-children">
            {/* Trust badge */}
            <div className="flex items-center gap-2 animate-slide-in-up">
              <div className="p-1.5 bg-primary/10 rounded-full pulse-ring">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Trusted by Working professionals</span>
              <Sparkles className="w-3 h-3 text-accent animate-float" />
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-slide-in-up delay-100">
                <span className="gradient-text">AI-powered</span>
                <br />
                <span className="text-foreground hover:text-gradient-rainbow transition-all duration-500 cursor-default">Resumify</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg animate-slide-in-up delay-200">
                Create professional, ATS-friendly resumes that get you noticed. <span className="gradient-text-static font-semibold hover:text-gradient-rainbow transition-all">Stand out from the crowd</span> with our expertly designed templates.
              </p>
            </div>

            {/* Feature badges */}
            <div className="animate-slide-in-up delay-300">
              <FeatureBadges />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up delay-400">
              <Link href="/builder">
                <Button size="lg" className="group btn-interactive glow-primary hover:glow-secondary transition-all duration-300">
                  <Sparkles className="w-4 h-4 mr-2 group-hover:animate-wiggle" />
                  Start Building Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/atsScore">
                <Button variant="outline" size="lg" className="group hover-lift hover:border-primary/50 transition-all duration-300">
                  <Target className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                  Get ATS Score
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            {/* <TrustIndicators /> */}
          </div>

          {/* Right Column - Resume Preview */}
          <div className="relative animate-slide-in-right delay-500">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-2xl animate-float-slow opacity-60"></div>
            <div className="relative">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
