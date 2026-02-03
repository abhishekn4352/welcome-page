import { motion } from "framer-motion";
import { Zap, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed and performance. Every millisecond counts when creating exceptional experiences.",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description: "Security isn't an afterthought. It's woven into every layer of what we build.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Crafted with attention to detail and a passion for creating something truly special.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why choose us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We focus on what matters most—delivering exceptional quality and experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
