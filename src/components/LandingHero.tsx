import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Zap, Shield, Users, TrendingDown, Clock, Star } from "lucide-react";
import { APP_CONFIG, OPERATORS } from "@/constants";

interface LandingHeroProps {
  onGetStarted: () => void;
  totalOffers: number;
  avgSavings: number;
}

const LandingHero = ({ onGetStarted, totalOffers, avgSavings }: LandingHeroProps) => {
  const features = [
    {
      icon: TrendingDown,
      title: "সেরা দাম গ্যারান্টি",
      description: "বাজারের সবচেয়ে কম দামে সিম অফার",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "তাৎক্ষণিক অ্যাক্টিভেশন",
      description: "WhatsApp এ অর্ডার করুন, ১ মিনিটে অ্যাক্টিভ",
      color: "text-blue-600"
    },
    {
      icon: Shield,
      title: "১০০% নিরাপদ",
      description: "অরিজিনাল অপারেটর অফার, কোন ঝামেলা নেই",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "৫০,০০০+ সন্তুষ্ট গ্রাহক",
      description: "বাংলাদেশের #১ সিম অফার মার্কেটপ্লেস",
      color: "text-orange-600"
    }
  ];

  const operators = Object.values(OPERATORS);
  const testimonials = [
    {
      name: "রহিম উদ্দিন",
      location: "ঢাকা",
      text: "৫০% পর্যন্ত সাশ্রয় হয়েছে! দারুণ সার্ভিস।",
      rating: 5
    },
    {
      name: "ফাতেমা খাতুন", 
      location: "চট্টগ্রাম",
      text: "খুব সহজে অর্ডার করতে পারি। দ্রুত অ্যাক্টিভেশন।",
      rating: 5
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          {/* Trust Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2 fill-current" />
              বাংলাদেশের #১ সিম অফার মার্কেটপ্লেস
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-blue-600">{APP_CONFIG.name}</span>
            <br />
            <span className="text-2xl md:text-3xl text-gray-600 font-medium">
              {APP_CONFIG.tagline}
            </span>
          </h1>

          {/* Value Proposition */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            সব অপারেটরের সেরা ডেটা প্যাক, কম্বো অফার এবং মিনিট প্যাক এক জায়গায়। 
            <strong className="text-green-600"> ৫০% পর্যন্ত সাশ্রয় করুন</strong> এবং 
            <strong className="text-blue-600"> তাৎক্ষণিক অ্যাক্টিভেশন</strong> পান।
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalOffers}+</div>
              <div className="text-gray-600">লাইভ অফার</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">৳{avgSavings}+</div>
              <div className="text-gray-600">গড় সাশ্রয়</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">৫০K+</div>
              <div className="text-gray-600">সন্তুষ্ট গ্রাহক</div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            এখনই অফার দেখুন
          </Button>

          {/* Supported Operators */}
          <div className="mt-8">
            <p className="text-gray-500 mb-4">সব অপারেটরের অফার পাবেন:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {operators.map((operator) => (
                <Badge key={operator} variant="outline" className="px-3 py-1">
                  {operator}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">কিভাবে কাজ করে?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">১</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">অফার খুঁজুন</h3>
              <p className="text-gray-600">আপনার বাজেট ও প্রয়োজন অনুযায়ী সেরা অফার খুঁজুন</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">২</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">WhatsApp এ অর্ডার</h3>
              <p className="text-gray-600">একটি ক্লিকেই WhatsApp এ অর্ডার করুন</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">৩</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">তাৎক্ষণিক অ্যাক্টিভ</h3>
              <p className="text-gray-600">১ মিনিটের মধ্যে আপনার নম্বরে অ্যাক্টিভ হবে</p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">গ্রাহকদের মতামত</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-3">"{testimonial.text}"</p>
                <div className="text-sm text-gray-500">
                  <strong>{testimonial.name}</strong> - {testimonial.location}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">আজই শুরু করুন এবং সাশ্রয় করুন!</h2>
          <p className="mb-6 opacity-90">হাজারো অফার থেকে আপনার জন্য সেরাটি খুঁজে নিন</p>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-semibold"
          >
            <Clock className="w-5 h-5 mr-2" />
            এখনই শুরু করুন - ফ্রি!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
