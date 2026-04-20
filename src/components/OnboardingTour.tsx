import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from './ui';
import { X, ChevronRight, LayoutDashboard, Briefcase, CheckSquare, Tag, Users } from 'lucide-react';

const steps = [
  {
    title: "Welcome to Brivo!",
    description: "Your all-in-one brand management workstation. Let's take a quick 30-second tour to get you started.",
    icon: LayoutDashboard,
    element: null,
  },
  {
    title: "Track Your Projects",
    description: "Organize your workflow into distinct projects. Set deadlines, assign teams, and monitor progress in real-time.",
    icon: Briefcase,
    element: "Projects",
  },
  {
    title: "Manage Tasks",
    description: "Break down projects into actionable tasks. Use the Kanban board for intuitive drag-and-drop management.",
    icon: CheckSquare,
    element: "Tasks",
  },
  {
    title: "Centralize Brand Assets",
    description: "Store brand guidelines, colors, and logos in the Brands section to ensure visual consistency across all projects.",
    icon: Tag,
    element: "Brands",
  },
  {
    title: "Collaborate with Your Team",
    description: "Invite members, assign roles, and communicate seamlessly. Everyone stays on the same page.",
    icon: Users,
    element: "Team",
  }
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const forceTour = searchParams.get('tour') === 'true';
    const hasSeenOnboarding = localStorage.getItem('onboarding_complete');
    
    if (forceTour) {
      setCurrentStep(0);
      setIsVisible(true);
      // Remove the tour param from URL without refreshing
      const params = new URLSearchParams(location.search);
      params.delete('tour');
      const newPath = location.pathname + (params.toString() ? `?${params.toString()}` : '');
      navigate(newPath, { replace: true });
    } else if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [location.search, location.pathname, navigate]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding_complete', 'true');
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 relative overflow-hidden ring-4 ring-primary/20">
            <div className="absolute top-0 right-0 p-4">
              <Button variant="ghost" size="icon" onClick={completeOnboarding} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/30">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center gap-1.5">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-primary' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 font-bold" onClick={completeOnboarding}>
                  Skip Tour
                </Button>
                <Button className="flex-1 font-bold shadow-lg shadow-primary/30" onClick={handleNext}>
                  {currentStep === steps.length - 1 ? "Finish" : "Next Step"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
