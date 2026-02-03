import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Welcome to the future</span>
          </motion.div>

          {/* Main headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Build something{" "}
            <span className="relative">
              extraordinary
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full origin-left"
              />
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Create beautiful experiences that inspire and delight. 
            Simple, elegant, and crafted with care.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="accent" size="xl">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
