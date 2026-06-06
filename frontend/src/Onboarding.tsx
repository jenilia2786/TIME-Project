import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, ChevronRight, Lock, BookOpen, GraduationCap } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'student' | 'parent' | null>(null);
  const [formData, setFormData] = useState({ name: '', mobile: '', otp: '', dob: '', classLevel: '' });

  const nextStep = () => setStep((s) => s + 1);

  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background soft-gradient">
      <div className="w-full max-w-lg bg-surface rounded-3xl p-10 card-shadow border border-gray-50 overflow-hidden relative min-h-[400px]">
        <div className="absolute top-8 left-10">
          <div className="text-xl font-bold text-primary tracking-tight">Guider.AI</div>
        </div>
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="mt-16 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Role Selection */}
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Who are you?</h2>
                <p className="text-gray-500 mb-8">Select your role to get started.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setRole('student'); nextStep(); }}
                    className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-transparent bg-gray-50 hover:bg-primary/5 hover:border-primary/30 transition-all group"
                  >
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 card-shadow group-hover:scale-110 transition-transform">
                      <User className="text-primary w-8 h-8" />
                    </div>
                    <span className="font-bold text-gray-900">I'm a Student</span>
                  </button>

                  <button 
                    onClick={() => { setRole('parent'); nextStep(); }}
                    className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-transparent bg-gray-50 hover:bg-primary/5 hover:border-primary/30 transition-all group"
                  >
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 card-shadow group-hover:scale-110 transition-transform">
                      <Users className="text-primary w-8 h-8" />
                    </div>
                    <span className="font-bold text-gray-900">I'm a Parent</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Basic Info & Mobile */}
            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's get to know you</h2>
                <p className="text-gray-500 mb-8">We'll send a quick code to verify your number.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={role === 'student' ? 'e.g. Arjun Kumar' : 'e.g. Mr. Kumar'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  
                  <button 
                    onClick={nextStep}
                    disabled={!formData.name || !formData.mobile}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-6 hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    Send OTP <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: OTP Verification */}
            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="text-primary w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Verify Number</h2>
                <p className="text-gray-500 mb-8 text-center">Enter the 6-digit code sent to +91 {formData.mobile}</p>
                
                <div className="flex justify-center gap-3 mb-8">
                   {[1,2,3,4,5,6].map((i) => (
                     <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                   ))}
                </div>
                
                <button 
                  onClick={nextStep}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Verify & Continue
                </button>
              </motion.div>
            )}

            {/* STEP 4: Student specific details */}
            {step === 4 && role === 'student' && (
              <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Where are you studying?</h2>
                <p className="text-gray-500 mb-8">This helps us tailor your career roadmap.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button 
                    onClick={() => setFormData({...formData, classLevel: '10'})}
                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center ${formData.classLevel === '10' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/30'}`}
                  >
                    <BookOpen className={`w-8 h-8 mb-2 ${formData.classLevel === '10' ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="font-bold">Class 10</span>
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, classLevel: '12'})}
                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center ${formData.classLevel === '12' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/30'}`}
                  >
                    <GraduationCap className={`w-8 h-8 mb-2 ${formData.classLevel === '12' ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="font-bold">Class 12</span>
                  </button>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Date of Birth (Your Password)</label>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>

                <button 
                  onClick={onComplete}
                  disabled={!formData.classLevel || !formData.dob}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-6 hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  Generate My Profile
                </button>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
