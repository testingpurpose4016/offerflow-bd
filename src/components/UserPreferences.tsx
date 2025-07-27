import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, User, Smartphone, DollarSign, Clock, Zap } from "lucide-react";
import { OPERATORS, CATEGORIES, STORAGE_KEYS } from "@/constants";

interface UserPreference {
  budget: [number, number];
  preferredOperators: string[];
  preferredCategories: string[];
  maxValidity: number;
  autoFilter: boolean;
  showLandingPage: boolean;
}

const defaultPreferences: UserPreference = {
  budget: [0, 1000],
  preferredOperators: [],
  preferredCategories: [],
  maxValidity: 30,
  autoFilter: false,
  showLandingPage: true,
};

interface UserPreferencesProps {
  onPreferencesChange?: (preferences: UserPreference) => void;
}

const UserPreferences = ({ onPreferencesChange }: UserPreferencesProps) => {
  const [preferences, setPreferences] = useState<UserPreference>(defaultPreferences);
  const [isOpen, setIsOpen] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FILTERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Failed to parse preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: UserPreference) => {
    setPreferences(newPreferences);
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(newPreferences));
    onPreferencesChange?.(newPreferences);
  };

  const toggleOperator = (operator: string) => {
    const newOperators = preferences.preferredOperators.includes(operator)
      ? preferences.preferredOperators.filter(op => op !== operator)
      : [...preferences.preferredOperators, operator];
    
    savePreferences({
      ...preferences,
      preferredOperators: newOperators
    });
  };

  const toggleCategory = (category: string) => {
    const newCategories = preferences.preferredCategories.includes(category)
      ? preferences.preferredCategories.filter(cat => cat !== category)
      : [...preferences.preferredCategories, category];
    
    savePreferences({
      ...preferences,
      preferredCategories: newCategories
    });
  };

  const resetPreferences = () => {
    savePreferences(defaultPreferences);
    localStorage.removeItem(STORAGE_KEYS.VISITED);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
          <Settings size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            ব্যক্তিগত পছন্দ
          </DialogTitle>
          <DialogDescription>
            আপনার পছন্দ অনুযায়ী অফার দেখুন
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Budget Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                বাজেট রেঞ্জ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Slider
                  value={preferences.budget}
                  onValueChange={(value) => savePreferences({
                    ...preferences,
                    budget: value as [number, number]
                  })}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>৳{preferences.budget[0]}</span>
                  <span>৳{preferences.budget[1]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferred Operators */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                পছন্দের অপারেটর
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.values(OPERATORS).map((operator) => (
                  <Badge
                    key={operator}
                    variant={preferences.preferredOperators.includes(operator) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleOperator(operator)}
                  >
                    {operator}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preferred Categories */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                পছন্দের ক্যাটেগরি
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORIES).map(([key, value]) => {
                  if (key === 'ALL') return null;
                  const label = key === 'DATA' ? 'ডেটা' : 
                               key === 'COMBO' ? 'কম্বো' :
                               key === 'MINUTES' ? 'মিনিট' : 'SMS';
                  return (
                    <Badge
                      key={value}
                      variant={preferences.preferredCategories.includes(value) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-green-100"
                      onClick={() => toggleCategory(value)}
                    >
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Max Validity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                সর্বোচ্চ মেয়াদ: {preferences.maxValidity} দিন
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                value={[preferences.maxValidity]}
                onValueChange={(value) => savePreferences({
                  ...preferences,
                  maxValidity: value[0]
                })}
                max={365}
                min={7}
                step={7}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-filter" className="text-sm">
                  স্বয়ংক্রিয় ফিল্টার
                </Label>
                <Switch
                  id="auto-filter"
                  checked={preferences.autoFilter}
                  onCheckedChange={(checked) => savePreferences({
                    ...preferences,
                    autoFilter: checked
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-landing" className="text-sm">
                  হোম পেজ দেখান
                </Label>
                <Switch
                  id="show-landing"
                  checked={preferences.showLandingPage}
                  onCheckedChange={(checked) => savePreferences({
                    ...preferences,
                    showLandingPage: checked
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={resetPreferences}
              variant="outline" 
              className="flex-1"
            >
              রিসেট করুন
            </Button>
            <Button 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              সংরক্ষণ করুন
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserPreferences;
